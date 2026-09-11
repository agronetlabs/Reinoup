import { MAX_CHILD_PROFILES, PAID_PLAN_ID, PRICE_CENTS } from '../../shared/billing';

export const PLANS = [{
  id: PAID_PLAN_ID,
  name: 'ReinoUp',
  prices: PRICE_CENTS,
  features: [
    'Todos os recursos atuais incluídos',
    'Histórias, versículo do dia, quiz e desafios diários',
    'Jogos, missões, relatórios dos pais e avatares',
    `Até ${MAX_CHILD_PROFILES} perfis infantis por conta do responsável`,
  ],
}] as const;
