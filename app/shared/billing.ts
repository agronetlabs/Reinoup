// "completo" permanece como ID persistido para não invalidar assinaturas existentes.
export const PAID_PLAN_ID = 'completo' as const;
export const PRICE_VERSION = '2026-09';
export type PlanId = 'essencial' | 'completo' | 'familia';
export type Cycle = 'mensal' | 'anual';
export const PRICE_CENTS = { mensal: 998, anual: 9581 } as const;
export const MAX_CHILD_PROFILES = 4;
export const isCycle = (value: unknown): value is Cycle => value === 'mensal' || value === 'anual';
export const isPlanId = (value: unknown): value is PlanId =>
  value === 'essencial' || value === 'completo' || value === 'familia';
export const isFamilyId = (value: unknown): value is string =>
  typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
export const formatCents = (cents: number) => (cents / 100).toFixed(2).replace('.', ',');

// Apenas confirmação de contratos antigos; não são ofertas disponíveis no checkout.
const LEGACY_CENTS = {
  essencial: { mensal: 1090, anual: 10464 },
  completo: { mensal: 1990, anual: 19104 },
  familia: { mensal: 2990, anual: 28704 },
} as const;

export function expectedAmount(plan: PlanId, cycle: Cycle, version?: string): number | null {
  if (version === PRICE_VERSION) return plan === PAID_PLAN_ID ? PRICE_CENTS[cycle] : null;
  if (version) return null;
  return LEGACY_CENTS[plan][cycle];
}

/** Soma meses civis em UTC, sem transformar 31/jan em março. */
export function paidUntil(cycle: Cycle, paidAt: string): string {
  const start = new Date(paidAt);
  const end = new Date(start);
  const day = start.getUTCDate();
  end.setUTCDate(1);
  end.setUTCMonth(end.getUTCMonth() + (cycle === 'anual' ? 12 : 1));
  const lastDay = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() + 1, 0)).getUTCDate();
  end.setUTCDate(Math.min(day, lastDay));
  return end.toISOString();
}
