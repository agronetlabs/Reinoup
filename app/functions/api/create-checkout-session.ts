import { PAID_PLAN_ID, PRICE_CENTS, PRICE_VERSION, isCycle } from '../../shared/billing';
import { authenticateFamily, type SupabaseEnv } from './_supabase';

export interface Env extends SupabaseEnv { STRIPE_SECRET_KEY: string }
export const STRIPE_API_VERSION = '2025-06-30.basil';

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  if (!env.STRIPE_SECRET_KEY) return Response.json({ error: 'Pagamento indisponível. Tente mais tarde.' }, { status: 503 });
  let body;
  try { body = await request.json() as Record<string, unknown>; }
  catch { return Response.json({ error: 'Corpo inválido.' }, { status: 400 }); }
  const { planId, cycle, familyId } = body ?? {};
  if (planId !== PAID_PLAN_ID || !isCycle(cycle)) return Response.json({ error: 'Plano ou ciclo inválido.' }, { status: 400 });
  const family = await authenticateFamily(request, env, familyId);
  if (family instanceof Response) return family;
  const origin = new URL(request.url).origin;
  const params = new URLSearchParams({
    mode: 'subscription',
    success_url: `${origin}/app/planos?status=success`,
    cancel_url: `${origin}/app/planos?status=cancelled`,
    'line_items[0][quantity]': '1',
    'line_items[0][price_data][currency]': 'brl',
    'line_items[0][price_data][unit_amount]': String(PRICE_CENTS[cycle]),
    'line_items[0][price_data][recurring][interval]': cycle === 'anual' ? 'year' : 'month',
    'line_items[0][price_data][product_data][name]': `ReinoUp (${cycle}) — conta do responsável`,
    client_reference_id: family,
  });
  for (const [key, value] of Object.entries({ planId, cycle, familyId: family, priceVersion: PRICE_VERSION })) {
    params.set(`metadata[${key}]`, value);
    params.set(`subscription_data[metadata][${key}]`, value);
  }
  try {
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded', 'Stripe-Version': STRIPE_API_VERSION },
      body: params.toString(),
    });
    const data = await response.json() as { url?: string };
    if (!response.ok || !data.url) throw new Error();
    return Response.json({ url: data.url });
  } catch {
    return Response.json({ error: 'Não foi possível iniciar o pagamento. Tente novamente.' }, { status: 502 });
  }
};
