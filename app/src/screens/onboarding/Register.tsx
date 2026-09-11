import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../../components/ui/TopBar';
import { Button } from '../../components/ui/Button';
import { MascotOficial } from '../../components/mascot/MascotOficial';
import { useAuthStore } from '../../store/authStore';
import { authRemotoDisponivel, cadastrarResponsavel, entrarComoResponsavel } from '../../lib/auth-supabase';

export function Register() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const setFamilyId = useAuthStore((s) => s.setFamilyId);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) return setError('As senhas não coincidem.');

    setError(null);
    setEnviando(true);

    if (authRemotoDisponivel) {
      const remoto = await cadastrarResponsavel(email, password);
      if (!remoto.ok) {
        setEnviando(false);
        return setError(remoto.error ?? 'Não foi possível criar a conta.');
      }
      setFamilyId(remoto.familyId ?? null);

      if (remoto.precisaConfirmarEmail) {
        const login = await entrarComoResponsavel(email, password);
        if (!login.ok) {
          setEnviando(false);
          return setError(
            'Conta criada! Confirme o e-mail que enviamos para você e depois entre com sua senha.'
          );
        }
        setFamilyId(login.familyId ?? null);
      }
    }

    const result = register(email, password);
    setEnviando(false);
    if (!result.ok) return setError(result.error ?? 'Não foi possível criar a conta.');
    navigate('/onboarding-crianca', { replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <TopBar backTo="/login" />
      <div className="flex flex-1 flex-col px-6 pb-8">
        <MascotOficial size={88} recorte="busto" className="mx-auto" />
        <h1 className="font-display mb-6 text-2xl font-extrabold text-navy">Criar conta dos pais</h1>
        <p className="mb-6 text-sm text-navy/70">
          Essa conta é do responsável. Depois vamos configurar o perfil da criança.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-bold text-navy">
            E-mail
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@email.com"
              className="mt-1 w-full rounded-2xl border border-navy/15 bg-white px-4 py-3.5 text-navy-deep outline-none focus:border-orange"
            />
          </label>
          <label className="text-sm font-bold text-navy">
            Senha
            <input
              type="password"
              required
              minLength={4}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-navy/15 bg-white px-4 py-3.5 text-navy-deep outline-none focus:border-orange"
            />
          </label>
          <label className="text-sm font-bold text-navy">
            Confirmar senha
            <input
              type="password"
              required
              minLength={4}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-navy/15 bg-white px-4 py-3.5 text-navy-deep outline-none focus:border-orange"
            />
          </label>

          {error && <p className="text-sm font-semibold text-red-soft">{error}</p>}

          <Button type="submit" full size="lg" className="mt-2" disabled={enviando}>
            {enviando ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </form>
      </div>
    </div>
  );
}

