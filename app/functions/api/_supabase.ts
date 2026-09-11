import { isCycle, isFamilyId, isPlanId, type Cycle, type PlanId } from '../../shared/billing';

export interface SupabaseEnv {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

export function supabaseConfigurado(env: SupabaseEnv): boolean {
  return Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}

function headers(env: SupabaseEnv) {
  return {
    apikey: env.SUPABASE_SERVICE_ROLE_KEY!,
    Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
  };
}

export async function authenticateFamily(request: Request, env: SupabaseEnv, claimed?: unknown): Promise<string | Response> {
  if (!supabaseConfigurado(env)) return Response.json({ error: 'Pagamento indisponível. Tente mais tarde.' }, { status: 503 });
  const authorization = request.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) return Response.json({ error: 'Entre na conta do responsável para pagar.' }, { status: 401 });
  try {
    const response = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY!, Authorization: authorization },
    });
    if (!response.ok) return Response.json({ error: 'Sessão inválida. Entre novamente.' }, { status: response.status >= 500 ? 503 : 401 });
    const user = await response.json() as { id?: string };
    if (!isFamilyId(user.id)) return Response.json({ error: 'Sessão inválida.' }, { status: 401 });
    if (claimed != null && claimed !== user.id) return Response.json({ error: 'Conta divergente da sessão.' }, { status: 403 });
    return user.id;
  } catch {
    return Response.json({ error: 'Não foi possível verificar a conta. Tente novamente.' }, { status: 503 });
  }
}

export interface ConfirmedPayment {
  provedor: 'stripe' | 'pagbank';
  referencia: string;
  provedorId: string;
  plano: PlanId;
  ciclo: Cycle;
  valorCentavos: number;
  familyId: string;
  paidAt: string;
  validUntil: string;
  eventCreated: number;
}

export async function registrarAssinaturaPaga(env: SupabaseEnv, payment: ConfirmedPayment): Promise<boolean> {
  if (!supabaseConfigurado(env)) return false;
  const response = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/registrar_assinatura_confirmada`, {
    method: 'POST',
    headers: headers(env),
    body: JSON.stringify({ dados: {
      family_id: payment.familyId, plano: payment.plano, ciclo: payment.ciclo, status: 'ativa',
      provedor: payment.provedor, referencia: payment.referencia, provedor_id: payment.provedorId,
      valor_centavos: payment.valorCentavos, pago_em: payment.paidAt, vigente_ate: payment.validUntil,
      webhook_event_at: payment.eventCreated,
    } }),
  });
  return response.ok;
}

export async function legacySubscription(env: SupabaseEnv, subscriptionId: string) {
  const query = new URLSearchParams({
    provedor: 'eq.stripe', provedor_id: `eq.${subscriptionId}`,
    select: 'family_id,plano,ciclo', limit: '1',
  });
  const response = await fetch(`${env.SUPABASE_URL}/rest/v1/subscriptions?${query}`, { headers: headers(env) });
  if (!response.ok) throw new Error('Falha ao consultar assinatura.');
  const rows = await response.json() as { family_id: string; plano: PlanId; ciclo: Cycle }[];
  return rows[0];
}

export async function endStripeSubscription(env: SupabaseEnv, subscriptionId: string, eventCreated: number, endedAt: number) {
  const response = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/encerrar_assinatura_stripe`, {
    method: 'POST', headers: headers(env),
    body: JSON.stringify({ subscription_id: subscriptionId, event_created: eventCreated, ended_at: new Date(endedAt * 1000).toISOString() }),
  });
  return response.ok;
}

export function lerReferencia(reference: string) {
  const compact = /^ru2-([ma])-([0-9a-f]{32})-([0-9a-f]{24})$/i.exec(reference);
  if (compact) {
    const id = compact[2];
    const familyId = `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`;
    return { plano: 'completo' as const, ciclo: compact[1].toLowerCase() === 'm' ? 'mensal' as const : 'anual' as const, familyId, version: '2026-09' };
  }
  const parts = reference.split('-');
  const [prefix, plan, cycle, stamp] = parts;
  const version = stamp === 'v2' ? '2026-09' : undefined;
  const timestamp = version ? parts[4] : stamp;
  const familyId = parts.slice(version ? 6 : 4).join('-');
  if (prefix !== 'reinoup' || !isPlanId(plan) || !isCycle(cycle) || !/^\d+$/.test(timestamp ?? '') || !isFamilyId(familyId)) return null;
  return { plano: plan, ciclo: cycle, familyId, version };
}
