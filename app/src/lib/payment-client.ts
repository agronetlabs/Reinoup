import { supabase } from './supabase';

export async function paymentHeaders(familyId: string | null): Promise<Record<string, string>> {
  if (!supabase || !familyId) throw new Error('Entre na conta online do responsável para pagar.');
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session || data.session.user.id !== familyId) throw new Error('Entre novamente na conta do responsável para pagar.');
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session.access_token}` };
}

// Retorno do checkout é apenas navegação; a confirmação vem da consulta ao banco.
export function paymentReturnMessage(status: string | null): string | null {
  if (status === 'success') return 'Pagamento enviado. Aguardando confirmação do provedor. Não pague novamente enquanto aguarda.';
  if (status === 'cancelled') return 'Checkout cancelado. Nenhuma assinatura foi ativada por este retorno.';
  return null;
}
