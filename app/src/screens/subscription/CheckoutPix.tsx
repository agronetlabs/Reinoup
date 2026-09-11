import { useEffect, useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { BrandIcon } from '../../components/illustrations/BrandIcon';
import { paymentHeaders } from '../../lib/payment-client';

/**
 * Checkout por PIX (PagBank).
 *
 * Dois passos: o responsável informa nome e CPF — o PagBank exige `tax_id`
 * para emitir PIX — e then recebe o QR Code com o "copia e cola".
 *
 * Esta tela é do adulto, não da criança: por isso texto direto, sem mascote e
 * sem gamificação.
 */

interface CheckoutPixProps {
  aberto: boolean;
  confirmado: boolean;
  planId: 'essencial' | 'completo' | 'familia';
  planNome: string;
  cycle: 'mensal' | 'anual';
  valorFormatado: string;
  emailPadrao?: string;
  /** Amarra o pagamento a conta do responsavel. Null no modo 100% local. */
  familyId?: string | null;
  onFechar: () => void;
}

interface PixGerado {
  copiaECola: string;
  imagemQrCode: string | null;
  expiraEm: string;
}

/** 000.000.000-00 enquanto digita. */
function mascararCpf(valor: string): string {
  const d = valor.replace(/\D/g, '').slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function CheckoutPix({
  aberto,
  confirmado,
  planId,
  planNome,
  cycle,
  valorFormatado,
  emailPadrao = '',
  familyId = null,
  onFechar,
}: CheckoutPixProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState(emailPadrao);
  const [cpf, setCpf] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [pix, setPix] = useState<PixGerado | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [agora, setAgora] = useState(Date.now());
  const expirado = Boolean(pix && Date.parse(pix.expiraEm) <= agora);

  useEffect(() => {
    if (!pix) return;
    const timer = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [pix]);

  async function gerarPix() {
    setErro(null);
    setCarregando(true);
    try {
      const res = await fetch('/api/pagbank-criar-pedido', {
        method: 'POST',
        headers: await paymentHeaders(familyId),
        body: JSON.stringify({ planId, cycle, nome, email, cpf, familyId }),
      });
      const dados = (await res.json()) as Partial<PixGerado> & { error?: string };
      if (!res.ok || !dados.copiaECola) {
        throw new Error(dados.error ?? 'Não foi possível gerar o PIX.');
      }
      setPix({
        copiaECola: dados.copiaECola,
        imagemQrCode: dados.imagemQrCode ?? null,
        expiraEm: dados.expiraEm ?? '',
      });
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível gerar o PIX.');
    } finally {
      setCarregando(false);
    }
  }

  async function copiar() {
    if (!pix || expirado || confirmado) return;
    try {
      await navigator.clipboard.writeText(pix.copiaECola);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      setErro('Não consegui copiar. Selecione o código manualmente.');
    }
  }

  function fechar() {
    setPix(null);
    setErro(null);
    setCopiado(false);
    onFechar();
  }

  return (
    <Modal open={aberto} onClose={fechar}>
      {confirmado ? (
        <div className="flex flex-col gap-4 text-center" role="status">
          <h2 className="font-display text-xl font-bold text-navy">Acesso confirmado!</h2>
          <p className="text-sm text-navy">Sua conta já tem todos os recursos do ReinoUp.</p>
          <button onClick={fechar} className="font-bold text-navy underline">Continuar</button>
        </div>
      ) : !pix ? (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-navy">Pagar com PIX</h2>
            <p className="mt-1 text-sm font-semibold text-navy/80">
              {planNome} · {cycle} · <span className="text-navy">R$ {valorFormatado}</span>
            </p>
            <p className="mt-2 text-sm text-navy/80">Pagamento único por conta do responsável. Sem renovação automática.</p>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-bold text-navy">Nome completo</span>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoComplete="name"
              placeholder="Como está no seu documento"
              className="rounded-2xl border-2 border-navy/10 px-4 py-3 font-semibold text-navy-deep outline-none focus:border-orange"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-bold text-navy">E-mail</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              placeholder="email@email.com"
              className="rounded-2xl border-2 border-navy/10 px-4 py-3 font-semibold text-navy-deep outline-none focus:border-orange"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-bold text-navy">CPF</span>
            <input
              value={cpf}
              onChange={(e) => setCpf(mascararCpf(e.target.value))}
              inputMode="numeric"
              placeholder="000.000.000-00"
              className="rounded-2xl border-2 border-navy/10 px-4 py-3 font-semibold tabular-nums text-navy-deep outline-none focus:border-orange"
            />
            <span className="text-xs text-navy/80">Exigido pelo banco para emitir o PIX.</span>
          </label>

          {erro && <p role="alert" className="text-sm font-semibold text-navy">{erro}</p>}

          <button
            onClick={gerarPix}
            disabled={carregando}
            className="w-full rounded-pill bg-orange py-4 font-display text-base font-bold text-white shadow-[0_5px_0_0_var(--color-orange-dark)] active:translate-y-[3px] active:shadow-[0_2px_0_0_var(--color-orange-dark)] disabled:opacity-60"
          >
            {carregando ? 'Gerando PIX...' : 'Gerar PIX'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 text-center">
          <BrandIcon name="protecao" size={36} />
          <div>
            <h2 className="font-display text-xl font-bold text-navy">{expirado ? 'Código PIX expirado' : 'PIX gerado'}</h2>
            <p className="mt-1 text-sm font-semibold text-navy/80">
              {expirado ? 'Se já pagou, aguarde a confirmação antes de gerar outro código.' : `Total: R$ ${valorFormatado}. Abra o app do seu banco e pague com o código abaixo.`}
            </p>
          </div>

          {!expirado && pix.imagemQrCode && (
            <img
              src={pix.imagemQrCode}
              alt="QR Code do PIX"
              className="h-52 w-52 rounded-2xl border-2 border-navy/10 bg-white p-2"
            />
          )}

          {!expirado && <p className="max-h-24 w-full overflow-y-auto break-all rounded-2xl bg-cream-dark p-3 text-left text-[11px] font-semibold text-navy-deep">
            {pix.copiaECola}
          </p>}

          <button
            onClick={copiar}
            disabled={expirado}
            className="w-full rounded-pill bg-navy py-3.5 font-display text-base font-bold text-white active:translate-y-[2px] disabled:opacity-60"
          >
            {copiado ? 'Código copiado ✓' : 'Copiar código'}
          </button>

          {erro && <p role="alert" className="text-sm font-semibold text-navy">{erro}</p>}

          <p role="status" className="text-xs leading-snug text-navy/80">
            {expirado ? 'Feche esta janela para gerar outro PIX se ainda não pagou.' : `Código válido até ${new Date(pix.expiraEm).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.`}
            {' '}Estamos consultando a confirmação do provedor. O acesso só é liberado após a confirmação.
          </p>

          <button onClick={fechar} className="text-sm font-bold text-navy/80 underline">
            Fechar
          </button>
        </div>
      )}
    </Modal>
  );
}
