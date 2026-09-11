import type { Story } from '../../types';

/** AULA 03 — CAIM E ABEL */
export const gn03CaimAbel: Story = {
  id: 'gn-03-caim-abel',
  seasonId: 'genesis',
  blocoId: 'gn-b1',
  order: 3,
  title: 'Caim e Abel',
  reference: 'Gênesis 4',

  objetivo:
    'Ensinar que Deus vê o coração e nos chama a cuidar da raiva antes que ela machuque alguém, escolhendo o bem e buscando ajuda.',
  personagens: ['Deus', 'Caim', 'Abel', 'Adão', 'Eva'],
  licao: 'A raiva pode bater à porta, mas nós podemos escolher o bem e pedir ajuda antes de machucar.',
  fraseMemoravel: 'Eu posso escolher o bem quando a raiva chega.',
  oracao:
    'Deus, quando a raiva crescer dentro de mim, ajude-me a parar, falar e escolher o bem. Ensine-me a cuidar dos meus irmãos e a pedir ajuda. Amém.',
  valor: 'obediencia',
  valoresSecundarios: ['amor'],

  summary: 'Caim ficou com raiva de Abel, mas Deus o chamou a dominar esse sentimento e escolher o bem.',
  cover: { sky: 'entardecer', ground: 'campo', motifs: ['grain', 'sheep', 'altar'] },
  sensibilidade: ['violencia', 'morte'],

  chapters: [
    {
      id: 'gn-03-c1',
      title: 'Dois irmãos, dois presentes',
      scene: { sky: 'dia', ground: 'campo', motifs: ['grain', 'sheep', 'garden'] },
      pages: {
        '5-7': [
          'Adão e Eva tiveram dois filhos: Caim e Abel. Caim cuidava da terra e plantava sementes. Abel cuidava de ovelhas. Cada irmão tinha um trabalho diferente.',
          'Um dia, os dois levaram presentes para Deus. Abel trouxe o melhor do seu rebanho. Caim também levou uma oferta. Deus olhou para o coração de cada um.',
        ],
        '8-10': [
          'Adão e Eva tiveram dois filhos. Caim aprendeu a trabalhar a terra, plantar e colher. Abel escolheu cuidar das ovelhas e conhecer o jeito de cada animal. Os irmãos eram diferentes, mas ambos tinham um lugar e um trabalho na família.',
          'Certo dia, Caim e Abel levaram ofertas ao Senhor. Abel separou as primeiras e melhores ovelhas do seu rebanho. Caim também trouxe frutos da terra. Deus se agradou de Abel e de sua oferta; a reação de Caim mostrou que havia algo acontecendo em seu coração.',
        ],
      },
    },
    {
      id: 'gn-03-c2',
      title: 'Quando a raiva cresce',
      scene: { sky: 'entardecer', ground: 'campo', motifs: ['altar', 'grain', 'stone-pillow'] },
      pages: {
        '5-7': [
          'Caim ficou muito zangado. Seu rosto mudou, e ele sentiu vontade de culpar o irmão. Deus percebeu a raiva e falou com Caim. Deus queria ajudá-lo antes que aquela raiva fizesse mal.',
          'Deus perguntou por que Caim estava tão bravo. Ele ensinou: — Faça o que é certo. A raiva queria mandar, mas Caim ainda podia escolher o bem.',
        ],
        '8-10': [
          'Caim ficou triste e muito zangado porque sua oferta não tinha sido recebida como a de Abel. Em vez de conversar sobre o que sentia, deixou a comparação crescer. Deus viu seu rosto fechado e perguntou por que ele estava irado.',
          'Deus não tratou Caim como alguém sem esperança. Ele o avisou que o pecado queria dominá-lo, mas que Caim poderia dominá-lo. Antes de uma atitude perigosa, ainda existia uma escolha: parar, falar com Deus e procurar um caminho correto para lidar com a frustração.',
        ],
      },
    },
    {
      id: 'gn-03-c3',
      title: 'Escolher antes de agir',
      scene: { sky: 'entardecer', ground: 'campo', motifs: ['footprints', 'grain', 'sheep'] },
      pages: {
        '5-7': [
          'Caim chamou Abel para ir ao campo. A raiva ainda estava ali. Quando estamos muito bravos, é importante parar e chamar um adulto seguro. Podemos respirar, afastar o corpo e falar o que sentimos.',
          'Caim não parou. Ele machucou o irmão, e Abel morreu. A Bíblia conta isso sem esconder a dor. Deus ouviu o sangue de Abel e perguntou por Caim.',
        ],
        '8-10': [
          'Caim convidou Abel para ir ao campo, mas não levou consigo a orientação que Deus tinha dado. A raiva virou uma decisão terrível: Caim machucou o irmão, e Abel morreu. A Bíblia nomeia essa morte com seriedade, sem descrever ferimentos, porque a vida de Abel tinha grande valor.',
          'Quando uma emoção fica forte demais, ninguém precisa enfrentá-la sozinho. É possível interromper a situação, manter distância, procurar um adulto seguro e dizer: "Estou com muita raiva." Caim não fez isso. Sua escolha trouxe uma consequência dolorosa para a família inteira e para ele também.',
        ],
      },
      choice: {
        question: 'Quando a raiva está muito forte, qual escolha protege as pessoas?',
        options: [
          {
            text: 'Parar, afastar-se e pedir ajuda',
            correct: true,
            feedback: 'Isso! Afastar-se e chamar um adulto seguro ajuda a proteger todos enquanto você aprende a acalmar o coração.',
          },
          {
            text: 'Ir atrás da pessoa para machucá-la',
            correct: false,
            feedback: 'Machucar nunca resolve a raiva. Pare, mantenha distância e peça ajuda a um adulto seguro.',
          },
        ],
      },
    },
    {
      id: 'gn-03-c4',
      title: 'Deus vê e protege',
      scene: { sky: 'noite', ground: 'campo', motifs: ['star', 'footprints', 'seed'] },
      pages: {
        '5-7': [
          'Deus perguntou a Caim: — Onde está Abel? Caim tentou esconder o que fez, mas Deus sabia. O erro de Caim teve consequências, e ele precisou deixar aquela terra.',
          'Mesmo assim, Deus colocou um sinal para proteger Caim. A história é triste, mas ensina: Deus vê cada pessoa. Podemos escolher o bem antes que a raiva machuque alguém.',
        ],
        '8-10': [
          'Deus perguntou a Caim onde estava Abel. Caim respondeu como se não soubesse, mas Deus conhecia a verdade e ouviu o clamor do sangue de Abel. Caim teria de deixar a terra que cultivava; a violência havia quebrado sua relação com o irmão e mudado seu próprio caminho.',
          'Ainda assim, Deus marcou Caim para que ninguém o matasse. Isso não chamou o erro de certo; mostrou que a vida continuava protegida. Deus leva a sério a violência e também nos ensina a não aumentar a violência. A escolha mais sábia começa antes do machucado: parar, falar e buscar ajuda.',
        ],
      },
    },
  ],

  quiz: [
    {
      id: 'gn-03-q1',
      question: 'Qual era o trabalho de Abel?',
      options: ['Cuidar de ovelhas', 'Construir uma torre', 'Pescar no mar', 'Fazer coroas'],
      optionIcons: ['sheep', 'tower', 'big-fish', 'crown'],
      correctIndex: 0,
      explanation: 'Abel cuidava de ovelhas, enquanto Caim trabalhava com a terra.',
    },
    {
      id: 'gn-03-q2',
      question: 'O que Caim sentiu quando ficou comparando sua oferta?',
      options: ['Raiva', 'Sono', 'Alegria', 'Fome'],
      optionIcons: ['storm-waves', 'stone-pillow', 'star', 'grain'],
      correctIndex: 0,
      explanation: 'Caim deixou a frustração crescer e ficou muito zangado com Abel.',
    },
    {
      id: 'gn-03-q3',
      question: 'Quem Deus perguntou onde estava?',
      options: ['Abel', 'Caim', 'Adão', 'Eva'],
      correctIndex: 1,
      explanation: 'Deus perguntou a Caim: "Onde está Abel?" Caim precisava responder pela escolha que tinha feito.',
    },
    {
      id: 'gn-03-q4',
      question: 'O que Deus ensinou Caim a fazer quando a raiva chegou?',
      options: ['Escolher o que é certo', 'Culpar Abel', 'Esconder-se', 'Desistir de tudo'],
      correctIndex: 0,
      explanation: 'Deus avisou que Caim poderia dominar a raiva e escolher o bem.',
    },
    {
      id: 'gn-03-q5',
      question: 'Por que pedir ajuda é uma boa escolha quando estamos furiosos?',
      options: ['Protege as pessoas', 'Faz a raiva vencer', 'Esconde o problema', 'Machuca mais rápido'],
      correctIndex: 0,
      explanation: 'Parar, manter distância e pedir ajuda protege todos enquanto a emoção se acalma.',
    },
    {
      id: 'gn-03-q6',
      question: 'O que a história mostra sobre Deus?',
      options: ['Ele vê o coração e protege a vida', 'Ele gosta de brigas', 'Ele ignora a dor', 'Ele só cuida de ofertas'],
      correctIndex: 0,
      explanation: 'Deus viu a raiva de Caim, ouviu a dor de Abel e protegeu a vida mesmo depois de uma escolha terrível.',
    },
    {
      id: 'gn-03-q7',
      question: 'Complete: "O pecado está à porta; ele quer ___ você, mas você deve dominá-lo."',
      options: ['dominar', 'ensinar', 'abraçar', 'alegrar'],
      correctIndex: 0,
      explanation: 'Deus disse que o pecado queria dominar Caim, mas Caim poderia escolher o bem — Gênesis 4:7.',
    },
    {
      id: 'gn-03-q8',
      question: 'Alguém está tão bravo que pode machucar outra pessoa. O que você faz?',
      options: ['Chama um adulto seguro e mantém distância', 'Incentiva a briga', 'Guarda segredo', 'Vai machucar também'],
      correctIndex: 0,
      explanation: 'Chamar um adulto seguro e manter distância é uma atitude de proteção. Violência nunca é uma solução.',
    },
  ],

  verseId: 'v-gn-03',

  wordBank: ['CAIM', 'ABEL', 'OVELHA', 'GRAO', 'RAIVA', 'ESCOLHA', 'AJUDA', 'CERTO'],
  memoryPairs: [
    { icon: 'sheep', label: 'Ovelha' },
    { icon: 'grain', label: 'Grão' },
    { icon: 'altar', label: 'Altar' },
    { icon: 'seed', label: 'Semente' },
    { icon: 'footprints', label: 'Caminho' },
    { icon: 'storm-waves', label: 'Raiva' },
  ],
  orderSteps: [
    'Caim trabalha a terra e Abel cuida das ovelhas',
    'Os irmãos levam ofertas ao Senhor',
    'Caim deixa a raiva crescer',
    'Caim machuca Abel no campo',
    'Deus pergunta por Abel e protege a vida',
  ],

  perguntasConversa: [
    'Como seu corpo avisa que a raiva está crescendo?',
    'Quem pode ajudar quando uma briga parece perigosa?',
    'O que significa escolher o bem antes de agir?',
    'Como podemos cuidar dos irmãos e colegas?',
  ],
  salaDeAula: {
    quebraGelo: 'As crianças fazem uma pausa de respiração e cada uma diz o nome de um adulto seguro.',
    dinamica:
      'Em duplas, representar situações de frustração usando três passos: parar, afastar o corpo e pedir ajuda. Sem encenar agressões.',
    atividade: 'Criar um semáforo da raiva: vermelho para parar, amarelo para respirar e azul para procurar ajuda.',
  },
};
