import type { Season, SeasonId, SensibilidadeTag } from './types';
import type { Valor } from './valores';

/**
 * Temporadas do ReinoUp.
 *
 * Uma temporada é um livro da Bíblia. Ela é sequencial: a fase N+1 só abre
 * quando a N é concluída — é uma narrativa, e o gancho de "amanhã eu descubro
 * o que acontece" depende da ordem.
 */
export const SEASONS: Record<SeasonId, Season> = {
  genesis: {
    id: 'genesis',
    title: 'Gênesis',
    subtitle: 'Deus estava lá',
    fraseGuia: 'DEUS ESTAVA LÁ — E DEUS TAMBÉM ESTÁ COMIGO!',
    livro: 'Gênesis',
    totalPlanejado: 39,
    sequencial: true,
    // Gênesis usa a degustação: as primeiras fases abrem sem assinatura.
    exigePlano: false,
    blocos: [
      {
        id: 'gn-b1',
        title: 'As Origens',
        subtitle: 'Do princípio de tudo até a torre que não chegou ao céu.',
        range: [1, 6],
        badgeId: 'md-gn-bloco-1',
      },
      {
        id: 'gn-b2',
        title: 'A Fé de Abraão',
        subtitle: 'Um homem que saiu de casa sem mapa, só com a promessa.',
        range: [7, 17],
        badgeId: 'md-gn-bloco-2',
      },
      {
        id: 'gn-b3',
        title: 'Isaque e a Nova Geração',
        subtitle: 'A promessa passa adiante — e as escolhas também.',
        range: [18, 20],
        badgeId: 'md-gn-bloco-3',
      },
      {
        id: 'gn-b4',
        title: 'A Transformação de Jacó',
        subtitle: 'De enganador a Israel: Deus muda pessoas.',
        range: [21, 26],
        badgeId: 'md-gn-bloco-4',
      },
      {
        id: 'gn-b5',
        title: 'José: do Poço ao Palácio',
        subtitle: 'O maior arco de Gênesis — rejeição, espera e perdão.',
        range: [27, 39],
        badgeId: 'md-gn-bloco-5',
      },
    ],
  },
  bonus: {
    id: 'bonus',
    title: 'Histórias Bônus',
    subtitle: 'Grandes histórias de outros livros',
    fraseGuia: 'Deus agiu em toda a Bíblia.',
    livro: 'Vários',
    totalPlanejado: 3,
    sequencial: false,
    // Conteúdo extra é benefício de assinante desde a primeira fase.
    exigePlano: true,
    blocos: [
      {
        id: 'bonus-b1',
        title: 'Heróis da Fé',
        subtitle: 'Histórias fora de Gênesis, liberadas conforme você avança.',
        range: [1, 99],
        badgeId: 'md-bonus-completo',
      },
    ],
  },
};

export const SEASON_ORDER: SeasonId[] = ['genesis', 'bonus'];

export function getSeason(id: SeasonId): Season {
  return SEASONS[id];
}

/** Qual bloco cobre determinada posição da temporada. */
export function blocoDaOrdem(seasonId: SeasonId, order: number) {
  return SEASONS[seasonId].blocos.find((b) => order >= b.range[0] && order <= b.range[1]);
}

// ============================================================
// Roteiro de produção — Gênesis
// ============================================================

export interface RoadmapSlot {
  order: number;
  id: string;
  title: string;
  reference: string;
  valor: Valor;
  sensibilidade?: SensibilidadeTag[];
}

/**
 * As 39 aulas de Gênesis, na ordem, conforme o material REINOUP KIDS.
 *
 * Serve como checklist de produção e como fonte da verdade para os IDs:
 * nenhuma história deve ser criada com um id que não esteja aqui.
 */
export const GENESIS_ROADMAP: RoadmapSlot[] = [
  // ---- Bloco 1 · As Origens ----
  { order: 1, id: 'gn-01-criacao', title: 'Deus criou tudo', reference: 'Gênesis 1–2', valor: 'identidade' },
  { order: 2, id: 'gn-02-adao-eva', title: 'Adão e Eva', reference: 'Gênesis 3', valor: 'obediencia' },
  { order: 3, id: 'gn-03-caim-abel', title: 'Caim e Abel', reference: 'Gênesis 4', valor: 'obediencia', sensibilidade: ['violencia', 'morte'] },
  { order: 4, id: 'gn-04-enoque', title: 'Enoque andou com Deus', reference: 'Gênesis 5:21–24', valor: 'presenca' },
  { order: 5, id: 'gn-05-noe', title: 'Noé e a Arca', reference: 'Gênesis 6–9', valor: 'obediencia' },
  { order: 6, id: 'gn-06-babel', title: 'A Torre de Babel', reference: 'Gênesis 11:1–9', valor: 'obediencia' },

  // ---- Bloco 2 · A Fé de Abraão ----
  { order: 7, id: 'gn-07-chamado-abraao', title: 'Deus chama Abraão', reference: 'Gênesis 12', valor: 'confianca' },
  { order: 8, id: 'gn-08-abraao-lo', title: 'Abraão e Ló', reference: 'Gênesis 13', valor: 'generosidade' },
  { order: 9, id: 'gn-09-resgate-lo', title: 'Abraão resgata Ló', reference: 'Gênesis 14', valor: 'coragem' },
  { order: 10, id: 'gn-10-promessa-filho', title: 'Deus promete um filho', reference: 'Gênesis 15', valor: 'promessa' },
  { order: 11, id: 'gn-11-agar-ismael', title: 'Agar e Ismael', reference: 'Gênesis 16', valor: 'presenca', sensibilidade: ['arranjo-familiar'] },
  { order: 12, id: 'gn-12-novos-nomes', title: 'Deus muda os nomes', reference: 'Gênesis 17', valor: 'identidade' },
  { order: 13, id: 'gn-13-tres-visitantes', title: 'Os três visitantes', reference: 'Gênesis 18', valor: 'promessa' },
  { order: 14, id: 'gn-14-sodoma', title: 'Sodoma e Gomorra', reference: 'Gênesis 18–19', valor: 'obediencia', sensibilidade: ['destruicao'] },
  { order: 15, id: 'gn-15-nascimento-isaque', title: 'O nascimento de Isaque', reference: 'Gênesis 21', valor: 'promessa' },
  { order: 16, id: 'gn-16-abraao-isaque', title: 'Abraão e Isaque', reference: 'Gênesis 22', valor: 'confianca' },
  { order: 17, id: 'gn-17-morte-sara', title: 'A morte de Sara', reference: 'Gênesis 23', valor: 'presenca', sensibilidade: ['morte'] },

  // ---- Bloco 3 · Isaque e a Nova Geração ----
  { order: 18, id: 'gn-18-rebeca-poco', title: 'Rebeca no poço', reference: 'Gênesis 24', valor: 'generosidade' },
  { order: 19, id: 'gn-19-esau-jaco', title: 'Esaú e Jacó', reference: 'Gênesis 25', valor: 'obediencia' },
  { order: 20, id: 'gn-20-jaco-engana', title: 'Jacó engana Isaque', reference: 'Gênesis 27', valor: 'obediencia', sensibilidade: ['engano'] },

  // ---- Bloco 4 · A Transformação de Jacó ----
  { order: 21, id: 'gn-21-escada-jaco', title: 'A escada de Jacó', reference: 'Gênesis 28', valor: 'presenca' },
  { order: 22, id: 'gn-22-raquel-lia', title: 'Jacó, Raquel e Lia', reference: 'Gênesis 29', valor: 'confianca', sensibilidade: ['arranjo-familiar'] },
  { order: 23, id: 'gn-23-filhos-jaco', title: 'Os filhos de Jacó', reference: 'Gênesis 29–30', valor: 'amor' },
  { order: 24, id: 'gn-24-jaco-labao', title: 'Jacó e Labão', reference: 'Gênesis 30–31', valor: 'confianca' },
  { order: 25, id: 'gn-25-jaco-volta', title: 'Jacó volta para casa', reference: 'Gênesis 32–33', valor: 'perdao' },
  { order: 26, id: 'gn-26-jaco-luta', title: 'Jacó luta com Deus', reference: 'Gênesis 32', valor: 'proposito' },

  // ---- Bloco 5 · José: do Poço ao Palácio ----
  { order: 27, id: 'gn-27-jose-irmaos', title: 'José e seus irmãos', reference: 'Gênesis 37', valor: 'proposito' },
  { order: 28, id: 'gn-28-jose-potifar', title: 'José na casa de Potifar', reference: 'Gênesis 39', valor: 'obediencia' },
  { order: 29, id: 'gn-29-jose-prisao', title: 'José na prisão', reference: 'Gênesis 40', valor: 'presenca' },
  { order: 30, id: 'gn-30-sonhos-farao', title: 'José interpreta os sonhos de Faraó', reference: 'Gênesis 41', valor: 'proposito' },
  { order: 31, id: 'gn-31-irmaos-egito', title: 'Os irmãos de José vão ao Egito', reference: 'Gênesis 42', valor: 'obediencia' },
  { order: 32, id: 'gn-32-benjamim-taca', title: 'Benjamim e a taça', reference: 'Gênesis 43–44', valor: 'amor' },
  { order: 33, id: 'gn-33-jose-perdoa', title: 'José perdoa seus irmãos', reference: 'Gênesis 45', valor: 'perdao' },
  { order: 34, id: 'gn-34-jaco-egito', title: 'Jacó vai para o Egito', reference: 'Gênesis 46', valor: 'promessa' },
  { order: 35, id: 'gn-35-jose-cuida', title: 'José cuida da família', reference: 'Gênesis 47', valor: 'generosidade' },
  { order: 36, id: 'gn-36-efraim-manasses', title: 'Jacó abençoa Efraim e Manassés', reference: 'Gênesis 48', valor: 'proposito' },
  { order: 37, id: 'gn-37-bencao-filhos', title: 'Jacó abençoa seus filhos', reference: 'Gênesis 49', valor: 'identidade' },
  { order: 38, id: 'gn-38-morte-jaco', title: 'A morte de Jacó', reference: 'Gênesis 50', valor: 'proposito', sensibilidade: ['morte'] },
  { order: 39, id: 'gn-39-perdao-ate-o-fim', title: 'José: perdão até o fim', reference: 'Gênesis 50:15–26', valor: 'perdao' },
];

export function roadmapSlot(id: string): RoadmapSlot | undefined {
  return GENESIS_ROADMAP.find((s) => s.id === id);
}

