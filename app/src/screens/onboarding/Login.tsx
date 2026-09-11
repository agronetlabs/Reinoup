import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TopBar } from '../../components/ui/TopBar';
import { Button } from '../../components/ui/Button';
import { MascotOficial } from '../../components/mascot/MascotOficial';
import { useAuthStore } from '../../store/authStore';
import { authRemotoDisponivel, entrarComoResponsavel } from '../../lib/auth-supabase';

export function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const mockSocialLogin = useAuthStore((s) => s.mockSocialLogin);
  const childProfile = useAuthStore((s) => s.childProfile);
  const setFamilyId = useAuthStore((s) => s.setFamilyId);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function afterAuth() {
    navigate(childProfile ? '/app' : '/onboarding-crianca', { replace: true });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (authRemotoDisponivel) {
      const remoto = await entrarComoResponsavel(email, password);
      if (!remoto.ok) return setError(remoto.error ?? 'Não foi possível entrar.');
      setFamilyId(remoto.familyId ?? null);
      register(email, password);
      afterAuth();
      return;
    }

    const result = login(email, password);
    if (!result.ok) return setError(result.error ?? 'Não foi possível entrar.');
    afterAuth();
  }

  function handleSocial(provider: 'google' | 'apple') {
    mockSocialLogin(provider);
    afterAuth();
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <TopBar backTo="/publico" />
      <div className="flex flex-1 flex-col px-6 pb-8">
        <div className="mb-6 text-center">
          <MascotOficial pose="acenando" size={110} className="mx-auto" />
          <h1 className="font-display mt-2 text-2xl font-extrabold text-navy">Bem-vindo(a) ao ReinoUp!</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-bold text-navy">
            E-mail ou usuário
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
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={4}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-navy/15 bg-white px-4 py-3.5 text-navy-deep outline-none focus:border-orange"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/50"
                aria-label="Mostrar senha"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </label>

          <p className="-mt-1 text-right text-sm font-semibold text-navy/70">Esqueceu sua senha?</p>

          {error && <p className="text-sm font-semibold text-red-soft">{error}</p>}

          <Button type="submit" full size="lg">
            Entrar
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-navy/40">
          <div className="h-px flex-1 bg-navy/15" />
          <span className="text-sm">ou</span>
          <div className="h-px flex-1 bg-navy/15" />
        </div>

        <div className="flex flex-col gap-3">
          <Button variant="secondary" full onClick={() => handleSocial('google')} icon={<GoogleIcon />}>
            Entrar com Google
          </Button>
          <Button variant="secondary" full onClick={() => handleSocial('apple')} icon={<AppleIcon />}>
            Entrar com Apple
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-navy/70">
          Não tem conta?{' '}
          <Link to="/criar-conta" className="font-bold text-orange">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.85.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.96 10.71a5.4 5.4 0 0 1 0-3.42V4.96H.96a9 9 0 0 0 0 8.08l3-2.33Z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3 2.33C4.67 5.16 6.66 3.58 9 3.58Z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="#111">
      <path d="M13.1 9.5c0-2 1.6-3 1.7-3.1-.9-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3 0-2.6.8-3.3 2C1.5 9 2.5 12.7 4 14.7c.7 1 1.5 2.1 2.6 2 1-.1 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.6 1.1 0 1.8-1 2.5-2 .8-1.1 1.1-2.2 1.1-2.3-.1 0-2.1-.8-2.5-2.8Z" />
      <path d="M10.9 3.2c.6-.7 1-1.7.9-2.7-.9.1-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6.9.1 1.9-.5 2.5-1.2Z" />
    </svg>
  );
}

