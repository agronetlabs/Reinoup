/**
 * Cria um pedido no PagBank com QR Code PIX para uma assinatura do ReinoUp.
 *
 * Roda como Cloudflare Pages Function, no mesmo padrão da integração Stripe.
 * Precisa de PAGBANK_TOKEN configurado como variável de ambiente.
 *
 * Por que PIX e não cartão recorrente: no Brasil o PIX é o meio que o pai usa,
 * cai na hora e não tem taxa de cartão. A contrapartida está documentada no
 * fim deste arquivo — a API de Pedidos é pagamento avulso, não assinatura.
 *
 * Docs: https://developer.pagbank.com.br/reference/criar-pedido
 */

import { PAID_PLAN_ID, PRICE_CENTS, isCycle } from '../../shared/billing';
import { authenticateFamily, type SupabaseEnv } from './_supabase';

interface Env extends SupabaseEnv {
  PAGBANK_TOKEN: string;
  /** 'sandbox' (padrão) ou 'production'. */
  PAGBANK_ENV?: string;
}

/** O QR Code expira em 30 min — tempo de sobra sem deixar cobrança pendurada. */
const MINUTOS_ATE_EXPIRAR = 30;

/** CPF sem máscara, 11 dígitos — o PagBank exige `tax_id` para emitir PIX. */
function limparCpf(valor: unknown): string | null {
  if (typeof valor !== 'string') return null;
  const digitos = valor.replace(/\D/g, '');
  return digitos.length === 11 ? digitos : null;
}

export function baseUrl(env: Pick<Env, 'PAGBANK_ENV'>): string {
  return env.PAGBANK_ENV === 'production'
    ? 'https://api.pagseguro.com'
    : 'https://sandbox.api.pagseguro.com';
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  if (!env.PAGBANK_TOKEN || (env.PAGBANK_ENV && !['sandbox', 'production'].includes(env.PAGBANK_ENV))) {
    return Response.json(
      { error: 'Pagamento via PagBank não configurado neste ambiente (falta PAGBANK_TOKEN).' },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Corpo da requisição inválido.' }, { status: 400 });
  }

  const { planId, cycle, nome, email, cpf, familyId } = (body ?? {}) as Record<string, unknown>;

  if (planId !== PAID_PLAN_ID || !isCycle(cycle)) {
    return Response.json({ error: 'planId ou cycle inválido.' }, { status: 400 });
  }
  const familia = await authenticateFamily(request, env, familyId);
  if (familia instanceof Response) return familia;
  if (typeof nome !== 'string' || nome.trim().length < 3) {
    return Response.json({ error: 'Informe o nome completo do responsável.' }, { status: 400 });
  }
  if (typeof email !== 'string' || !email.includes('@')) {
    return Response.json({ error: 'Informe um e-mail válido.' }, { status: 400 });
  }
  const taxId = limparCpf(cpf);
  if (!taxId) {
    return Response.json({ error: 'Informe um CPF válido (11 dígitos).' }, { status: 400 });
  }

  const origin = new URL(request.url).origin;

  // Valor em centavos. Anual = 12 meses com 20% de desconto.
  const centavos = PRICE_CENTS[cycle];

  const expiraEm = new Date(Date.now() + MINUTOS_ATE_EXPIRAR * 60_000).toISOString();
  // 63 caracteres: versão/ciclo, família compacta e nonce, dentro do limite de 64 do PagBank.
  const nonce = crypto.randomUUID().replaceAll('-', '').slice(0, 24);
  const referenceId = `ru2-${cycle === 'mensal' ? 'm' : 'a'}-${familia.replaceAll('-', '')}-${nonce}`;

  const pedido = {
    reference_id: referenceId,
    customer: { name: nome.trim(), email: email.trim(), tax_id: taxId },
    items: [
      {
        reference_id: `${planId}-${cycle}`,
        name: `ReinoUp (${cycle}) — conta do responsável`,
        quantity: 1,
        unit_amount: centavos,
      },
    ],
    qr_codes: [{ amount: { value: centavos }, expiration_date: expiraEm }],
    notification_urls: [`${origin}/api/pagbank-webhook`],
  };

  try {
    const resposta = await fetch(`${baseUrl(env)}/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.PAGBANK_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pedido),
    });

    const dados = await resposta.json() as {
      id?: string;
      qr_codes?: { id: string; text: string; links?: { rel: string; href: string; media?: string }[] }[];
    };

    if (!resposta.ok || !dados.id || !dados.qr_codes?.[0]?.text) {
      return Response.json(
        { error: 'Não foi possível gerar o PIX. Confira os dados e tente novamente.' },
        { status: 502 }
      );
    }

    const qr = dados.qr_codes[0];
    const imagem = qr.links?.find((l) => l.media === 'image/png')?.href ?? null;

    return Response.json({
      orderId: dados.id,
      referenceId,
      copiaECola: qr.text,
      imagemQrCode: imagem,
      expiraEm,
      valorCentavos: centavos,
    });
  } catch {
    return Response.json({ error: 'Não foi possível gerar o PIX. Tente novamente.' }, { status: 502 });
  }
};

/**
 * ⚠️ LIMITE CONHECIDO — isto é pagamento avulso, não assinatura.
 *
 * A API de Pedidos gera uma cobrança única. O pai paga o mês (ou o ano) e
 * pronto: não há renovação automática. Para recorrência de verdade é preciso
 * a API de Assinaturas do PagBank (`/plans` + `/subscriptions`), que exige
 * cadastrar planos e tokenizar cartão.
 *
 * Para os primeiros pais pagantes, avulso resolve e é o caminho mais curto até
 * a primeira venda. Antes de escalar, migrar para Assinaturas:
 * https://developer.pagbank.com.br/reference/criar-assinatura
 */
