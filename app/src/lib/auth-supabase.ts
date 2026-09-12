import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Autenticação do responsável.
 *
 * Regra do produto: **o pai é o titular da conta; a criança é um perfil.**
 * Criança não tem e-mail, não tem senha e não faz login — ela escolhe o
 * rostinho dela na seleção de perfil. Isso é o que resolve LGPD, perfis
 * múltiplos e a impossibilidade de a criança comprar ou cancelar.
 *
 * Coexiste com o cadastro local: sem `VITE_SUPABASE_*`, tudo continua em
 * localStorage e o app funciona igual. Com as variáveis, a conta passa a ser
 * de verdade e o `familyId` (= id do usuário) amarra pagamento e progresso.
 */

export interface ResultadoAuth {
  ok: boolean;
  /** id do usuário no Supabase — é o mesmo `family_id` das tabelas. */
  familyId?: string;
  /**
   * Conta criada, mas sem sessão: o projeto exige confirmação de e-mail.
   *
   * Sem sessão o RLS barra toda consulta, então o pai entraria e não veria a
   * própria assinatura — parecendo que o pagamento sumiu. Precisa ser dito na
   * tela, não engolido.
   */
  precisaConfirmarEmail?: boolean;
  error?: string;
}

/** Traduz o erro do Supabase, que vem em inglês e técnico demais para um pai. */
function traduzirErro(mensagem: string): string {
  const m = mensagem.toLowerCase();
  if (m.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (m.includes('already registered') || m.includes('already been registered')) {
    return 'Já existe uma conta com esse e-mail. Tente entrar.';
  }
  if (m.includes('password should be at least')) return 'A senha precisa ter pelo menos 6 caracteres.';
  if (m.includes('unable to validate email')) return 'Digite um e-mail válido.';
  if (m.includes('email not confirmed')) return 'Confirme o e-mail que enviamos antes de entrar.';
  if (m.includes('rate limit') || m.includes('too many')) return 'Muitas tentativas. Espere um minuto.';
  return 'Não foi possível concluir. Tente de novo em instantes.';
}

export const authRemotoDisponivel = isSupabaseConfigured;

export async function cadastrarResponsavel(email: string, senha: string): Promise<ResultadoAuth> {
  if (!supabase) return { ok: false, error: 'Cadastro remoto indisponível.' };

  const { data, error } = await supabase.auth.signUp({ email, password: senha });
  if (error) return { ok: false, error: traduzirErro(error.message) };

  // O trigger `on_auth_user_created` cria a linha em `families` sozinho.
  return {
    ok: true,
    familyId: data.user?.id,
    precisaConfirmarEmail: !data.session,
  };
}

export async function entrarComoResponsavel(email: string, senha: string): Promise<ResultadoAuth> {
  if (!supabase) return { ok: false, error: 'Login remoto indisponível.' };

  const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (error) return { ok: false, error: traduzirErro(error.message) };

  return { ok: true, familyId: data.user?.id };
}

export async function sairDaConta(): Promise<void> {
  await supabase?.auth.signOut();
}

/** Sessão já existente — o Supabase renova o token sozinho entre aberturas. */
export async function familyIdDaSessao(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

/**
 * Verifica se o usuário autenticado tem privilégio de administrador.
 *
 * A checagem acontece no banco via `is_admin_session()` (SECURITY DEFINER),
 * então não basta o cliente fingir — o servidor confirma olhando a coluna
 * `is_admin` em `families`.
 */
export async function verificarAdmin(): Promise<boolean> {
  if (!supabase) return false;
  const { data } = await supabase.rpc('is_admin_session');
  return data === true;
}
