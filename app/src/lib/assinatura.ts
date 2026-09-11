import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';
import { useAuthStore } from '../store/authStore';
import { isCycle, isPlanId, type Cycle, type PlanId } from '../../shared/billing';

export type Plano = PlanId;
export interface ConfirmedSubscription {
  plano: Plano;
  ciclo: Cycle;
  vigente_ate: string | null;
}
export interface EstadoAssinatura {
  plano: Plano | null;
  ciclo: Cycle | null;
  origem: 'servidor';
  carregando: boolean;
  erro: boolean;
}

export function validSubscription(row: unknown, now = Date.now()): row is ConfirmedSubscription {
  if (!row || typeof row !== 'object') return false;
  const value = row as ConfirmedSubscription;
  return isPlanId(value.plano) && isCycle(value.ciclo) &&
    (value.vigente_ate === null || (typeof value.vigente_ate === 'string' && Date.parse(value.vigente_ate) > now));
}

export async function buscarAssinaturaAtiva(familyId: string): Promise<ConfirmedSubscription | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('subscriptions')
    .select('plano, ciclo, vigente_ate').eq('family_id', familyId).eq('status', 'ativa')
    .order('vigente_ate', { ascending: false, nullsFirst: true }).limit(1);
  if (error) throw new Error('Não foi possível consultar a assinatura.');
  return validSubscription(data?.[0]) ? data![0] as ConfirmedSubscription : null;
}

export function useAssinatura(refreshMs = 60_000): EstadoAssinatura {
  const familyId = useAuthStore(s => s.familyId);
  const authenticated = useAuthStore(s => s.isAuthenticated);
  const [result, setResult] = useState<{ familyId: string; subscription: ConfirmedSubscription | null; error: boolean } | null>(null);
  useEffect(() => {
    if (!supabase || !familyId || !authenticated) return;
    let active = true;
    let querying = false;
    const refresh = async () => {
      if (querying) return;
      querying = true;
      try {
        const subscription = await buscarAssinaturaAtiva(familyId);
        if (active) setResult({ familyId, subscription, error: false });
      } catch {
        if (active) setResult({ familyId, subscription: null, error: true });
      } finally { querying = false; }
    };
    void refresh();
    const timer = setInterval(() => { void refresh(); }, refreshMs);
    window.addEventListener('focus', refresh);
    return () => { active = false; clearInterval(timer); window.removeEventListener('focus', refresh); };
  }, [familyId, authenticated, refreshMs]);
  const current = authenticated && familyId && result?.familyId === familyId ? result : null;
  const subscription = validSubscription(current?.subscription) ? current!.subscription : null;
  return {
    plano: subscription?.plano ?? null, ciclo: subscription?.ciclo ?? null, origem: 'servidor',
    carregando: Boolean(isSupabaseConfigured && authenticated && familyId && !current),
    erro: current?.error ?? false,
  };
}

/** Qualquer contrato pago vigente, inclusive legado, inclui todos os recursos. */
export function planoCobre(plano: Plano | null, _recurso: 'relatorios' | 'jogos' | 'missoes'): boolean {
  return isPlanId(plano);
}
