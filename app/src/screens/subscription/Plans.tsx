import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TopBar } from '../../components/ui/TopBar';
import { Button } from '../../components/ui/Button';
import { PLANS } from '../../content/plans';
import { useAuthStore } from '../../store/authStore';
import { useAssinatura } from '../../lib/assinatura';
import { paymentHeaders, paymentReturnMessage } from '../../lib/payment-client';
import { formatCents, PRICE_CENTS, type Cycle } from '../../../shared/billing';
import { CheckoutPix } from './CheckoutPix';

export function Plans() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cycle, setCycle] = useState<Cycle>('mensal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [returnMessage, setReturnMessage] = useState<string | null>(null);
  const [pixAberto, setPixAberto] = useState(false);
  const emailDaConta = useAuthStore(s => s.email) ?? '';
  const familyId = useAuthStore(s => s.familyId);
  const { plano, ciclo, carregando, erro } = useAssinatura(5000);
  const plan = PLANS[0];

  useEffect(() => {
    const status = searchParams.get('status');
    if (status) {
      setReturnMessage(paymentReturnMessage(status));
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  async function handleSubscribe() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST', headers: await paymentHeaders(familyId),
        body: JSON.stringify({ planId: plan.id, cycle, familyId }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? 'Não foi possível iniciar o pagamento.');
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível iniciar o pagamento. Tente novamente.');
      setLoading(false);
    }
  }

  const disabled = loading || carregando || Boolean(plano) || !familyId || erro;
  return (
    <div className="flex min-h-screen flex-col bg-cream pb-8">
      <TopBar title="Plano ReinoUp" backTo="/app/perfil" />
      <div className="px-4">
        <div className="mx-auto flex w-fit gap-1 rounded-full bg-white p-1 shadow-[var(--shadow-card)]">
          <button aria-pressed={cycle === 'mensal'} onClick={() => setCycle('mensal')}
            className={`rounded-full px-4 py-2 text-sm font-bold ${cycle === 'mensal' ? 'bg-navy text-white' : 'text-navy/80'}`}>
            Mensal
          </button>
          <button aria-pressed={cycle === 'anual'} onClick={() => setCycle('anual')}
            className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-bold ${cycle === 'anual' ? 'bg-navy text-white' : 'text-navy/80'}`}>
            Anual <span className="rounded-full bg-gold px-1.5 text-[10px] text-navy">-20%</span>
          </button>
        </div>
        <div className="mt-5 rounded-[var(--radius-card)] border-2 border-orange bg-orange-light/10 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-extrabold text-navy">{plan.name}</h2>
            {plano && <span className="text-xs font-bold text-green-dark">Ativo · {ciclo}</span>}
          </div>
          <p className="font-display text-2xl font-extrabold text-navy">
            R$ {formatCents(PRICE_CENTS[cycle])}
            <span className="text-sm font-semibold text-navy/80">/{cycle === 'anual' ? 'ano' : 'mês'}</span>
          </p>
          <p className="mt-1 text-sm font-semibold text-navy/80">Por conta do responsável, não por criança.</p>
          {cycle === 'anual' && <p className="mt-1 text-sm text-navy/80">Total anual de R$ {formatCents(PRICE_CENTS.anual)}, pago de uma vez. Equivale a aproximadamente R$ {formatCents(Math.round(PRICE_CENTS.anual / 12))}/mês.</p>}
          <ul className="mt-3 flex flex-col gap-1">
            {plan.features.map(feature => <li key={feature} className="text-sm text-navy/80">• {feature}</li>)}
          </ul>
        </div>
        <div role="status" className="mt-4 text-center text-sm font-semibold text-navy">
          {plano ? 'Acesso confirmado pelo servidor. Sua conta já tem todos os recursos.'
            : carregando ? 'Consultando sua assinatura…' : returnMessage}
        </div>
        <Button full size="lg" className="mt-6" onClick={handleSubscribe} disabled={disabled}>
          {loading ? 'Abrindo pagamento…' : 'Assinar com cartão'}
        </Button>
        <button onClick={() => setPixAberto(true)} disabled={disabled}
          className="mt-3 w-full rounded-pill border-2 border-navy/15 bg-white py-3.5 font-display text-base font-bold text-navy active:translate-y-[2px] disabled:opacity-60">
          Pagar com PIX
        </button>
        {!familyId && <p className="mt-3 text-center text-sm text-navy">Entre na conta online do responsável para pagar.</p>}
        {(error || erro) && <p role="alert" className="mt-3 text-center text-sm font-semibold text-navy">{error ?? 'Não foi possível consultar a assinatura. Verifique sua conexão; tentaremos novamente.'}</p>}
        <p className="mt-3 text-center text-xs text-navy/80">
          Cartão via Stripe: renovação automática a cada {cycle === 'anual' ? 'ano' : 'mês'}.
          {' '}PIX via PagBank: pagamento único, sem renovação automática.
        </p>
      </div>
      {pixAberto && <CheckoutPix aberto confirmado={Boolean(plano)} planId={plan.id} planNome={plan.name} cycle={cycle}
        valorFormatado={formatCents(PRICE_CENTS[cycle])} emailPadrao={emailDaConta} familyId={familyId}
        onFechar={() => setPixAberto(false)} />}
    </div>
  );
}
