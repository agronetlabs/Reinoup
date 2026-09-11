-- Executar após 202609100001_payment_confirmation.sql no ambiente de teste.
-- Não chama provedores. Tudo é revertido, inclusive usuários criados.
begin;
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, created_at, updated_at)
values ('aaaaaaaa-0000-4000-8000-000000000003', '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'billing@teste.local', '', now(), now()),
  ('bbbbbbbb-0000-4000-8000-000000000004', '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'billing.other@teste.local', '', now(), now());

set local role service_role;

do $$
declare
  payment jsonb := '{
    "family_id":"aaaaaaaa-0000-4000-8000-000000000003","plano":"completo","ciclo":"mensal",
    "status":"ativa","provedor":"stripe","referencia":"sub_test_payment","provedor_id":"sub_test_payment",
    "valor_centavos":998,"pago_em":"2026-09-10T22:00:00Z","vigente_ate":"2026-10-10T22:00:00Z",
    "webhook_event_at":1789077600
  }';
  expiry timestamptz;
begin
  if has_function_privilege('authenticated', 'public.registrar_assinatura_confirmada(jsonb)', 'execute') or
     has_function_privilege('anon', 'public.registrar_assinatura_confirmada(jsonb)', 'execute') or
     has_function_privilege('authenticated', 'public.encerrar_assinatura_stripe(text,bigint,timestamptz)', 'execute') or
     has_function_privilege('anon', 'public.encerrar_assinatura_stripe(text,bigint,timestamptz)', 'execute') then
    raise exception 'Cliente pode escrever confirmação!';
  end if;
  perform public.registrar_assinatura_confirmada(payment);
  perform public.registrar_assinatura_confirmada(payment);
  if (select count(*) from public.subscriptions where referencia = 'sub_test_payment') <> 1 then
    raise exception 'Duplicata de pagamento';
  end if;
  perform public.encerrar_assinatura_stripe('sub_test_payment', 1789164000, '2026-09-11T22:00:00Z');
  perform public.registrar_assinatura_confirmada(payment);
  select vigente_ate into expiry from public.subscriptions where referencia = 'sub_test_payment';
  if expiry is distinct from '2026-09-11T22:00:00Z'::timestamptz then raise exception 'Replay reativou acesso'; end if;

  -- Encerramento chega antes do primeiro evento de pagamento.
  perform public.encerrar_assinatura_stripe('sub_test_early', 1789164000, '2026-09-11T22:00:00Z');
  payment := payment || '{"referencia":"sub_test_early","provedor_id":"sub_test_early"}';
  perform public.registrar_assinatura_confirmada(payment);
  if exists (select 1 from public.subscriptions where referencia = 'sub_test_early') then
    raise exception 'Pagamento atrasado ignorou encerramento anterior';
  end if;

  -- PIX é por pagamento. Duplicatas não empurram a expiração.
  payment := payment || '{"provedor":"pagbank","referencia":"pix_test","provedor_id":"ORDE_test"}';
  perform public.registrar_assinatura_confirmada(payment);
  perform public.registrar_assinatura_confirmada(payment);
  select vigente_ate into expiry from public.subscriptions where referencia = 'pix_test';
  if expiry is distinct from '2026-10-10T22:00:00Z'::timestamptz then raise exception 'PIX duplicado renovou acesso'; end if;
  payment := payment || '{"vigente_ate":"2026-09-10T22:00:00Z","webhook_event_at":1789077601}';
  perform public.registrar_assinatura_confirmada(payment);
  payment := payment || '{"vigente_ate":"2026-10-10T22:00:00Z","webhook_event_at":1789077600}';
  perform public.registrar_assinatura_confirmada(payment);
  select vigente_ate into expiry from public.subscriptions where referencia = 'pix_test';
  if expiry is distinct from '2026-09-10T22:00:00Z'::timestamptz then raise exception 'Replay de PIX estornado reativou acesso'; end if;

  payment := payment || '{
    "family_id":"bbbbbbbb-0000-4000-8000-000000000004",
    "referencia":"pix_test_other","provedor_id":"ORDE_test_other"
  }';
  perform public.registrar_assinatura_confirmada(payment);
end;
$$;
reset role;
set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-0000-4000-8000-000000000003","role":"authenticated"}';
do $$
declare
  changed integer;
begin
  if (select count(*) from public.subscriptions where referencia in ('sub_test_payment', 'pix_test')) <> 2 then
    raise exception 'Responsável não consegue ler suas assinaturas';
  end if;
  if exists (select 1 from public.subscriptions where referencia = 'pix_test_other') then
    raise exception 'RLS expôs assinatura de outra família';
  end if;
  update public.subscriptions set vigente_ate = '2099-01-01T00:00:00Z'
    where referencia in ('sub_test_payment', 'pix_test_other');
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'Cliente alterou validade da assinatura'; end if;
  begin
    perform public.registrar_assinatura_confirmada('{}'::jsonb);
    raise exception 'Cliente executou confirmação de pagamento';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.encerrar_assinatura_stripe('sub_test_payment', 1789164000, now());
    raise exception 'Cliente executou cancelamento';
  exception when insufficient_privilege then null;
  end;
end;
$$;
reset role;
select 'payment_confirmation_and_rls_passed' as result;
rollback;
