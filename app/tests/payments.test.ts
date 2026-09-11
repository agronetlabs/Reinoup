import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import { createHash, createHmac } from 'node:crypto';
import { onRequestPost as checkout } from '../functions/api/create-checkout-session';
import { onRequestPost as pix } from '../functions/api/pagbank-criar-pedido';
import { onRequestPost as stripeWebhook } from '../functions/api/stripe-webhook';
import { onRequestPost as pagbankWebhook } from '../functions/api/pagbank-webhook';
import { lerReferencia } from '../functions/api/_supabase';
import { verifyStripeSignature } from '../functions/api/_signature';
import { expectedAmount, formatCents, paidUntil, PRICE_CENTS, PRICE_VERSION } from '../shared/billing';
import { PLANS } from '../src/content/plans';
import { planoCobre, validSubscription } from '../src/lib/assinatura';
import { paymentHeaders, paymentReturnMessage } from '../src/lib/payment-client';
import { useSettingsStore } from '../src/store/settingsStore';

const family = 'aaaaaaaa-0000-4000-8000-000000000001';
const other = 'bbbbbbbb-0000-4000-8000-000000000002';
const env = {
  SUPABASE_URL: 'https://db.example.invalid', SUPABASE_SERVICE_ROLE_KEY: 'mock-service-role',
  STRIPE_SECRET_KEY: 'sk_test_mock_only', STRIPE_WEBHOOK_SECRET: 'whsec_mock_only',
  PAGBANK_TOKEN: 'mock-sandbox-only', PAGBANK_ENV: 'sandbox',
};
const originalFetch = globalThis.fetch;
type Call = { url: string; init?: RequestInit };
let calls: Call[];
let responder: (call: Call) => Response | Promise<Response>;
beforeEach(() => {
  calls = [];
  responder = () => { throw new Error('Unexpected mocked request'); };
  globalThis.fetch = mock(async (input: string | URL | Request, init?: RequestInit) => {
    const call = { url: String(input), init };
    calls.push(call);
    return responder(call);
  }) as typeof fetch;
});
afterEach(() => { globalThis.fetch = originalFetch; });

function request(body: unknown, authorized = true) {
  return new Request('https://app.example.invalid/api/payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(authorized ? { Authorization: 'Bearer mock-user-jwt' } : {}) },
    body: JSON.stringify(body),
  });
}
const buy = (cycle = 'mensal') => ({ planId: 'completo', cycle, familyId: family, nome: 'Responsável Teste', email: 'teste@example.invalid', cpf: '52998224725' });
function providerResponse({ url, init }: Call) {
  if (url.endsWith('/auth/v1/user')) return Response.json({ id: family });
  if (url.includes('/checkout/sessions')) return Response.json({ url: 'https://checkout.stripe.com/c/pay/test' });
  if (url.endsWith('/orders')) {
    const payload = JSON.parse(String(init?.body));
    if (payload.reference_id.length > 64) return Response.json({ error: 'reference_id too long' }, { status: 400 });
    return Response.json({ id: 'ORDE_test', qr_codes: [{ text: 'mock-pix' }] });
  }
  throw new Error(`Unexpected mocked endpoint: ${url}`);
}

function stripeEvent(type = 'checkout.session.completed') {
  return { id: 'evt_test', type, created: Math.floor(Date.now() / 1000), data: { object: {
    id: type.startsWith('customer.') ? 'sub_test' : 'cs_test',
    subscription: 'sub_test', payment_status: 'paid',
  } } };
}
function subscription(cycle: 'mensal' | 'anual' = 'mensal') {
  return {
    id: 'sub_test', status: 'active', ended_at: null as number | null,
    metadata: { planId: 'completo', cycle, familyId: family, priceVersion: PRICE_VERSION },
    latest_invoice: {
      id: 'in_test', status: 'paid', amount_paid: PRICE_CENTS[cycle], total: PRICE_CENTS[cycle], currency: 'brl',
      status_transitions: { paid_at: 1789077600 },
      lines: { data: [{ amount: PRICE_CENTS[cycle], period: { start: 1789077600, end: cycle === 'mensal' ? 1791669600 : 1820613600 } }] },
    },
  };
}
function stripeRequest(event: unknown, timestamp = Math.floor(Date.now() / 1000), rawOverride?: string) {
  const raw = rawOverride ?? JSON.stringify(event);
  const signature = createHmac('sha256', env.STRIPE_WEBHOOK_SECRET).update(`${timestamp}.${raw}`).digest('hex');
  return new Request('https://app.example.invalid/api/stripe-webhook', {
    method: 'POST', body: raw, headers: { 'stripe-signature': `t=${timestamp},v1=${signature}` },
  });
}
function mockStripe(value = subscription(), dbOk = true) {
  responder = ({ url }) => url.includes('api.stripe.com/v1/subscriptions/')
    ? Response.json(value)
    : url.includes('/rpc/') ? new Response(null, { status: dbOk ? 204 : 500 })
    : Response.json([]);
}
const rpcCalls = () => calls.filter(c => c.url.includes('/rpc/'));
const written = () => rpcCalls().map(c => JSON.parse(String(c.init?.body)).dados);
function order() {
  return {
    id: 'ORDE_test', reference_id: `reinoup-completo-mensal-v2-1789077600000-nonce-${family}`,
    charges: [{ status: 'PAID', paid_at: '2026-09-10T22:00:00.000Z', payment_method: { type: 'PIX' },
      amount: { value: 998, currency: 'BRL', summary: { paid: 998, refunded: 0 } } }],
  };
}
function pixRequest(event: unknown = { id: 'ORDE_test' }, rawOverride?: string) {
  const raw = rawOverride ?? JSON.stringify(event);
  const signature = createHash('sha256').update(`${env.PAGBANK_TOKEN}-${raw}`).digest('hex');
  return new Request('https://app.example.invalid/api/pagbank-webhook', {
    method: 'POST', body: raw, headers: { 'x-authenticity-token': signature },
  });
}
function mockPix(value = order(), dbOk = true) {
  responder = ({ url }) => url.includes('/orders/')
    ? Response.json(value) : new Response(null, { status: dbOk ? 204 : 500 });
}

describe('preço único e compatibilidade', () => {
  test('uma oferta por conta, total anual fixo e quatro perfis', () => {
    expect(PLANS).toHaveLength(1);
    expect(PLANS[0].id).toBe('completo');
    expect(PLANS[0].prices).toEqual({ mensal: 998, anual: 9581 });
    expect(PLANS[0].features.join(' ')).toContain('Até 4 perfis');
    expect(formatCents(9581)).toBe('95,81');
    expect(formatCents(Math.round(9581 / 12))).toBe('7,98');
  });
  test('legacy continua vigente com todos os recursos, sem vender planos antigos', () => {
    for (const plan of ['essencial', 'completo', 'familia'] as const) expect(planoCobre(plan, 'jogos')).toBe(true);
    expect(planoCobre(null, 'jogos')).toBe(false);
    expect(expectedAmount('completo', 'mensal')).toBe(1990);
    expect(expectedAmount('essencial', 'anual')).toBe(10464);
    expect(expectedAmount('completo', 'anual', PRICE_VERSION)).toBe(9581);
    expect(expectedAmount('essencial', 'mensal', PRICE_VERSION)).toBeNull();
    expect(expectedAmount('completo', 'mensal', 'unknown')).toBeNull();
  });
  test('validade por calendário, incluindo fim de mês e ano bissexto', () => {
    expect(paidUntil('mensal', '2026-01-31T12:00:00Z')).toBe('2026-02-28T12:00:00.000Z');
    expect(paidUntil('anual', '2024-02-29T12:00:00Z')).toBe('2025-02-28T12:00:00.000Z');
  });
  test('referências legadas/v2 preservam UUID; anônimas e inválidas rejeitadas', () => {
    expect(lerReferencia(`reinoup-familia-anual-1789077600000-${family}`)?.familyId).toBe(family);
    expect(lerReferencia(order().reference_id)?.version).toBe(PRICE_VERSION);
    for (const ref of ['reinoup-completo-mensal-123-anon', 'invalid', `reinoup-completo-semanal-123-${family}`]) expect(lerReferencia(ref)).toBeNull();
  });
});

describe('checkout autenticado', () => {
  for (const [name, handler] of [['Stripe', checkout], ['PIX', pix]] as const) {
    for (const cycle of ['mensal', 'anual']) {
      test(`${name}: preço e conta corretos (${cycle})`, async () => {
        responder = providerResponse;
        const result = await handler({ request: request(buy(cycle)), env });
        expect(result.status).toBe(200);
        const provider = calls[1];
        if (name === 'Stripe') {
          const params = new URLSearchParams(String(provider.init?.body));
          expect(params.get('line_items[0][price_data][unit_amount]')).toBe(cycle === 'mensal' ? '998' : '9581');
          expect(params.get('subscription_data[metadata][familyId]')).toBe(family);
          expect(params.get('subscription_data[metadata][priceVersion]')).toBe(PRICE_VERSION);
        } else {
          const payload = JSON.parse(String(provider.init?.body));
          expect(payload.qr_codes[0].amount.value).toBe(cycle === 'mensal' ? 998 : 9581);
          expect(lerReferencia(payload.reference_id)?.familyId).toBe(family);
          expect(lerReferencia(payload.reference_id)?.ciclo).toBe(cycle);
          expect(lerReferencia(payload.reference_id)?.version).toBe(PRICE_VERSION);
          expect(payload.reference_id.length).toBeLessThanOrEqual(64);
          expect(provider.url.startsWith('https://sandbox.')).toBe(true);
        }
      });
    }
    test(`${name}: falta Authorization não cria cobrança`, async () => {
      expect((await handler({ request: request(buy(), false), env })).status).toBe(401);
      expect(calls).toHaveLength(0);
    });
    test(`${name}: token inválido`, async () => {
      responder = () => new Response(null, { status: 401 });
      expect((await handler({ request: request(buy()), env })).status).toBe(401);
      expect(calls).toHaveLength(1);
    });
    test(`${name}: família alheia proibida`, async () => {
      responder = providerResponse;
      expect((await handler({ request: request({ ...buy(), familyId: other }), env })).status).toBe(403);
      expect(calls).toHaveLength(1);
    });
    test(`${name}: família omitida é derivada do token`, async () => {
      responder = providerResponse;
      expect((await handler({ request: request({ ...buy(), familyId: undefined }), env })).status).toBe(200);
      if (name === 'Stripe') expect(String(calls[1].init?.body)).toContain(family);
      else expect(lerReferencia(JSON.parse(String(calls[1].init?.body)).reference_id)?.familyId).toBe(family);
    });
    test(`${name}: planos/ciclos inválidos rejeitados antes do provedor`, async () => {
      for (const invalid of [{ planId: 'familia' }, { planId: 'essencial' }, { planId: '__proto__' }, { cycle: 'semanal' }, { cycle: null }]) {
        expect((await handler({ request: request({ ...buy(), ...invalid }), env })).status).toBe(400);
      }
      expect(calls).toHaveLength(0);
    });
    test(`${name}: JSON inválido e banco não configurado`, async () => {
      expect((await handler({ request: new Request('https://test.invalid', { method: 'POST', body: '{' }), env })).status).toBe(400);
      expect((await handler({ request: request(buy()), env: { ...env, SUPABASE_SERVICE_ROLE_KEY: '' } })).status).toBe(503);
    });
    test(`${name}: erro do provedor não expõe detalhes`, async () => {
      responder = call => call.url.endsWith('/user') ? Response.json({ id: family }) : Response.json({ error: { message: 'sensitive provider detail' } }, { status: 500 });
      const result = await handler({ request: request(buy()), env });
      expect(result.status).toBe(502);
      expect(await result.text()).not.toContain('sensitive');
    });
  }
});

describe('Stripe — confirmação e ciclo de vida', () => {
  test('assinatura válida, inclusive rotação com múltiplos v1; replay antigo recusado', async () => {
    const req = stripeRequest(stripeEvent());
    expect(await verifyStripeSignature(await req.clone().text(), req.headers.get('stripe-signature') + ',v1=' + '0'.repeat(64), env.STRIPE_WEBHOOK_SECRET)).toBe(true);
    expect((await stripeWebhook({ request: stripeRequest(stripeEvent(), Math.floor(Date.now() / 1000) - 301), env })).status).toBe(400);
    expect(calls).toHaveLength(0);
  });
  test('assinatura errada e JSON assinado malformado recusados', async () => {
    expect((await stripeWebhook({ request: request(stripeEvent()), env })).status).toBe(400);
    expect((await stripeWebhook({ request: stripeRequest(null, undefined, '{'), env })).status).toBe(400);
  });
  test('checkout pago confirma período da fatura, não relógio do webhook', async () => {
    mockStripe();
    expect((await stripeWebhook({ request: stripeRequest(stripeEvent()), env })).status).toBe(200);
    expect(written()[0]).toMatchObject({ family_id: family, referencia: 'sub_test', valor_centavos: 998, pago_em: '2026-09-10T22:00:00.000Z', vigente_ate: '2026-10-10T22:00:00.000Z' });
  });
  test('checkout não pago não libera', async () => {
    const event = stripeEvent();
    event.data.object.payment_status = 'unpaid';
    expect((await stripeWebhook({ request: stripeRequest(event), env })).status).toBe(200);
    expect(calls).toHaveLength(0);
  });
  test('montante, moeda e metadata inválidos não liberam', async () => {
    for (const change of [
      (s: ReturnType<typeof subscription>) => { s.latest_invoice.amount_paid = 1; },
      (s: ReturnType<typeof subscription>) => { s.latest_invoice.currency = 'usd'; },
      (s: ReturnType<typeof subscription>) => { s.metadata.familyId = 'anon'; },
      (s: ReturnType<typeof subscription>) => { s.metadata.cycle = 'invalid' as 'mensal'; },
    ]) {
      const value = subscription(); change(value); mockStripe(value);
      expect((await stripeWebhook({ request: stripeRequest(stripeEvent()), env })).status).toBe(400);
    }
    expect(rpcCalls()).toHaveLength(0);
  });
  test('duplicata mantém a mesma referência e validade', async () => {
    mockStripe();
    const event = stripeEvent();
    await stripeWebhook({ request: stripeRequest(event), env });
    await stripeWebhook({ request: stripeRequest(event), env });
    expect(written()[0]).toEqual(written()[1]);
  });
  test('invoice.paid renova até o novo período confirmado', async () => {
    const value = subscription('anual');
    mockStripe(value);
    const event = stripeEvent('invoice.paid');
    expect((await stripeWebhook({ request: stripeRequest(event), env })).status).toBe(200);
    expect(written()[0].valor_centavos).toBe(9581);
    expect(written()[0].vigente_ate).toBe(new Date(value.latest_invoice.lines.data[0].period.end * 1000).toISOString());
  });
  test('falha de renovação não cria período', async () => {
    const value = subscription(); value.latest_invoice.status = 'open'; value.status = 'past_due'; mockStripe(value);
    expect((await stripeWebhook({ request: stripeRequest(stripeEvent('invoice.payment_failed')), env })).status).toBe(200);
    expect(rpcCalls()).toHaveLength(0);
  });
  test('contrato legado sem metadata usa a linha existente, preservando preço antigo', async () => {
    const value = subscription();
    value.metadata = {} as typeof value.metadata;
    value.latest_invoice.amount_paid = value.latest_invoice.total = value.latest_invoice.lines.data[0].amount = 1990;
    responder = ({ url }) => url.includes('api.stripe.com') ? Response.json(value)
      : url.includes('/rpc/') ? new Response(null, { status: 204 })
      : Response.json([{ family_id: family, plano: 'completo', ciclo: 'mensal' }]);
    expect((await stripeWebhook({ request: stripeRequest(stripeEvent('invoice.paid')), env })).status).toBe(200);
    expect(written()[0]).toMatchObject({ family_id: family, valor_centavos: 1990, plano: 'completo' });
  });
  test('cancelamento programado mantém período pago enquanto assinatura está ativa', async () => {
    mockStripe();
    await stripeWebhook({ request: stripeRequest(stripeEvent('customer.subscription.updated')), env });
    expect(written()[0].vigente_ate).toBe('2026-10-10T22:00:00.000Z');
  });
  test('consulta Stripe indisponível não confirma', async () => {
    responder = () => new Response(null, { status: 503 });
    expect((await stripeWebhook({ request: stripeRequest(stripeEvent()), env })).status).toBe(502);
    expect(rpcCalls()).toHaveLength(0);
  });
  test('cancelamento atual encerra inclusive com fatura mais recente não paga', async () => {
    const value = subscription(); value.status = 'canceled'; value.ended_at = 1789164000; value.latest_invoice.status = 'open'; mockStripe(value);
    expect((await stripeWebhook({ request: stripeRequest(stripeEvent('customer.subscription.deleted')), env })).status).toBe(200);
    expect(rpcCalls()[0].url).toContain('encerrar_assinatura_stripe');
    expect(JSON.parse(String(rpcCalls()[0].init?.body)).ended_at).toBe('2026-09-11T22:00:00.000Z');
  });
  test('replay pago após cancelamento não reativa', async () => {
    const value = subscription(); value.status = 'canceled'; mockStripe(value);
    await stripeWebhook({ request: stripeRequest(stripeEvent('invoice.paid')), env });
    expect(rpcCalls()[0].url).toContain('encerrar_assinatura_stripe');
  });
  test('erro de persistência retorna 500 para retry, falta de configuração retorna 503', async () => {
    mockStripe(subscription(), false);
    expect((await stripeWebhook({ request: stripeRequest(stripeEvent()), env })).status).toBe(500);
    expect((await stripeWebhook({ request: stripeRequest(stripeEvent()), env: { ...env, SUPABASE_SERVICE_ROLE_KEY: '' } })).status).toBe(503);
  });
});

describe('PagBank — PIX avulso', () => {
  for (const cycle of ['mensal', 'anual'] as const) {
    test(`referência compacta do checkout confirma a mesma conta e ciclo (${cycle})`, async () => {
      responder = providerResponse;
      const checkoutResponse = await pix({ request: request(buy(cycle)), env });
      expect(checkoutResponse.status).toBe(200);
      const payload = await checkoutResponse.json() as { referenceId: string };
      const value = order();
      value.reference_id = payload.referenceId;
      value.charges[0].amount.value = value.charges[0].amount.summary.paid = PRICE_CENTS[cycle];
      mockPix(value);
      expect((await pagbankWebhook({ request: pixRequest(), env })).status).toBe(200);
      expect(written()[0]).toMatchObject({ family_id: family, ciclo: cycle, valor_centavos: PRICE_CENTS[cycle] });
    });
  }
  test('assinatura inválida e JSON inválido recusados', async () => {
    expect((await pagbankWebhook({ request: request({ id: 'ORDE_test' }), env })).status).toBe(401);
    expect((await pagbankWebhook({ request: pixRequest(null, '{'), env })).status).toBe(400);
    expect(calls).toHaveLength(0);
  });
  test('pago confirmado com validade fixa a partir do paid_at', async () => {
    mockPix();
    expect((await pagbankWebhook({ request: pixRequest(), env })).status).toBe(200);
    expect(written()[0]).toMatchObject({ valor_centavos: 998, family_id: family, vigente_ate: '2026-10-10T22:00:00.000Z' });
  });
  test('duplicata não reinicia o mês', async () => {
    mockPix();
    await pagbankWebhook({ request: pixRequest(), env });
    await pagbankWebhook({ request: pixRequest(), env });
    expect(written()[0]).toEqual(written()[1]);
  });
  test('PIX anual cobra total, libera um ano e não cria recorrência', async () => {
    const value = order();
    value.reference_id = value.reference_id.replace('mensal', 'anual');
    value.charges[0].amount.value = value.charges[0].amount.summary.paid = 9581;
    mockPix(value);
    expect((await pagbankWebhook({ request: pixRequest(), env })).status).toBe(200);
    expect(written()[0]).toMatchObject({ ciclo: 'anual', valor_centavos: 9581, vigente_ate: '2027-09-10T22:00:00.000Z' });
  });
  test('pedido divergente e referência anônima não liberam', async () => {
    const value = order();
    value.id = 'ORDE_other'; mockPix(value);
    expect((await pagbankWebhook({ request: pixRequest(), env })).status).toBe(400);
    value.id = 'ORDE_test'; value.reference_id = 'reinoup-completo-mensal-1789077600000-anon';
    expect((await pagbankWebhook({ request: pixRequest(), env })).status).toBe(400);
    expect(rpcCalls()).toHaveLength(0);
  });
  test('WAITING e código expirado sem cobrança não liberam', async () => {
    const value = order(); value.charges[0].status = 'WAITING'; mockPix(value);
    await pagbankWebhook({ request: pixRequest(), env });
    value.charges = [];
    await pagbankWebhook({ request: pixRequest(), env });
    expect(rpcCalls()).toHaveLength(0);
  });
  test('moeda, montante, método e liquidação inválidos recusados', async () => {
    for (const change of [
      (o: ReturnType<typeof order>) => { o.charges[0].amount.value = 1; },
      (o: ReturnType<typeof order>) => { o.charges[0].amount.currency = 'USD'; },
      (o: ReturnType<typeof order>) => { o.charges[0].amount.summary.paid = 0; },
      (o: ReturnType<typeof order>) => { o.charges[0].payment_method.type = 'BOLETO'; },
    ]) {
      const value = order(); change(value); mockPix(value);
      expect((await pagbankWebhook({ request: pixRequest(), env })).status).toBe(400);
    }
    expect(rpcCalls()).toHaveLength(0);
  });
  test('estorno consultado vence replay do evento PAID', async () => {
    const value = order(); value.charges[0].amount.summary.refunded = 998; mockPix(value);
    await pagbankWebhook({ request: pixRequest({ id: 'ORDE_test', charges: [{ status: 'PAID' }] }), env });
    expect(written()[0].vigente_ate).toBe(value.charges[0].paid_at);
  });
  test('falha do banco força retry', async () => {
    mockPix(order(), false);
    expect((await pagbankWebhook({ request: pixRequest(), env })).status).toBe(500);
  });
});

describe('retorno e acesso no cliente', () => {
  test('success só informa espera; store não tem ação subscribe', () => {
    expect(paymentReturnMessage('success')).toContain('Aguardando');
    expect(paymentReturnMessage('cancelled')).toContain('cancelado');
    expect(paymentReturnMessage('forged')).toBeNull();
    expect('subscribe' in useSettingsStore.getState()).toBe(false);
  });
  test('sem conta remota não existe checkout anônimo', async () => {
    await expect(paymentHeaders(null)).rejects.toThrow('conta online');
    expect(calls).toHaveLength(0);
  });
  test('expiração exata e datas inválidas não dão acesso; legado sem prazo preservado', () => {
    const now = Date.parse('2026-09-10T22:00:00Z');
    const row = { plano: 'completo', ciclo: 'mensal', vigente_ate: new Date(now).toISOString() };
    expect(validSubscription(row, now)).toBe(false);
    expect(validSubscription({ ...row, vigente_ate: 'bad' }, now)).toBe(false);
    expect(validSubscription({ ...row, vigente_ate: null }, now)).toBe(true);
    expect(validSubscription({ ...row, plano: 'forged', vigente_ate: null }, now)).toBe(false);
  });
});
