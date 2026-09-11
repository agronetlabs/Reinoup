import { expectedAmount, paidUntil } from '../../shared/billing';
import { lerReferencia, registrarAssinaturaPaga, supabaseConfigurado, type SupabaseEnv } from './_supabase';
import { baseUrl } from './pagbank-criar-pedido';
import { equalSignature, sha256Hex } from './_signature';

interface Env extends SupabaseEnv { PAGBANK_TOKEN: string; PAGBANK_ENV?: string }
interface Order {
  id: string;
  reference_id: string;
  charges?: {
    status: string; paid_at?: string;
    amount?: { value: number; currency: string; summary?: { paid: number; refunded: number } };
    payment_method?: { type: string };
  }[];
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  if (!env.PAGBANK_TOKEN || !supabaseConfigurado(env) || (env.PAGBANK_ENV && !['sandbox', 'production'].includes(env.PAGBANK_ENV))) {
    return new Response('Webhook indisponível.', { status: 503 });
  }
  const raw = await request.text();
  if (!equalSignature(await sha256Hex(`${env.PAGBANK_TOKEN}-${raw}`), request.headers.get('x-authenticity-token'))) {
    return new Response('Assinatura inválida.', { status: 401 });
  }
  let event;
  try { event = JSON.parse(raw) as Order; }
  catch { return new Response('Corpo inválido.', { status: 400 }); }
  if (!event || typeof event.id !== 'string' || !/^ORDE_[\w-]+$/.test(event.id)) return new Response('Pedido inválido.', { status: 400 });
  try {
    // O hash não inclui timestamp. Consultar o estado atual impede replay de PAID após estorno.
    const response = await fetch(`${baseUrl(env)}/orders/${encodeURIComponent(event.id)}`, {
      headers: { Authorization: `Bearer ${env.PAGBANK_TOKEN}` },
    });
    if (!response.ok) return new Response('Falha ao consultar pedido.', { status: 502 });
    const order = await response.json() as Order;
    if (order.id !== event.id || typeof order.reference_id !== 'string') return new Response('Pedido divergente.', { status: 400 });
    const reference = lerReferencia(order.reference_id);
    if (!reference) return new Response('Referência inválida.', { status: 400 });
    if (order.charges?.length !== 1) return new Response('ok');
    const charge = order.charges[0];
    if (!['PAID', 'CANCELED'].includes(charge.status)) return new Response('ok');
    const amount = expectedAmount(reference.plano, reference.ciclo, reference.version);
    if (amount === null || charge.amount?.value !== amount || charge.amount?.currency !== 'BRL' ||
        charge.payment_method?.type !== 'PIX' || !charge.paid_at || !Number.isFinite(Date.parse(charge.paid_at))) {
      return new Response('Pagamento inválido.', { status: 400 });
    }
    const refunded = charge.status === 'CANCELED' || (charge.amount.summary?.refunded ?? 0) > 0;
    if (!refunded && charge.amount.summary?.paid !== amount) return new Response('Montante não liquidado.', { status: 400 });
    const ok = await registrarAssinaturaPaga(env, {
      provedor: 'pagbank', referencia: order.reference_id, provedorId: order.id,
      plano: reference.plano, ciclo: reference.ciclo, familyId: reference.familyId,
      valorCentavos: amount, paidAt: charge.paid_at,
      validUntil: refunded ? charge.paid_at : paidUntil(reference.ciclo, charge.paid_at),
      // Estorno é terminal para o pedido. Duplicatas PAID nunca estendem a validade.
      eventCreated: Math.floor(Date.parse(charge.paid_at) / 1000) + (refunded ? 1 : 0),
    });
    return new Response(ok ? 'ok' : 'Falha ao registrar assinatura.', { status: ok ? 200 : 500 });
  } catch {
    return new Response('Falha temporária ao confirmar pagamento.', { status: 502 });
  }
};
