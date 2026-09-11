-- Aplicar antes das novas Functions. Não muda preços nem apaga contratos antigos.
begin;
alter table public.subscriptions add column if not exists webhook_event_at bigint not null default 0;
alter table public.subscriptions enable row level security;
alter table public.subscriptions force row level security;
create index if not exists subscriptions_provider_id_idx on public.subscriptions (provedor, provedor_id);
create index if not exists subscriptions_family_id_idx on public.subscriptions (family_id);

-- Guarda o encerramento mesmo quando ele chega antes do primeiro checkout pago.
create table if not exists public.stripe_subscription_cancellations (
  subscription_id text primary key,
  event_created bigint not null,
  ended_at timestamptz not null
);
alter table public.stripe_subscription_cancellations enable row level security;
alter table public.stripe_subscription_cancellations force row level security;
revoke all on public.stripe_subscription_cancellations from public, anon, authenticated;
grant select, insert, update on public.stripe_subscription_cancellations to service_role;

create or replace function public.registrar_assinatura_confirmada(dados jsonb)
returns void language plpgsql security invoker set search_path = public as $$
declare
  incoming public.subscriptions;
  previous public.subscriptions;
begin
  incoming := jsonb_populate_record(null::public.subscriptions, dados);
  if incoming.family_id is null or incoming.vigente_ate is null or incoming.pago_em is null
     or incoming.valor_centavos <= 0 or incoming.webhook_event_at <= 0
     or incoming.provedor not in ('stripe', 'pagbank') then
    raise exception 'Confirmação incompleta';
  end if;
  perform pg_advisory_xact_lock(hashtextextended(incoming.provedor || ':' || incoming.provedor_id, 0));
  if incoming.provedor = 'stripe' and exists (
    select 1 from public.stripe_subscription_cancellations
    where subscription_id = incoming.provedor_id and event_created >= incoming.webhook_event_at
  ) then return; end if;
  select * into previous from public.subscriptions
    where provedor = incoming.provedor and referencia = incoming.referencia for update;
  if found then
    if previous.family_id is distinct from incoming.family_id then
      raise exception 'Família divergente';
    end if;
    -- Mesmo evento só pode encurtar acesso (cancelamento), nunca renová-lo.
    if previous.webhook_event_at > incoming.webhook_event_at or
       (previous.webhook_event_at = incoming.webhook_event_at and previous.vigente_ate <= incoming.vigente_ate) then
      return;
    end if;
  end if;
  insert into public.subscriptions
    (family_id, plano, ciclo, status, provedor, referencia, provedor_id,
     valor_centavos, pago_em, vigente_ate, webhook_event_at)
  values
    (incoming.family_id, incoming.plano, incoming.ciclo, incoming.status, incoming.provedor,
     incoming.referencia, incoming.provedor_id, incoming.valor_centavos,
     incoming.pago_em, incoming.vigente_ate, incoming.webhook_event_at)
  on conflict (provedor, referencia) do update set
    plano = excluded.plano, ciclo = excluded.ciclo, status = excluded.status,
    valor_centavos = excluded.valor_centavos, pago_em = excluded.pago_em,
    vigente_ate = excluded.vigente_ate, webhook_event_at = excluded.webhook_event_at;
  -- Versão antiga usava cs_... como referência. O snapshot sub_... a substitui
  -- só após confirmação, sem deixar uma linha antiga sobreviver ao cancelamento.
  if incoming.provedor = 'stripe' then
    update public.subscriptions set vigente_ate = least(vigente_ate, incoming.vigente_ate),
      webhook_event_at = greatest(webhook_event_at, incoming.webhook_event_at)
    where provedor = 'stripe' and provedor_id = incoming.provedor_id and referencia <> incoming.referencia;
  end if;
end;
$$;
revoke all on function public.registrar_assinatura_confirmada(jsonb) from public, anon, authenticated;
grant execute on function public.registrar_assinatura_confirmada(jsonb) to service_role;

create or replace function public.encerrar_assinatura_stripe(subscription_id text, event_created bigint, ended_at timestamptz)
returns void language plpgsql security invoker set search_path = public as $$
begin
  perform pg_advisory_xact_lock(hashtextextended('stripe:' || subscription_id, 0));
  insert into public.stripe_subscription_cancellations as current (subscription_id, event_created, ended_at)
    values (subscription_id, event_created, ended_at)
    on conflict on constraint stripe_subscription_cancellations_pkey do update
      set event_created = excluded.event_created, ended_at = least(current.ended_at, excluded.ended_at)
      where current.event_created <= excluded.event_created;
  update public.subscriptions
    set vigente_ate = least(vigente_ate, ended_at), webhook_event_at = event_created
    where provedor = 'stripe' and provedor_id = subscription_id and webhook_event_at <= event_created;
end;
$$;
revoke all on function public.encerrar_assinatura_stripe(text, bigint, timestamptz) from public, anon, authenticated;
grant execute on function public.encerrar_assinatura_stripe(text, bigint, timestamptz) to service_role;
commit;
