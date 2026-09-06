export interface StoryArtAsset {
  alt: string;
  focalPoint?: string;
  guide?: 'left' | 'right';
  src: string;
}

const rawBase = import.meta.env?.BASE_URL || '/';
const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;
const creation = `${base}story-art/genesis/gn-01`;
const bonus = `${base}story-art/bonus`;

const STORY_ART: Record<string, StoryArtAsset> = {
  // ============================================================
  // Gênesis 01: Deus Criou Tudo
  // ============================================================
  'gn-01-criacao': {
    alt: 'Jardim cheio de vida, árvores, rio e animais sob a luz do amanhecer',
    focalPoint: '50% 50%',
    guide: 'right',
    src: `${creation}/cover.svg`,
  },
  'gn-01-c1': {
    alt: 'A escuridão do começo sendo iluminada por estrelas e pela primeira luz',
    focalPoint: '50% 45%',
    guide: 'right',
    src: `${creation}/01-no-comeco.svg`,
  },
  'gn-01-c2': {
    alt: 'A luz surgindo sobre o mar, a terra e as primeiras plantas',
    focalPoint: '50% 55%',
    guide: 'left',
    src: `${creation}/02-haja-luz.svg`,
  },
  'gn-01-c3': {
    alt: 'Sol, lua e estrelas sobre um mar com peixes e um céu cheio de aves',
    focalPoint: '50% 45%',
    guide: 'right',
    src: `${creation}/03-luzes-peixes-aves.svg`,
  },
  'gn-01-c4': {
    alt: 'Animais grandes e pequenos reunidos em um campo cheio de vida',
    focalPoint: '50% 58%',
    guide: 'left',
    src: `${creation}/04-animais.svg`,
  },
  'gn-01-c5': {
    alt: 'Adão e Eva contemplando o jardim criado por Deus',
    focalPoint: '50% 52%',
    src: `${creation}/05-deus-criou-voce.svg`,
  },

  // ============================================================
  // Davi e Golias
  // ============================================================
  'davi-golias': {
    alt: 'O jovem pastor Davi de pé no vale com sua funda diante do gigante Golias',
    focalPoint: '50% 50%',
    guide: 'right',
    src: `${bonus}/davi-golias/cover.svg`,
  },
  'dg-1': {
    alt: 'O profeta Samuel ungindo o jovem Davi com chifre de azeite nos pastos de Belém',
    focalPoint: '55% 50%',
    guide: 'left',
    src: `${bonus}/davi-golias/01-davi-escolhido.svg`,
  },
  'dg-2': {
    alt: 'O gigante Golias em pesada armadura de bronze desafiando o exército no vale',
    focalPoint: '50% 45%',
    guide: 'left',
    src: `${bonus}/davi-golias/02-gigante-golias.svg`,
  },
  'dg-3': {
    alt: 'Davi com cesto de provisões ouvindo a zombaria de Golias com coragem e fé',
    focalPoint: '45% 52%',
    guide: 'right',
    src: `${bonus}/davi-golias/03-davi-ouve-desafio.svg`,
  },
  'dg-4': {
    alt: 'Davi escolhendo cinco pedras lisas na água límpida do riacho',
    focalPoint: '48% 54%',
    guide: 'right',
    src: `${bonus}/davi-golias/04-davi-se-prepara.svg`,
  },
  'dg-5': {
    alt: 'A grande vitória de Davi girando a funda e a coroa prometida brilhando no céu',
    focalPoint: '50% 48%',
    guide: 'left',
    src: `${bonus}/davi-golias/05-vitoria-davi.svg`,
  },

  // ============================================================
  // A Arca de Noé
  // ============================================================
  'arca-de-noe': {
    alt: 'A grande arca de madeira navegando em segurança sob o arco-íris da aliança de Deus',
    focalPoint: '50% 50%',
    guide: 'right',
    src: `${bonus}/arca-de-noe/cover.svg`,
  },
  'an-1': {
    alt: 'Noé em oração sincera nos campos verdes caminhando em amizade com Deus',
    focalPoint: '55% 52%',
    guide: 'left',
    src: `${bonus}/arca-de-noe/01-homem-justo.svg`,
  },
  'an-2': {
    alt: 'Noé examinando o pergaminho com as instruções e medidas celestiais da arca',
    focalPoint: '58% 50%',
    guide: 'left',
    src: `${bonus}/arca-de-noe/02-instrucoes-deus.svg`,
  },
  'an-3': {
    alt: 'Noé e sua família construindo a imensa arca de madeira com dedicação',
    focalPoint: '50% 50%',
    guide: 'left',
    src: `${bonus}/arca-de-noe/03-construcao-arca.svg`,
  },
  'an-4': {
    alt: 'O dilúvio com raios e chuva forte, e a porta da arca selada com a proteção de Deus',
    focalPoint: '50% 48%',
    guide: 'right',
    src: `${bonus}/arca-de-noe/04-chuva-comeca.svg`,
  },
  'an-5': {
    alt: 'A pomba branca trazendo o ramo de oliveira e o arco-íris brilhando no Monte Ararate',
    focalPoint: '50% 48%',
    guide: 'left',
    src: `${bonus}/arca-de-noe/05-arco-iris-promessa.svg`,
  },

  // ============================================================
  // José e seus Irmãos
  // ============================================================
  'jose-e-seus-irmaos': {
    alt: 'José no Egito com sua túnica colorida, celeiros repletos de trigo e palácio',
    focalPoint: '50% 50%',
    guide: 'right',
    src: `${bonus}/jose-e-seus-irmaos/cover.svg`,
  },
  'jo-1': {
    alt: 'O sonho de José com as onze estrelas, o sol, a lua e os feixes de trigo no céu noturno',
    focalPoint: '50% 45%',
    guide: 'left',
    src: `${bonus}/jose-e-seus-irmaos/01-sonho-jose.svg`,
  },
  'jo-2': {
    alt: 'O poço antigo no deserto, a túnica colorida e a caravana a caminho do Egito',
    focalPoint: '50% 52%',
    guide: 'left',
    src: `${bonus}/jose-e-seus-irmaos/02-vendido-irmaos.svg`,
  },
  'jo-3': {
    alt: 'José governando no Egito e administrando grandes montes de trigo nos anos de fartura',
    focalPoint: '50% 48%',
    guide: 'left',
    src: `${bonus}/jose-e-seus-irmaos/03-jose-egito.svg`,
  },
  'jo-4': {
    alt: 'Os irmãos curvados pedindo alimento no palácio sem reconhecer o governador José',
    focalPoint: '55% 50%',
    guide: 'left',
    src: `${bonus}/jose-e-seus-irmaos/04-reencontro-irmaos.svg`,
  },
  'jo-5': {
    alt: 'José descendo do trono e abraçando seus irmãos em perdão e reconciliação familiar',
    focalPoint: '50% 48%',
    guide: 'right',
    src: `${bonus}/jose-e-seus-irmaos/05-perdao-jose.svg`,
  },

  // ============================================================
  // Moisés e o Mar Vermelho
  // ============================================================
  'moises-mar-vermelho': {
    alt: 'Moisés erguendo o cajado e o Mar Vermelho se abrindo com a coluna de fogo',
    focalPoint: '50% 48%',
    guide: 'left',
    src: `${bonus}/moises-mar-vermelho/cover.svg`,
  },
  'mv-1': {
    alt: 'O bebê Moisés flutuando em seu cestinho no Rio Nilo e sendo acolhido com amor',
    focalPoint: '52% 52%',
    guide: 'left',
    src: `${bonus}/moises-mar-vermelho/01-bebe-cesto.svg`,
  },
  'mv-2': {
    alt: 'Moisés tirando as sandálias diante da sarça que ardia sem se consumir no monte',
    focalPoint: '55% 50%',
    guide: 'left',
    src: `${bonus}/moises-mar-vermelho/02-sarca-ardente.svg`,
  },
  'mv-3': {
    alt: 'Moisés e Arão no palácio de Faraó proclamando a ordem de Deus para libertar o povo',
    focalPoint: '50% 48%',
    guide: 'left',
    src: `${bonus}/moises-mar-vermelho/03-deixe-meu-povo-ir.svg`,
  },
  'mv-4': {
    alt: 'A coluna de nuvem e fogo de Deus protegendo o povo de Israel do exército egípcio',
    focalPoint: '50% 48%',
    guide: 'left',
    src: `${bonus}/moises-mar-vermelho/04-entre-mar-exercito.svg`,
  },
  'mv-5': {
    alt: 'O povo de Israel atravessando a pé enxuto no meio das muralhas do mar com cânticos',
    focalPoint: '50% 48%',
    guide: 'left',
    src: `${bonus}/moises-mar-vermelho/05-mar-se-abre.svg`,
  },

  // ============================================================
  // Jonas e o Grande Peixe
  // ============================================================
  'jonas-grande-peixe': {
    alt: 'O grande peixe amigo emergindo da água azul e Jonas na praia agradecendo a Deus',
    focalPoint: '50% 50%',
    guide: 'left',
    src: `${bonus}/jonas-grande-peixe/cover.svg`,
  },
  'jg-1': {
    alt: 'Jonas no porto de Jope embarcando às pressas no navio para fugir de Deus',
    focalPoint: '50% 50%',
    guide: 'left',
    src: `${bonus}/jonas-grande-peixe/01-fuga-jonas.svg`,
  },
  'jg-2': {
    alt: 'O mar tempestuoso com grandes ondas e o barco sendo sacudido pelo vento forte',
    focalPoint: '50% 48%',
    guide: 'left',
    src: `${bonus}/jonas-grande-peixe/02-tempestade-mar.svg`,
  },
  'jg-3': {
    alt: 'Jonas protegido e em oração no fundo do oceano dentro do grande peixe',
    focalPoint: '50% 48%',
    guide: 'right',
    src: `${bonus}/jonas-grande-peixe/03-dentro-peixe.svg`,
  },
  'jg-4': {
    alt: 'O grande peixe deixando Jonas a salvo na praia sob a luz de uma segunda chance',
    focalPoint: '50% 52%',
    guide: 'left',
    src: `${bonus}/jonas-grande-peixe/04-segunda-chance.svg`,
  },
  'jg-5': {
    alt: 'Jonas sob a sombra da planta olhando a cidade de Nínive arrependida e perdoada',
    focalPoint: '50% 50%',
    guide: 'left',
    src: `${bonus}/jonas-grande-peixe/05-ninive-arrepende.svg`,
  },

  // ============================================================
  // Daniel na Cova dos Leões
  // ============================================================
  'daniel-cova-dos-leoes': {
    alt: 'Daniel em oração serena na cova de pedras com leões mansos e o anjo do Senhor',
    focalPoint: '50% 50%',
    guide: 'right',
    src: `${bonus}/daniel-cova-dos-leoes/cover.svg`,
  },
  'dl-1': {
    alt: 'Daniel orando a Deus três vezes ao dia em seu aposento com a janela aberta',
    focalPoint: '50% 50%',
    guide: 'left',
    src: `${bonus}/daniel-cova-dos-leoes/01-servo-fiel.svg`,
  },
  'dl-2': {
    alt: 'Os líderes invejosos tramando nos corredores do palácio por causa da fidelidade de Daniel',
    focalPoint: '50% 48%',
    guide: 'right',
    src: `${bonus}/daniel-cova-dos-leoes/02-inveja-lideres.svg`,
  },
  'dl-3': {
    alt: 'O rei assinando o decreto real que proibia a oração com selo de cera',
    focalPoint: '50% 52%',
    guide: 'left',
    src: `${bonus}/daniel-cova-dos-leoes/03-lei-armadilha.svg`,
  },
  'dl-4': {
    alt: 'Daniel na cova fechada com a grande pedra, confiando em Deus junto aos leões',
    focalPoint: '50% 50%',
    guide: 'left',
    src: `${bonus}/daniel-cova-dos-leoes/04-cova-leoes.svg`,
  },
  'dl-5': {
    alt: 'A luz do amanhecer na cova e o anjo de Deus que fechou a boca dos leões',
    focalPoint: '50% 48%',
    guide: 'left',
    src: `${bonus}/daniel-cova-dos-leoes/05-anjo-fecha-boca.svg`,
  },
};

export function getStoryArt(id?: string): StoryArtAsset | undefined {
  return id ? STORY_ART[id] : undefined;
}
