import type { Story } from '../../types';

/** AULA 06 — A TORRE DE BABEL */
export const gn06Babel: Story = {
  id: 'gn-06-babel',
  seasonId: 'genesis',
  blocoId: 'gn-b1',
  order: 6,
  title: 'A Torre de Babel',
  reference: 'Gênesis 11:1–9',

  objetivo:
    'Ensinar que Deus deseja humildade e cuidado, não orgulho; pessoas diferentes podem cooperar sem tentar colocar o próprio nome acima de tudo.',
  personagens: ['Deus', 'povo de Babel'],
  licao: 'Quando cooperamos com humildade, lembramos que nossa força e nosso nome não estão acima de Deus.',
  fraseMemoravel: 'Eu posso cooperar com humildade e ouvir Deus.',
  oracao:
    'Deus, ensine-nos a trabalhar juntos sem orgulho. Ajude-nos a ouvir, respeitar as diferenças e lembrar que o Senhor é maior do que qualquer projeto humano. Amém.',
  valor: 'obediencia',
  valoresSecundarios: ['generosidade'],

  summary: 'O povo de Babel construiu uma torre para ser famoso, mas Deus ensinou que orgulho não deve comandar a união.',
  cover: { sky: 'dia', ground: 'campo', motifs: ['tower', 'mountain', 'star'] },

  chapters: [
    {
      id: 'gn-06-c1',
      title: 'Uma só língua',
      scene: { sky: 'dia', ground: 'campo', motifs: ['tent', 'footprints', 'tower'] },
      pages: {
        '5-7': [
          'Depois de muitos anos, as pessoas viajaram e chegaram a uma planície chamada Sinar. Todos falavam a mesma língua. Era fácil conversar e combinar trabalhos.',
          'O povo decidiu morar ali. Eles tinham barro, pedras e muito trabalho pela frente. Juntos, podiam fazer muitas coisas. Mas começaram a pensar mais em seu próprio nome do que em Deus.',
        ],
        '8-10': [
          'Depois de viajarem, as pessoas encontraram uma planície chamada Sinar e decidiram morar ali. Naquele tempo, todos falavam a mesma língua, por isso conseguiam entender as ideias uns dos outros e organizar um trabalho em conjunto. Podiam combinar horários, ensinar habilidades e resolver problemas sem precisar de tradução. Essa facilidade trouxe alegria e também uma grande responsabilidade para suas escolhas.',
          'Eles aprenderam a fazer tijolos com barro e encontraram um material para unir as peças. A habilidade de cooperar era um presente, mas o projeto começou a mudar de direção. Em vez de agradecer a Deus e cuidar uns dos outros, o povo passou a desejar que todos admirassem seu próprio nome.',
        ],
      },
    },
    {
      id: 'gn-06-c2',
      title: 'Uma torre para aparecer',
      scene: { sky: 'entardecer', ground: 'campo', motifs: ['tower', 'mountain', 'star'] },
      pages: {
        '5-7': [
          'O povo disse: — Vamos construir uma cidade e uma torre bem alta. Queremos ficar famosos! Eles trabalharam juntos, colocando uma pedra sobre a outra.',
          'Construir não era o problema. O problema era o orgulho. Eles queriam fazer um nome para si e acharam que poderiam controlar tudo sozinhos. Esqueceram que Deus é maior.',
        ],
        '8-10': [
          'O povo decidiu construir uma cidade e uma torre que chegasse até o céu. Eles queriam criar um grande sinal do próprio poder e disseram que fariam um nome para si. O trabalho avançou porque muitas mãos cooperavam, mas o motivo estava cheio de orgulho.',
          'A Bíblia não ensina que construir ou trabalhar em equipe seja errado. O problema era acreditar que o projeto tornaria aquelas pessoas independentes de Deus e impediria qualquer mudança. Quando a vontade de ser admirado ocupa o centro, até uma boa habilidade pode ser usada para um objetivo egoísta.',
        ],
      },
    },
    {
      id: 'gn-06-c3',
      title: 'Que voz vai guiar?',
      scene: { sky: 'dia', ground: 'campo', motifs: ['tower', 'scroll', 'footprints'] },
      pages: {
        '5-7': [
          'Também podemos escolher como participar de um grupo. Podemos ouvir, dividir tarefas e ajudar. Ou podemos querer mandar em tudo e receber todos os elogios.',
          'Deus quer que usemos nossas habilidades com humildade. Antes de começar, podemos perguntar: isso ajuda as pessoas? Estou ouvindo a orientação de Deus?',
        ],
        '8-10': [
          'Em um grupo, cada pessoa pode contribuir de um jeito. Uma criança pode organizar, outra pode desenhar e outra pode perceber quem precisa de ajuda. Cooperar não significa que uma pessoa precisa mandar em todas as outras ou ficar com todo o crédito.',
          'Antes de entrar em um projeto, podemos fazer perguntas importantes: este trabalho ajuda alguém? Estou ouvindo e respeitando as outras pessoas? Estou tentando servir ou apenas aparecer? Humildade não diminui nossos talentos; ela coloca os talentos no lugar certo, debaixo da orientação de Deus.',
        ],
      },
      choice: {
        question: 'Como participar de um trabalho em grupo com humildade?',
        options: [
          {
            text: 'Ouvir, dividir tarefas e celebrar a equipe',
            correct: true,
            feedback: 'Isso! A equipe fica mais forte quando todos escutam, cooperam e compartilham o reconhecimento.',
          },
          {
            text: 'Fazer tudo sozinho para receber o crédito',
            correct: false,
            feedback: 'Querer todo o crédito alimenta o orgulho. Dividir tarefas e reconhecer a equipe é um caminho melhor.',
          },
        ],
      },
    },
    {
      id: 'gn-06-c4',
      title: 'Muitas línguas, muitos lugares',
      scene: { sky: 'entardecer', ground: 'campo', motifs: ['tower', 'footprints', 'tent'] },
      pages: {
        '5-7': [
          'Deus confundiu a língua do povo. De repente, as pessoas não entendiam todas as palavras umas das outras. A construção parou, e a cidade ficou conhecida como Babel.',
          'As famílias foram para lugares diferentes. Deus continuou cuidando delas. A história ensina a ouvir Deus, respeitar diferenças e não deixar o orgulho mandar.',
        ],
        '8-10': [
          'Deus confundiu as línguas do povo, e as pessoas já não conseguiam entender umas às outras do mesmo jeito. O projeto parou, e a cidade recebeu o nome de Babel. A confusão mostrou que aquela união baseada no orgulho não era tão forte quanto eles imaginavam.',
          'As famílias se espalharam por diferentes lugares e passaram a falar línguas diversas. Deus não perdeu o controle nem deixou de cuidar da humanidade. A história nos convida a usar a cooperação para servir, ouvir pessoas diferentes e lembrar que nenhum nome humano é maior do que o nome de Deus.',
        ],
      },
    },
  ],

  quiz: [
    {
      id: 'gn-06-q1',
      question: 'Onde o povo chegou e decidiu morar?',
      options: ['Na planície de Sinar', 'No jardim do Éden', 'Dentro de uma arca', 'Num deserto de areia'],
      optionIcons: ['tower', 'garden', 'ark', 'tent'],
      correctIndex: 0,
      explanation: 'O povo chegou à planície de Sinar e ali decidiu morar e construir.',
    },
    {
      id: 'gn-06-q2',
      question: 'O que o povo começou a construir?',
      options: ['Uma cidade e uma torre', 'Uma arca e um altar', 'Um barco e um jardim', 'Uma tenda e um poço'],
      optionIcons: ['tower', 'ark', 'boat', 'tent'],
      correctIndex: 0,
      explanation: 'Eles construíram uma cidade e uma torre muito alta.',
    },
    {
      id: 'gn-06-q3',
      question: 'Como todos conseguiam conversar no começo?',
      options: ['Falavam a mesma língua', 'Usavam desenhos', 'Tinham um tradutor', 'Só faziam sinais'],
      correctIndex: 0,
      explanation: 'No começo da história, todas as pessoas falavam a mesma língua.',
    },
    {
      id: 'gn-06-q4',
      question: 'Qual era o problema no plano da torre?',
      options: ['O orgulho de querer um grande nome', 'O barro ser colorido', 'A cidade ser pequena', 'Faltar animais'],
      correctIndex: 0,
      explanation: 'Construir não era o problema; o povo queria usar o projeto para ficar famoso e viver como se não precisasse de Deus.',
    },
    {
      id: 'gn-06-q5',
      question: 'O que aconteceu quando Deus confundiu as línguas?',
      options: ['O trabalho parou', 'A torre virou uma arca', 'Todos viraram reis', 'A chuva começou'],
      correctIndex: 0,
      explanation: 'Sem se entenderem, as pessoas não conseguiram continuar a construção.',
    },
    {
      id: 'gn-06-q6',
      question: 'Como podemos trabalhar em equipe hoje?',
      options: ['Ouvindo, dividindo tarefas e ajudando', 'Mandando em todos', 'Ficando com todo o crédito', 'Ignorando diferenças'],
      correctIndex: 0,
      explanation: 'Cooperar com humildade é ouvir, dividir tarefas e reconhecer a contribuição de cada pessoa.',
    },
    {
      id: 'gn-06-q7',
      question: 'Complete: "Por isso a cidade foi chamada ___."',
      options: ['Babel', 'Éden', 'Sinar', 'Arca'],
      correctIndex: 0,
      explanation: 'A cidade foi chamada Babel porque ali Deus confundiu a língua do povo — Gênesis 11:9.',
    },
    {
      id: 'gn-06-q8',
      question: 'Seu grupo terminou um trabalho. O que demonstra humildade?',
      options: ['Agradecer a equipe e dividir o reconhecimento', 'Dizer que fez tudo sozinho', 'Esconder o trabalho dos colegas', 'Rir da ideia de alguém'],
      correctIndex: 0,
      explanation: 'Agradecer a equipe e dividir o reconhecimento mostra que cada pessoa contribuiu.',
    },
  ],

  verseId: 'v-gn-06',

  wordBank: ['BABEL', 'TORRE', 'SINAR', 'TIJOLO', 'LINGUA', 'EQUIPE', 'OUVIR', 'HUMILDE'],
  memoryPairs: [
    { icon: 'tower', label: 'Torre' },
    { icon: 'mountain', label: 'Altura' },
    { icon: 'scroll', label: 'Palavra' },
    { icon: 'footprints', label: 'Caminho' },
    { icon: 'tent', label: 'Família' },
    { icon: 'star', label: 'Céu' },
  ],
  orderSteps: [
    'O povo chega à planície de Sinar',
    'As pessoas fazem tijolos e começam a construir',
    'O povo quer ficar famoso com uma torre',
    'Deus confunde a língua das pessoas',
    'As famílias se espalham por muitos lugares',
  ],

  perguntasConversa: [
    'Como você se sente quando alguém recebe todo o crédito?',
    'Que talento seu pode ajudar uma equipe?',
    'Como ouvir alguém diferente de você demonstra respeito?',
    'Por que humildade é melhor do que querer aparecer?',
  ],
  salaDeAula: {
    quebraGelo: 'Construir uma torre de blocos em equipe, com cada criança colocando apenas uma peça por vez.',
    dinamica:
      'A turma faz um desafio sem fala e depois conversa sobre como ouvir, observar e dividir tarefas ajuda a cooperar.',
    atividade: 'Criar um mural com muitas casas e línguas, escrevendo em cada uma uma maneira de respeitar diferenças.',
  },
};
