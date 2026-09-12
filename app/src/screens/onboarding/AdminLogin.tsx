import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../../components/ui/TopBar';
import { Button } from '../../components/ui/Button';
import { MascotOficial } from '../../components/mascot/MascotOficial';
import { useAuthStore } from '../../store/authStore';
import { authRemotoDisponivel, entrarComoResponsavel, verificarAdmin } from '../../lib/auth-supabase';

/**
 * Login exclusivo do administrador.
 *
 * Usa a mesma tabela `auth.users` do Supabase, mas depois de autenticar
 * chama `is_admin_session()` — uma função SECURITY DEFINER que verifica
 * a coluna `families.is_admin`. Sem aquele flag no banco, o login é
 * rejeitado mesmo com e-mail e senha corretos.
 */
export function AdminLogin() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const setFamilyId = useAuthStore((s) => s.setFamilyId);
  const setAdmin = useAuthStore((s) => s.setAdmin);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCarregando(true);

    if (!authRemotoDisponivel) {
      setCarregando(false);
      return setError('Acesso administrativo requer conexão com o servidor.');
    }

    const remoto = await entrarComoResponsavel(email, password);
    if (!remoto.ok) {
      setCarregando(false);
      return setError(remoto.error ?? 'Não foi possível entrar.');
    }

    const ehAdmin = await verificarAdmin();
    if (!ehAdmin) {
      setCarregando(false);
      return setError('Esta conta não tem privilégio de administrador.');
    }

    setFamilyId(remoto.familyId ?? null);
    setAdmin(true);
    register(email, password);
    setCarregando(false);
    navigate('/app/historias', { replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col bg-navy-deep">
      <TopBar backTo="/" dark />
      <div className="flex flex-1 flex-col px-6 pb-8">
        <div className="mb-6 text-center">
          <MascotOficial pose="acenando" size={100} className="mx-auto" />
          <h1 className="font-display mt-2 text-2xl font-extrabold text-white">Acesso Administrador</h1>
          <p className="mt-1 text-sm text-white/60">
            Conta especial que libera todas as histórias.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-bold text-white/80">
            E-mail
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@reinoup.app"
              className="mt-1 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3.5 text-white placeholder:text-white/40 outline-none focus:border-orange"
            />
          </label>

          <label className="text-sm font-bold text-white/80">
            Senha
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3.5 text-white outline-none focus:border-orange"
            />
          </label>

          {error && <p className="text-sm font-semibold text-orange">{error}</p>}

          <Button type="submit" full size="lg" disabled={carregando}>
            {carregando ? 'Verificando...' : 'Entrar como admin'}
          </Button>
        </form>
      </div>
    </div>
  );
}
