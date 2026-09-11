/**
 * Real, opt-in integration (never runs in `check`):
 * SANDBOX_RUN=1, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
 * SANDBOX_CONFIRM_SUPABASE_URL (exact match), SANDBOX_WEBHOOK_BASE_URL (HTTPS tunnel).
 * Tunnel: cloudflared tunnel --url http://127.0.0.1:8789
 * Replay: Stripe CLI on PATH, or SANDBOX_STRIPE_CLI=absolute executable path.
 * Optional SANDBOX_CHECKOUT_WAIT_SECONDS=600 opens real Checkout links locally.
 * --stripe-only: real Stripe APIs only; no Supabase, auth handler, webhook or replay evidence.
 * SANDBOX_UI_MODE=1 serves existing dist only to direct loopback requests.
 * UI mode requires operator-supplied fictitious SANDBOX_QA_EMAIL/SANDBOX_QA_PASSWORD.
 * After checking login/PIN/active plan, write "ui-verified" to the announced completion file.
 * No fixtures, fabricated events, locally signed events, or fetch replacements.
 *
 * References: docs.stripe.com/testing, /api/webhook_endpoints/create,
 * /api/subscriptions/create, /api/checkout/sessions/expire, /cli/events/resend.
 */
import { mkdir, stat } from 'node:fs/promises';
import { isAbsolute, join, relative, resolve } from 'node:path';
import { onRequestPost as checkout, STRIPE_API_VERSION } from '../functions/api/create-checkout-session';
import { onRequestPost as webhook } from '../functions/api/stripe-webhook';
import { verifyStripeSignature } from '../functions/api/_signature';
import { authenticateFamily } from '../functions/api/_supabase';
import { PAID_PLAN_ID, PRICE_CENTS, PRICE_VERSION, type Cycle } from '../shared/billing';

type Json = Record<string, any>;
type Receipt = { id: string; type: string; objectId: string; subscriptionId?: string; status: number };
type Result = { name: string; status: 'passed' | 'failed' | 'not_run'; [key: string]: unknown };
class Failure extends Error {}
const assert: (value: unknown, message: string) => asserts value = (value, message) => {
  if (!value) throw new Failure(message);
};
const runId = `reinoup-qa-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
const stripeOnly = process.argv.includes('--stripe-only');
const uiMode = process.env.SANDBOX_UI_MODE === '1';
const distDir = resolve(import.meta.dir, '..', 'dist');
const localDir = resolve(import.meta.dir, '..', '..', '.local');
const reportPath = join(localDir, `${runId}.json`);
const results: Result[] = [];
const receipts: Receipt[] = [];
const customers = new Set<string>();
const subscriptions = new Set<string>();
const sessions = new Set<string>();
const products = new Set<string>();
const prices = new Set<string>();
const checkoutLinkFiles = new Set<string>();
const canceledSubscriptions = new Set<string>();
const deletedCustomers = new Set<string>();
const cleanupFailures: string[] = [];
let familyId = '';
let createdAuthUser = false;
let accessToken = '';
let webhookId = '';
let server: ReturnType<typeof Bun.serve> | undefined;
let closing = false;
let stripeConfirmed = false;
let interrupted = false;
let apiCalls = 0;
const env = { SUPABASE_URL: '', SUPABASE_SERVICE_ROLE_KEY: '', STRIPE_SECRET_KEY: '', STRIPE_WEBHOOK_SECRET: '' };
const waitMs = () => Math.max(10, Number(process.env.SANDBOX_TIMEOUT_SECONDS || 120)) * 1000;
const phase = (name: string, extra: Json = {}) => console.log(JSON.stringify({ runId, phase: name, ...extra }));
const safeError = (error: unknown) => error instanceof Failure ? error.message : 'Unexpected error (details suppressed to protect credentials)';
const metadata = (cycle?: Cycle): Record<string, string> => ({
  qaRun: runId, familyId, planId: PAID_PLAN_ID, priceVersion: PRICE_VERSION, ...(cycle ? { cycle } : {}),
});
const fields = (prefix: string, values: Record<string, string>) =>
  Object.fromEntries(Object.entries(values).map(([key, value]) => [`${prefix}[${key}]`, value]));

async function stripe(path: string, method = 'GET', params: Record<string, string> = {}): Promise<Json> {
  assert(stripeConfirmed || (path === '/balance' && method === 'GET'), 'Stripe sandbox not yet confirmed');
  const response = await fetch(`https://api.stripe.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, 'Stripe-Version': STRIPE_API_VERSION,
      'Content-Type': 'application/x-www-form-urlencoded',
      ...(method === 'POST' ? { 'Idempotency-Key': `${runId}-${crypto.randomUUID()}` } : {}),
    },
    ...(method === 'GET' ? {} : { body: new URLSearchParams(params).toString() }),
    signal: AbortSignal.timeout(30000),
  });
  apiCalls++;
  const data = await response.json() as Json;
  assert(response.ok, `Stripe ${method} ${path.split('?')[0]} HTTP ${response.status}`);
  assert(data.livemode !== true, 'Live Stripe object refused');
  return data;
}

async function supabase(path: string, method = 'GET', body?: unknown): Promise<any> {
  const response = await fetch(`${env.SUPABASE_URL}${path}`, {
    method,
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(30000),
  });
  apiCalls++;
  const raw = await response.text();
  if (!response.ok) {
    let code = '';
    try {
      const value = JSON.parse(raw).error_code;
      if (typeof value === 'string' && /^[a-z_]{1,60}$/.test(value)) code = ` (${value})`;
    } catch { /* Never expose an auth response or provider error message. */ }
    throw new Failure(`Supabase ${method} ${path.split('?')[0]} HTTP ${response.status}${code}`);
  }
  return raw ? JSON.parse(raw) : null;
}

async function rows(subscriptionId?: string): Promise<Json[]> {
  const query = new URLSearchParams({
    family_id: `eq.${familyId}`, provedor: 'eq.stripe',
    select: 'id,family_id,plano,ciclo,status,provedor,referencia,provedor_id,valor_centavos,pago_em,vigente_ate,webhook_event_at',
    ...(subscriptionId ? { provedor_id: `eq.${subscriptionId}` } : {}),
    order: 'id.asc',
  });
  return supabase(`/rest/v1/subscriptions?${query}`);
}

async function until<T>(label: string, check: () => Promise<T | undefined | false>, timeout = waitMs()): Promise<T> {
  const deadline = Date.now() + timeout;
  do {
    assert(!interrupted, 'Interrupted; cleaning QA resources');
    const value = await check();
    if (value) return value;
    await Bun.sleep(1000);
  } while (Date.now() < deadline);
  throw new Failure(`Timed out: ${label}`);
}

async function received(type: string, objectId?: string): Promise<Receipt> {
  return until(`real delivery ${type}`, async () => receipts.find(r =>
    r.type === type && r.status === 200 && (!objectId || r.objectId === objectId || r.subscriptionId === objectId)));
}

async function paid(subscriptionId: string, cycle: Cycle) {
  const sub = await stripe(`/subscriptions/${subscriptionId}?expand[]=latest_invoice`);
  const invoice = sub.latest_invoice;
  assert(sub.status === 'active' && invoice?.status === 'paid', `${cycle}: Stripe invoice not paid`);
  assert(invoice.amount_paid === PRICE_CENTS[cycle] && invoice.total === PRICE_CENTS[cycle] &&
    invoice.currency === 'brl', `${cycle}: unexpected real invoice amount`);
  assert(invoice.lines.data.length === 1, `${cycle}: unexpected invoice lines`);
  const line = invoice.lines.data[0];
  assert(line.amount === PRICE_CENTS[cycle] && line.period.end > line.period.start, `${cycle}: invalid invoice period`);
  const row = await until(`${cycle}: paid period in Supabase`, async () => {
    const found = await rows(subscriptionId);
    assert(found.length <= 1, `${cycle}: duplicate subscription rows`);
    return found[0]?.valor_centavos === PRICE_CENTS[cycle] ? found[0] : undefined;
  });
  assert(row.family_id === familyId && row.plano === PAID_PLAN_ID && row.ciclo === cycle &&
    row.status === 'ativa' && row.referencia === subscriptionId, `${cycle}: incorrect database contract`);
  assert(Date.parse(row.vigente_ate) === line.period.end * 1000 &&
    Date.parse(row.pago_em) === invoice.status_transitions.paid_at * 1000, `${cycle}: incorrect database period`);
  return { subscriptionId, invoiceId: invoice.id, amountCents: invoice.amount_paid,
    periodStart: line.period.start, periodEnd: line.period.end };
}

async function cancel(subscriptionId: string) {
  const sub = await stripe(`/subscriptions/${subscriptionId}`);
  const firstNewReceipt = receipts.length;
  if (sub.status !== 'canceled' && sub.status !== 'incomplete_expired') {
    await stripe(`/subscriptions/${subscriptionId}`, 'DELETE');
    // An unpaid incomplete subscription can end via `updated` instead of `deleted`.
    await until('real subscription termination webhook', async () => receipts.slice(firstNewReceipt).find(receipt =>
      receipt.objectId === subscriptionId && receipt.status === 200 &&
      ['customer.subscription.updated', 'customer.subscription.deleted'].includes(receipt.type)));
  }
  const ended = await stripe(`/subscriptions/${subscriptionId}`);
  assert(['canceled', 'incomplete_expired'].includes(ended.status), 'Stripe subscription did not terminate');
  await until('Supabase entitlement ended', async () => {
    const found = await rows(subscriptionId);
    return found.every(row => Date.parse(row.vigente_ate) <= Date.now());
  });
}

async function replay(receipt: Receipt, cli: string, name: string) {
  const before = JSON.stringify(await rows());
  const count = receipts.filter(r => r.id === receipt.id && r.status === 200).length;
  // Environment only: no credential in argv, CLI output, persisted CLI config, or report.
  const child = Bun.spawn([cli, 'events', 'resend', receipt.id, '--webhook-endpoint', webhookId], {
    env: { ...process.env, STRIPE_API_KEY: env.STRIPE_SECRET_KEY },
    stdout: 'pipe', stderr: 'pipe',
  });
  const timer = setTimeout(() => child.kill(), 30000);
  const [code] = await Promise.all([child.exited, new Response(child.stdout).text(), new Response(child.stderr).text()]);
  clearTimeout(timer);
  assert(code === 0, 'Stripe CLI real event resend failed (output suppressed)');
  await until('Stripe redelivery of same event', async () =>
    receipts.filter(r => r.id === receipt.id && r.status === 200).length > count);
  assert(JSON.stringify(await rows()) === before, `${name}: replay changed persisted subscription`);
  results.push({ name, status: 'passed', eventId: receipt.id, source: 'stripe events resend', unchanged: true });
}

async function createCustomer(paymentMethod: string) {
  const customer = await stripe('/customers', 'POST', {
    description: runId, ...fields('metadata', metadata()),
  });
  customers.add(customer.id);
  const pm = await stripe(`/payment_methods/${paymentMethod}/attach`, 'POST', { customer: customer.id });
  await stripe(`/customers/${customer.id}`, 'POST', { 'invoice_settings[default_payment_method]': pm.id });
  return { customerId: customer.id as string, paymentMethodId: pm.id as string };
}

async function createSubscription(cycle: Cycle, paymentMethod: string) {
  const { customerId, paymentMethodId } = await createCustomer(paymentMethod);
  const product = await stripe('/products', 'POST', { name: `QA ReinoUp ${cycle} ${runId}`, ...fields('metadata', metadata(cycle)) });
  products.add(product.id);
  const price = await stripe('/prices', 'POST', {
    product: product.id, currency: 'brl', unit_amount: String(PRICE_CENTS[cycle]),
    'recurring[interval]': cycle === 'mensal' ? 'month' : 'year', ...fields('metadata', metadata(cycle)),
  });
  prices.add(price.id);
  const sub = await stripe('/subscriptions', 'POST', {
    customer: customerId, default_payment_method: paymentMethodId, 'items[0][price]': price.id,
    payment_behavior: 'allow_incomplete', 'payment_settings[payment_method_types][0]': 'card',
    'expand[0]': 'latest_invoice', ...fields('metadata', metadata(cycle)),
  });
  subscriptions.add(sub.id);
  return sub;
}

async function startServer() {
  const port = Number(process.env.SANDBOX_PORT || 8789);
  assert(Number.isInteger(port) && port > 1024 && port <= 65535, 'Invalid SANDBOX_PORT');
  server = Bun.serve({
    hostname: '127.0.0.1', port, maxRequestBodySize: 1024 * 1024,
    async fetch(request) {
      try {
        const path = new URL(request.url).pathname;
        if (path === '/health' && request.method === 'GET') return Response.json({ ready: true });
        if (closing) return new Response(null, { status: 503 });
        const directLoopback = request.headers.get('host') === `127.0.0.1:${port}` &&
          !['cf-connecting-ip', 'cf-ray', 'x-forwarded-for', 'x-forwarded-host', 'forwarded']
            .some(header => request.headers.has(header));
        if (path === '/api/create-checkout-session' && request.method === 'POST') {
          if (!directLoopback) return new Response(null, { status: 404 });
          if (!accessToken) return new Response(null, { status: 401 });
          if (uiMode) {
            const authenticated = await authenticateFamily(request, env, familyId);
            if (authenticated instanceof Response) return authenticated;
          } else if (request.headers.get('Authorization') !== `Bearer ${accessToken}`)
            return new Response(null, { status: 401 });
          const response = await checkout({ request, env });
          if (uiMode && response.ok) {
            const { url } = await response.clone().json() as { url: string };
            const list = await stripe('/checkout/sessions?limit=100');
            const session = list.data.find((item: Json) => item.url === url && item.client_reference_id === familyId);
            assert(session && session.livemode === false, 'UI Checkout not found');
            sessions.add(session.id);
            await stripe(`/checkout/sessions/${session.id}`, 'POST', { 'metadata[qaRun]': runId });
            phase('ui_checkout_created', { cycle: session.metadata.cycle, sessionId: session.id,
              amountCents: session.amount_total });
          }
          return response;
        }
        if (uiMode && directLoopback && request.method === 'GET' && !path.startsWith('/api/')) {
          const decoded = decodeURIComponent(path);
          const filePath = resolve(distDir, `.${decoded}`);
          const subpath = relative(distDir, filePath);
          if (subpath.startsWith('..') || isAbsolute(subpath) || subpath.split(/[\\/]/).some(part => part.startsWith('.')))
            return new Response(null, { status: 404 });
          const file = Bun.file(filePath);
          const fileStat = await stat(filePath).catch(() => undefined);
          if (fileStat?.isFile()) return new Response(file);
          if (!path.split('/').at(-1)?.includes('.')) return new Response(Bun.file(join(distDir, 'index.html')));
          return new Response(null, { status: 404 });
        }
        if (path === '/app/planos' && request.method === 'GET') {
          return new Response('Retorno de pagamento QA. A confirmacao vem do webhook, nunca desta URL.',
            { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } });
        }
        if (path !== '/api/stripe-webhook' || request.method !== 'POST') return new Response(null, { status: 404 });
        const raw = await request.clone().text();
        if (!await verifyStripeSignature(raw, request.headers.get('stripe-signature'), env.STRIPE_WEBHOOK_SECRET))
          return new Response(null, { status: 400 });
        const event = JSON.parse(raw) as Json;
        if (event.livemode !== false) return new Response(null, { status: 400 });
        const object = event.data.object;
        // This temporary account-wide endpoint must never reconcile another family's events.
        const owned = object.metadata?.familyId === familyId ||
          object.parent?.subscription_details?.metadata?.familyId === familyId || customers.has(object.customer) ||
          subscriptions.has(object.id) || sessions.has(object.id);
        if (!familyId || !owned) return Response.json({ received: true });
        const response = await webhook({ request, env });
        receipts.push({ id: event.id, type: event.type, objectId: object.id,
          subscriptionId: object.subscription ?? object.parent?.subscription_details?.subscription,
          status: response.status });
        phase('webhook_received', { eventId: event.id, eventType: event.type, status: response.status });
        return response;
      } catch {
        return new Response(null, { status: 500 });
      }
    },
    error() { return new Response(null, { status: 500 }); },
  });
  const health = await fetch(`http://127.0.0.1:${port}/health`);
  assert(health.ok, 'Local webhook server failed health check');
  phase('server_ready', { port, webhookPath: '/api/stripe-webhook' });
}

async function createCheckout(cycle: Cycle) {
  const response = await fetch(`http://127.0.0.1:${server!.port}/api/create-checkout-session`, {
    method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId: PAID_PLAN_ID, cycle, familyId }),
  });
  assert(response.ok, `${cycle}: real authenticated checkout handler HTTP ${response.status}`);
  const result = await response.json() as { url: string };
  // The production handler intentionally returns only URL. Retrieve its session from Stripe.
  const listed = await stripe('/checkout/sessions?limit=100');
  const session = listed.data.find((item: Json) => item.url === result.url && item.client_reference_id === familyId);
  assert(session, `${cycle}: created Checkout not found`);
  sessions.add(session.id);
  await stripe(`/checkout/sessions/${session.id}`, 'POST', fields('metadata', metadata(cycle)));
  assert(session.livemode === false && session.mode === 'subscription' && session.currency === 'brl' &&
    session.amount_total === PRICE_CENTS[cycle], `${cycle}: incorrect Checkout amount`);
  for (const [key, value] of Object.entries(metadata(cycle))) {
    if (key !== 'qaRun') assert(session.metadata[key] === value, `${cycle}: incorrect Checkout metadata`);
  }
  const lineItems = await stripe(`/checkout/sessions/${session.id}/line_items`);
  assert(lineItems.data.length === 1, `${cycle}: invalid Checkout line items`);
  const price = lineItems.data[0].price;
  assert(price.unit_amount === PRICE_CENTS[cycle] &&
    price.recurring.interval === (cycle === 'mensal' ? 'month' : 'year'), `${cycle}: incorrect Checkout recurring price`);
  // Checkout inline prices/products are immutable snapshots, not editable catalog resources.
  // Their owning session carries the QA tag and is expired during cleanup.
  results.push({ name: `checkout_created_${cycle}`, status: 'passed', sessionId: session.id,
    amountCents: session.amount_total, paid: false, source: 'real handler with Supabase password JWT' });
  return { sessionId: session.id as string, url: result.url };
}

async function uiChecks() {
  const completionFile = join(localDir, `${runId}.ui-complete`);
  phase('ui_ready', { url: `http://127.0.0.1:${server!.port}`, completionFile,
    instruction: 'Use supplied QA credentials in the app, configure PIN, buy monthly; after seeing active plan write ui-verified to completionFile' });
  const session = await until('operator completes Checkout through app UI', async () => {
    for (const id of sessions) {
      const candidate = await stripe(`/checkout/sessions/${id}`);
      if (candidate.status === 'complete' && candidate.payment_status === 'paid') return candidate;
    }
  }, 20 * 60 * 1000);
  const cycle = session.metadata.cycle as Cycle;
  assert(cycle === 'mensal' || cycle === 'anual', 'UI Checkout cycle invalid');
  assert(session.amount_total === PRICE_CENTS[cycle] && session.currency === 'brl', 'UI Checkout amount invalid');
  subscriptions.add(session.subscription);
  if (session.customer) customers.add(session.customer);
  await stripe(`/subscriptions/${session.subscription}`, 'POST', { 'metadata[qaRun]': runId });
  if (session.customer) await stripe(`/customers/${session.customer}`, 'POST', { 'metadata[qaRun]': runId });
  await received('checkout.session.completed', session.id);
  results.push({ name: `ui_checkout_paid_${cycle}`, status: 'passed',
    source: 'App UI + real Checkout + real webhook + Supabase', ...await paid(session.subscription, cycle) });
  phase('ui_payment_confirmed_waiting_operator', { completionFile,
    instruction: 'Plan remains active for UI polling; write ui-verified only after checking PIN/login/active state' });
  await until('operator verifies active plan in app UI', async () => {
    const file = Bun.file(completionFile);
    return await file.exists() && (await file.text()).trim() === 'ui-verified';
  }, 20 * 60 * 1000);
  results.push({ name: 'ui_login_pin_active_plan', status: 'passed', source: 'Operator attestation via completion file' });
  await Bun.file(completionFile).delete();
  await cancel(session.subscription);
  results.push({ name: 'ui_subscription_canceled_after_verification', status: 'passed' });
}

async function cleanup() {
  phase('cleanup');
  const attempt = async (name: string, work: () => Promise<unknown>) => {
    try { await work(); } catch { cleanupFailures.push(name); }
  };
  // Discover Checkout subscriptions, including those paid just before a timeout/interruption.
  for (const id of sessions) await attempt(`checkout:${id}`, async () => {
    const session = await stripe(`/checkout/sessions/${id}`);
    if (typeof session.subscription === 'string') subscriptions.add(session.subscription);
    if (typeof session.customer === 'string') customers.add(session.customer);
    if (session.status === 'open') await stripe(`/checkout/sessions/${id}/expire`, 'POST');
  });
  for (const id of subscriptions) await attempt(`subscription:${id}`, async () => {
    const sub = await stripe(`/subscriptions/${id}`);
    if (sub.status !== 'canceled' && sub.status !== 'incomplete_expired') await stripe(`/subscriptions/${id}`, 'DELETE');
    const final = await stripe(`/subscriptions/${id}`);
    assert(final.status === 'canceled' || final.status === 'incomplete_expired', 'QA subscription still active');
    canceledSubscriptions.add(id);
  });
  for (const id of customers) await attempt(`customer:${id}`, async () => {
    // Also catch subscriptions created remotely if their create response was lost.
    const list = await stripe(`/subscriptions?customer=${id}&status=all&limit=100`);
    for (const sub of list.data) {
      subscriptions.add(sub.id);
      if (sub.status !== 'canceled' && sub.status !== 'incomplete_expired') await stripe(`/subscriptions/${sub.id}`, 'DELETE');
      const final = await stripe(`/subscriptions/${sub.id}`);
      assert(final.status === 'canceled' || final.status === 'incomplete_expired', 'QA subscription still active');
      canceledSubscriptions.add(sub.id);
    }
    await stripe(`/customers/${id}`, 'DELETE');
    deletedCustomers.add(id);
  });
  for (const id of prices) await attempt(`price:${id}`, () => stripe(`/prices/${id}`, 'POST', { active: 'false' }));
  for (const id of products) await attempt(`product:${id}`, () => stripe(`/products/${id}`, 'POST', { active: 'false' }));
  closing = true;
  if (webhookId) await attempt(`webhook:${webhookId}`, () => stripe(`/webhook_endpoints/${webhookId}`, 'DELETE'));
  if (server) await attempt('local_server', () => server!.stop(false));
  for (const path of checkoutLinkFiles) await attempt('checkout_link_file', async () => {
    if (await Bun.file(path).exists()) await Bun.file(path).delete();
  });
  // Only the unique admin-created QA user is deleted. Never delete arbitrary family IDs.
  if (createdAuthUser && familyId) await attempt('qa_auth_user', async () => {
    const user = await supabase(`/auth/v1/admin/users/${familyId}`);
    assert(user.user_metadata?.qaRun === runId, 'QA ownership guard refused user deletion');
    await supabase(`/auth/v1/admin/users/${familyId}`, 'DELETE');
    assert((await rows()).length === 0, 'QA subscription cascade left rows behind');
  });
  // Cancellation tombstones have no family FK; retain them (not an entitlement).
}

async function initializeStripe() {
  env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
  if (!env.STRIPE_SECRET_KEY) {
    const vars = await Bun.file(resolve(import.meta.dir, '..', '.dev.vars')).text();
    // Extract only this approved field; never parse/log other provider credentials.
    const match = /^STRIPE_SECRET_KEY\s*=\s*(?:"([^"\r\n]+)"|'([^'\r\n]+)'|([^\s#\r\n]+))/m.exec(vars);
    env.STRIPE_SECRET_KEY = match?.[1] || match?.[2] || match?.[3] || '';
  }
  assert(/^sk_test_[A-Za-z0-9]+$/.test(env.STRIPE_SECRET_KEY), 'Only a Stripe sk_test key is accepted');
  const balance = await stripe('/balance');
  assert(balance.livemode === false, 'Stripe balance.livemode must be exactly false');
  stripeConfirmed = true;
  results.push({ name: 'sandbox_guard', status: 'passed', livemode: false, stripeApiVersion: STRIPE_API_VERSION });
  await mkdir(localDir, { recursive: true });
  const ignored = Bun.spawn(['git', 'check-ignore', '--quiet', reportPath], { stdout: 'ignore', stderr: 'ignore' });
  assert(await ignored.exited === 0, 'Report directory must be gitignored');
}

async function stripeOnlyChecks() {
  phase('stripe_only', { limitations: 'No authenticated handler, webhook, Supabase or replay validation' });
  await initializeStripe();
  // Metadata is deliberately not associated with any real Supabase family.
  familyId = crypto.randomUUID();
  for (const name of ['authenticated_checkout_handler', 'webhook_delivery', 'supabase_persistence', 'webhook_replay']) {
    results.push({ name, status: 'not_run', reason: '--stripe-only: no backend integration evidence' });
  }
  for (const cycle of ['mensal', 'anual'] as const) {
    phase(`stripe_only_checkout_${cycle}`);
    const session = await stripe('/checkout/sessions', 'POST', {
      mode: 'subscription', success_url: 'https://example.com/qa-success', cancel_url: 'https://example.com/qa-cancel',
      'line_items[0][quantity]': '1', 'line_items[0][price_data][currency]': 'brl',
      'line_items[0][price_data][unit_amount]': String(PRICE_CENTS[cycle]),
      'line_items[0][price_data][recurring][interval]': cycle === 'mensal' ? 'month' : 'year',
      'line_items[0][price_data][product_data][name]': `QA ReinoUp ${cycle} ${runId}`,
      ...fields('metadata', metadata(cycle)), ...fields('subscription_data[metadata]', metadata(cycle)),
    });
    sessions.add(session.id);
    assert(session.livemode === false && session.amount_total === PRICE_CENTS[cycle] &&
      session.currency === 'brl' && session.status === 'open', 'Stripe-only Checkout amount/status mismatch');
    const lineItems = await stripe(`/checkout/sessions/${session.id}/line_items`);
    assert(lineItems.data.length === 1, 'Stripe-only Checkout line count mismatch');
    const price = lineItems.data[0].price;
    assert(price.recurring.interval === (cycle === 'mensal' ? 'month' : 'year'), 'Stripe-only Checkout cycle mismatch');
    results.push({ name: `stripe_api_checkout_created_${cycle}`, status: 'passed', sessionId: session.id,
      amountCents: session.amount_total, paid: false, source: 'Stripe REST API, NOT authenticated app handler' });
    const expired = await stripe(`/checkout/sessions/${session.id}/expire`, 'POST');
    assert(expired.status === 'expired' && expired.payment_status === 'unpaid', 'Stripe-only Checkout expiration failed');
    results.push({ name: `stripe_api_checkout_expired_${cycle}`, status: 'passed', sessionId: session.id,
      webhookVerified: false });
    phase(`stripe_only_charge_${cycle}`);
    const sub = await createSubscription(cycle, 'pm_card_visa');
    const invoice = sub.latest_invoice;
    assert(sub.status === 'active' && invoice?.status === 'paid' &&
      invoice.amount_paid === PRICE_CENTS[cycle] && invoice.total === PRICE_CENTS[cycle] &&
      invoice.currency === 'brl', 'Stripe-only real subscription invoice not paid correctly');
    assert(invoice.lines.data.length === 1, 'Stripe-only invoice line count mismatch');
    const line = invoice.lines.data[0];
    assert(line.amount === PRICE_CENTS[cycle] && line.period.end > line.period.start, 'Stripe-only invoice period mismatch');
    results.push({ name: `stripe_api_subscription_paid_${cycle}`, status: 'passed', subscriptionId: sub.id,
      invoiceId: invoice.id, amountCents: invoice.amount_paid, periodStart: line.period.start, periodEnd: line.period.end,
      source: 'Real Stripe API subscription, NOT completed Checkout', webhookVerified: false, supabaseVerified: false });
    await stripe(`/subscriptions/${sub.id}`, 'DELETE');
    const canceled = await stripe(`/subscriptions/${sub.id}`);
    assert(canceled.status === 'canceled' || canceled.status === 'incomplete_expired', 'Stripe-only cancellation failed');
    results.push({ name: `stripe_api_canceled_${cycle}`, status: 'passed', subscriptionId: sub.id,
      webhookVerified: false, supabaseVerified: false });
  }
  phase('stripe_only_decline');
  const declined = await createSubscription('mensal', 'pm_card_chargeCustomerFail');
  assert(declined.status === 'incomplete' && declined.latest_invoice?.status !== 'paid' &&
    declined.latest_invoice?.amount_paid === 0, 'Stripe-only test charge did not decline');
  results.push({ name: 'stripe_api_declined', status: 'passed', subscriptionId: declined.id,
    amountPaid: 0, webhookVerified: false, supabaseVerified: false });
}

async function main() {
  assert(process.env.SANDBOX_RUN === '1', 'Opt-in required: SANDBOX_RUN=1 (no remote calls made)');
  assert(!(stripeOnly && uiMode), 'UI mode cannot be combined with --stripe-only');
  if (stripeOnly) return stripeOnlyChecks();
  if (uiMode) {
    assert(await Bun.file(join(distDir, 'index.html')).exists(), 'UI mode requires existing app/dist; run build:fast first');
    assert(/^reinoup-qa-[a-z0-9-]+@example\.com$/.test(process.env.SANDBOX_QA_EMAIL || ''),
      'UI mode requires a fictitious reinoup-qa-...@example.com email supplied by the operator');
    const bytes = new TextEncoder().encode(process.env.SANDBOX_QA_PASSWORD || '').length;
    assert(bytes >= 16 && bytes <= 72, 'UI mode requires operator-supplied QA password of 16–72 bytes');
  }
  env.SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
  env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  assert(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY, 'Confirmed Supabase server credentials required');
  assert(process.env.SANDBOX_CONFIRM_SUPABASE_URL === env.SUPABASE_URL, 'Supabase URL confirmation mismatch');
  const dbUrl = new URL(env.SUPABASE_URL);
  assert(dbUrl.protocol === 'https:' && !dbUrl.username && !dbUrl.password && dbUrl.pathname === '/' &&
    !dbUrl.search && !dbUrl.hash, 'Supabase URL must be a credential-free HTTPS origin');
  const tunnel = new URL(process.env.SANDBOX_WEBHOOK_BASE_URL || '');
  assert(tunnel.protocol === 'https:' && !tunnel.username && !tunnel.password &&
    tunnel.pathname === '/' && !tunnel.search && !tunnel.hash, 'Webhook base must be a credential-free HTTPS origin');
  const cli = Bun.which(process.env.SANDBOX_STRIPE_CLI || 'stripe');
  assert(uiMode || cli, 'Stripe CLI required for real replay; install externally or set SANDBOX_STRIPE_CLI');
  await initializeStripe();
  const password = uiMode ? process.env.SANDBOX_QA_PASSWORD! : `${crypto.randomUUID()}Aa!9`;
  const email = uiMode ? process.env.SANDBOX_QA_EMAIL! : `${runId}@example.com`;
  const user = await supabase('/auth/v1/admin/users', 'POST', {
    email, password, email_confirm: true, user_metadata: { qaRun: runId, name: 'Responsável QA fictício' },
  });
  familyId = user.id;
  createdAuthUser = true;
  assert(/^[0-9a-f-]{36}$/i.test(familyId), 'Admin user missing UUID');
  const auth = await supabase('/auth/v1/token?grant_type=password', 'POST', { email, password });
  assert(auth.user?.id === familyId && auth.access_token, 'QA password sign-in failed');
  accessToken = auth.access_token;
  assert((await rows()).length === 0, 'New QA user unexpectedly has subscriptions');
  await startServer();
  const endpoint = await stripe('/webhook_endpoints', 'POST', {
    url: `${tunnel.origin}/api/stripe-webhook`, api_version: STRIPE_API_VERSION,
    description: runId, ...fields('metadata', { qaRun: runId }),
    ...Object.fromEntries(['checkout.session.completed', 'checkout.session.async_payment_succeeded',
      'checkout.session.expired', 'invoice.paid', 'invoice.payment_failed',
      'customer.subscription.updated', 'customer.subscription.deleted'].map((event, index) => [`enabled_events[${index}]`, event])),
  });
  webhookId = endpoint.id;
  env.STRIPE_WEBHOOK_SECRET = endpoint.secret;
  assert(webhookId && env.STRIPE_WEBHOOK_SECRET, 'Real endpoint signing secret missing');
  assert((await fetch(`${tunnel.origin}/health`, { signal: AbortSignal.timeout(20000) })).ok, 'Tunnel health check failed');
  phase('real_webhooks_ready', { webhookId });
  if (uiMode) return uiChecks();
  const browserWait = Number(process.env.SANDBOX_CHECKOUT_WAIT_SECONDS || 0);
  assert(Number.isFinite(browserWait) && browserWait >= 0, 'Invalid browser wait');
  for (const cycle of ['mensal', 'anual'] as const) {
    phase(`checkout_${cycle}`);
    const created = await createCheckout(cycle);
    let expiringSessionId = created.sessionId;
    if (browserWait > 0) {
      const linkPath = join(localDir, `${runId}-${cycle}-checkout.html`);
      checkoutLinkFiles.add(linkPath);
      await Bun.write(linkPath, `<!doctype html><meta charset="utf-8"><title>QA Stripe sandbox</title><a href="${created.url.replaceAll('&', '&amp;').replaceAll('"', '&quot;')}">Pagar Checkout QA ${cycle} com cartão TESTE</a>`);
      phase('awaiting_browser_test_payment', { cycle, linkFile: linkPath, timeoutSeconds: browserWait });
      const complete = await until('browser completes real Checkout', async () => {
        const session = await stripe(`/checkout/sessions/${created.sessionId}`);
        return session.status === 'complete' && session.payment_status === 'paid' ? session : undefined;
      }, browserWait * 1000);
      subscriptions.add(complete.subscription);
      if (complete.customer) customers.add(complete.customer);
      await stripe(`/subscriptions/${complete.subscription}`, 'POST', fields('metadata', metadata(cycle)));
      if (complete.customer) await stripe(`/customers/${complete.customer}`, 'POST', fields('metadata', metadata(cycle)));
      await received('checkout.session.completed', created.sessionId);
      results.push({ name: `checkout_paid_${cycle}`, status: 'passed', source: 'real browser Checkout',
        ...await paid(complete.subscription, cycle) });
      await cancel(complete.subscription);
      await Bun.file(linkPath).delete();
      expiringSessionId = (await createCheckout(cycle)).sessionId;
    } else {
      results.push({ name: `checkout_paid_${cycle}`, status: 'not_run', reason: 'Browser completion not enabled; API subscription payment is tested separately' });
    }
    await stripe(`/checkout/sessions/${expiringSessionId}/expire`, 'POST');
    await received('checkout.session.expired', expiringSessionId);
    const expired = await stripe(`/checkout/sessions/${expiringSessionId}`);
    assert(expired.status === 'expired' && expired.payment_status === 'unpaid', 'Checkout did not expire unpaid');
    results.push({ name: `checkout_expired_${cycle}`, status: 'passed', sessionId: expiringSessionId });
  }
  assert((await rows()).every(row => Date.parse(row.vigente_ate) <= Date.now()), 'Unpaid/ended Checkout granted access');
  phase('declined_payment');
  // Generic declined cards cannot be attached; this official fixture declines after attaching.
  const declined = await createSubscription('mensal', 'pm_card_chargeCustomerFail');
  assert(declined.status === 'incomplete' && declined.latest_invoice?.status !== 'paid' &&
    declined.latest_invoice?.amount_paid === 0, 'Test card did not decline first invoice');
  await received('invoice.payment_failed', declined.id);
  assert((await rows(declined.id)).length === 0, 'Declined payment granted database entitlement');
  results.push({ name: 'declined_payment', status: 'passed', subscriptionId: declined.id, granted: false });
  await cancel(declined.id);
  for (const cycle of ['mensal', 'anual'] as const) {
    phase(`subscription_payment_${cycle}`);
    const sub = await createSubscription(cycle, 'pm_card_visa');
    const receipt = await received('invoice.paid', sub.id);
    results.push({ name: `subscription_api_paid_${cycle}`, status: 'passed',
      source: 'real Stripe API subscription (not a completed Checkout)', ...await paid(sub.id, cycle) });
    await replay(receipt, cli!, `replay_paid_${cycle}`);
    await cancel(sub.id);
    results.push({ name: `cancellation_${cycle}`, status: 'passed', subscriptionId: sub.id, granted: false });
    await replay(receipt, cli!, `replay_after_cancellation_${cycle}`);
  }
}

process.on('SIGINT', () => { interrupted = true; });
process.on('SIGTERM', () => { interrupted = true; });
try {
  await main();
} catch (error) {
  results.push({ name: 'execution', status: 'failed', reason: safeError(error) });
} finally {
  if (stripeConfirmed || familyId || server) {
    try { await cleanup(); } catch { cleanupFailures.push('unexpected_cleanup_error'); }
  }
  const report = { runId, mode: stripeOnly ? 'stripe-only' : uiMode ? 'browser-ui' : 'full-integration',
    fullIntegrationVerified: !stripeOnly && !results.some(result => result.status === 'failed'),
    completedAt: new Date().toISOString(), results, webhookReceipts: receipts, apiCalls,
    cleanup: { success: cleanupFailures.length === 0, failures: cleanupFailures,
      canceledSubscriptions: [...canceledSubscriptions], deletedCustomers: [...deletedCustomers],
      retained: 'Stripe transaction history, immutable inline Checkout snapshots, archived catalog products/prices and non-entitling cancellation tombstones' },
    success: !results.some(result => result.status === 'failed') && cleanupFailures.length === 0 };
  if (stripeConfirmed) {
    await mkdir(localDir, { recursive: true });
    await Bun.write(reportPath, JSON.stringify(report, null, 2));
  }
  console.log(JSON.stringify(report));
  process.exitCode = report.success ? 0 : 1;
}
