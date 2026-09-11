import type { Valor } from './valores';

export type { Valor } from './valores';

export type AgeBand = '5-7' | '8-10';

export type SkyMood = 'dia' | 'entardecer' | 'noite' | 'tempestade';
export type GroundMood = 'campo' | 'deserto' | 'agua' | 'pedra' | 'palacio' | 'jardim';

export type Motif =
  // --- motivos do MVP ---
  | 'sheep'
  | 'shepherd-boy'
  | 'sling'
  | 'giant'
  | 'sword'
  | 'ark'
  | 'rain'
  | 'rainbow'
  | 'dove'
  | 'tent'
  | 'coat-colorful'
  | 'well'
  | 'grain'
  | 'crown'
  | 'staff'
  | 'sea-split'
  | 'chariot'
  | 'fire-column'
  | 'boat'
  | 'big-fish'
  | 'storm-waves'
  | 'plant'
  | 'lion'
  | 'den'
  | 'star'
  | 'angel'
  | 'scroll'
  | 'mountain'
  | 'palace'
  | 'basket'
  // --- motivos exigidos por Gênesis ---
  | 'serpent'
  | 'fruit-tree'
  | 'garden'
  | 'tower'
  | 'altar'
  | 'ram'
  | 'camel'
  | 'cistern'
  | 'cup'
  | 'stone-pillow'
  | 'ladder-angels'
  | 'footprints'
  | 'seed'
  | 'tree-of-life';

export interface SceneConfig {
  sky: SkyMood;
  ground: GroundMood;
  motifs: Motif[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  /** Sempre explica a resposta certa. Nunca julga o erro. */
  explanation: string;
  /**
   * Uma figura por opção — o quiz vira grade 2×2 ilustrada.
   * Essencial para 5 a 7 anos, que ainda não leem sozinhos.
   * Se presente, precisa ter o mesmo tamanho de `options`.
   */
  optionIcons?: Motif[];
}

export interface StoryChoice {
  question: string;
  options: { text: string; correct: boolean; feedback: string }[];
}

/**
 * Narração por faixa etária.
 *
 * Regra de tamanho (ver CONTENT-MODEL.md):
 *   '5-7'  → 25 a 45 palavras por página, uma ideia por frase
 *   '8-10' → 50 a 90 palavras por página, pode ter diálogo e subordinada
 */
export interface PagesByAge {
  '5-7': string[];
  '8-10': string[];
}

export interface Chapter {
  id: string;
  title: string;
  scene: SceneConfig;
  pages: PagesByAge;
  /** Exatamente 1 por história, no penúltimo capítulo. */
  choice?: StoryChoice;
}

/** Marca conteúdo que exige adaptação — ver a matriz de sensibilidade. */
export type SensibilidadeTag =
  | 'violencia'
  | 'morte'
  | 'destruicao'
  | 'engano'
  | 'arranjo-familiar';

/** Material do encontro presencial — usado pelo Modo Professor (ainda dormente). */
export interface SalaDeAula {
  quebraGelo?: string;
  dinamica: string;
  atividade: string;
}

export interface Story {
  // ---- identidade ----
  /** Padrão: `<livro>-<ordem 2 dígitos>-<slug>` — ex.: 'gn-01-criacao'. */
  id: string;
  seasonId: SeasonId;
  blocoId: string;
  /** Posição na temporada (1..N). */
  order: number;
  title: string;
  /** Referência bíblica — ex.: 'Gênesis 1–2'. */
  reference: string;

  // ---- pedagogia (REINOUP KIDS) ----
  objetivo: string;
  personagens: string[];
  licao: string;
  /** A frase ⭐ do material. Vira a semente plantada na Árvore da Palavra. */
  fraseMemoravel: string;
  oracao: string;
  valor: Valor;
  valoresSecundarios?: Valor[];

  // ---- narrativa ----
  summary: string;
  cover: SceneConfig;
  chapters: Chapter[];

  // ---- avaliação ----
  /** 6 perguntas: 2 de fato · 2 de compreensão · 1 do versículo · 1 de aplicação. */
  quiz: QuizQuestion[];
  verseId: string;

  // ---- jogos ----
  /** 6 a 8 palavras, MAIÚSCULAS, sem acento, 4 a 8 letras. */
  wordBank: string[];
  /** Exatamente 6 pares. */
  memoryPairs: { icon: Motif; label: string }[];
  /** Exatamente 5 passos, já na ordem certa — o jogo embaralha. */
  orderSteps: string[];

  // ---- pais e professor ----
  /** Vira o Kit do Pai: perguntas prontas pra puxar conversa. */
  perguntasConversa: string[];
  salaDeAula: SalaDeAula;

  // ---- segurança editorial ----
  sensibilidade?: SensibilidadeTag[];
}

// ============================================================
// Temporadas e blocos
// ============================================================

export type SeasonId = 'genesis' | 'bonus';

export interface Bloco {
  id: string;
  title: string;
  subtitle: string;
  /** Intervalo de `order` coberto por este bloco (inclusivo). */
  range: [number, number];
  /** Medalha entregue ao concluir o bloco. */
  badgeId: string;
}

export interface Season {
  id: SeasonId;
  title: string;
  subtitle: string;
  /** A frase que amarra a temporada inteira. */
  fraseGuia: string;
  livro: string;
  totalPlanejado: number;
  blocos: Bloco[];
  /** Temporada sequencial trava a fase N+1 até concluir a N. */
  sequencial: boolean;
  /**
   * Temporada inteira exige plano ativo.
   *
   * A temporada principal usa a degustação de FASES_GRATUITAS; conteúdo extra
   * é benefício de assinante desde a primeira fase. Deixe false durante o
   * pré-lançamento se quiser tudo aberto para os primeiros pais testarem.
   */
  exigePlano: boolean;
}

// ============================================================
// Demais tipos de conteúdo
// ============================================================

export interface VerseVariant {
  '5-7': string;
  '8-10': string;
}

export interface Verse {
  id: string;
  reference: string;
  text: VerseVariant;
  category: Valor;
}

export interface Disciple {
  id: string;
  name: string;
  fact: string;
}

export type BadgeCategory = 'progresso' | 'constancia' | 'dominio' | 'carater' | 'secreta';

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  icon: string;
}

export type MissionKind = 'trilha' | 'tematica' | 'colecao' | 'vida-real';

export interface Mission {
  id: string;
  kind: MissionKind;
  title: string;
  subtitle: string;
  target: number;
  reward: { coins: number; xp: number };
}

export interface Plan {
  id: 'essencial' | 'completo' | 'familia';
  name: string;
  prices: { mensal: number; anual: number };
  features: string[];
  highlight?: boolean;
}


