import { expectedAmount, isCycle, isFamilyId, isPlanId } from '../../shared/billing';
import { endStripeSubscription, legacySubscription, registrarAssinaturaPaga, supabaseConfigurado, type SupabaseEnv } from './_supabase';
import { verifyStripeSignature } from './_signature';
import { STRIPE_API_VERSION } from './create-checkout-session';

interface Env extends SupabaseEnv { STRIPE_WEBHOOK_SECRET: string; STRIPE_SECRET_KEY: string }
interface Metadata { planId?: string; cycle?: string; familyId?: string; priceVersion?: string }
interface Invoice {
  id: string; status: string; amount_paid: number; total: number; currency: string;
  status_transitions: { paid_at: number | null };
  lines: { data: { amount: number; period: { start: number; end: number } }[] };
  parent?: { subscription_details?: { subscription?: string } };
  subscription?: string;
}
interface Subscription {
  id: string; status: string; metadata: Metadata; ended_at: number | null;
  latest_invoice: Invoice | null;
}
interface Event {
  id: string; type: string; created: number;
  data: { object: {
    id: string; subscription?: string; metadata?: Metadata; payment_status?: string;
    parent?: Invoice['parent'];
  } };
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  if (!env.STRIPE_WEBHOOK_SECRET || !env.STRIPE_SECRET_KEY || !supabaseConfigurado(env)) {
    return new Response('Webhook indisponível.', { status: 503 });
  }
  const raw = await request.text();
  if (!await verifyStripeSignature(raw, request.headers.get('stripe-signature'), env.STRIPE_WEBHOOK_SECRET)) {
    return new Response('Assinatura inválida.', { status: 400 });
  }
  let event: Event;
  try { event = JSON.parse(raw); }
  catch { return new Response('Corpo inválido.', { status: 400 }); }
  if (!event?.data?.object || !event.id || !Number.isInteger(event.created)) return new Response('Evento inválido.', { status: 400 });
  const supported = ['checkout.session.completed', 'checkout.session.async_payment_succeeded',
    'invoice.paid', 'invoice.payment_failed', 'customer.subscription.updated', 'customer.subscription.deleted'];
  if (!supported.includes(event.type)) return Response.json({ received: true });
  const object = event.data.object;
  if (event.type.startsWith('checkout.') && object.payment_status !== 'paid') return Response.json({ received: true });
  const subscriptionId = event.type.startsWith('customer.subscription.') ? object.id
    : object.subscription ?? object.parent?.subscription_details?.subscription;
  if (typeof subscriptionId !== 'string' || !/^sub_[\w]+$/.test(subscriptionId)) return new Response('Assinatura ausente.', { status: 400 });
  try {
    // Não confiar na ordem de entrega: sempre reconciliar com o estado atual do provedor.
    const response = await fetch(`https://api.stripe.com/v1/subscriptions/${encodeURIComponent(subscriptionId)}?expand[]=latest_invoice`, {
      headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, 'Stripe-Version': STRIPE_API_VERSION },
    });
    if (!response.ok) return new Response('Falha ao consultar assinatura.', { status: 502 });
    const subscription = await response.json() as Subscription;
    if (subscription.id !== subscriptionId) return new Response('Assinatura divergente.', { status: 400 });
    const ended = subscription.status === 'canceled' || subscription.status === 'unpaid' || subscription.status === 'incomplete_expired';
    if (ended) {
      const ok = await endStripeSubscription(env, subscriptionId, event.created, subscription.ended_at ?? event.created);
      return new Response(ok ? 'ok' : 'Falha ao encerrar assinatura.', { status: ok ? 200 : 500 });
    }
    const invoice = subscription.latest_invoice;
    // Falha de renovação não cria outro período: o período já pago expira no banco.
    if (!invoice || invoice.status !== 'paid') return Response.json({ received: true });
    let metadata = subscription.metadata ?? {};
    if (!metadata.familyId) {
      // Checkouts antigos só gravavam metadata na sessão, não na assinatura.
      const legacy = await legacySubscription(env, subscriptionId);
      metadata = legacy ? { planId: legacy.plano, cycle: legacy.ciclo, familyId: legacy.family_id }
        : event.type.startsWith('checkout.') ? object.metadata ?? {} : {};
    }
    const { planId, cycle, familyId, priceVersion } = metadata;
    if (!isPlanId(planId) || !isCycle(cycle) || !isFamilyId(familyId)) return new Response('Metadata inválida.', { status: 400 });
    const amount = expectedAmount(planId, cycle, priceVersion);
    const line = invoice.lines?.data[0];
    const paidAt = invoice.status_transitions?.paid_at;
    if (amount === null || invoice.amount_paid !== amount || invoice.total !== amount || invoice.currency !== 'brl' ||
        invoice.lines?.data.length !== 1 || line?.amount !== amount || !paidAt ||
        !Number.isFinite(line.period?.end) || !Number.isFinite(line.period?.start) || line.period.end <= line.period.start) {
      return new Response('Montante ou período inválido.', { status: 400 });
    }
    if (subscription.status !== 'active' && subscription.status !== 'past_due') return Response.json({ received: true });
    const ok = await registrarAssinaturaPaga(env, {
      provedor: 'stripe', referencia: subscriptionId, provedorId: subscriptionId, plano: planId, ciclo: cycle,
      familyId, valorCentavos: amount, paidAt: new Date(paidAt * 1000).toISOString(),
      validUntil: new Date(line.period.end * 1000).toISOString(), eventCreated: event.created,
    });
    return new Response(ok ? 'ok' : 'Falha ao registrar assinatura.', { status: ok ? 200 : 500 });
  } catch {
    return new Response('Falha temporária ao confirmar pagamento.', { status: 502 });
  }
};
