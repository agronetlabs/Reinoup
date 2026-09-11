import type { Story } from '../../types';

/** AULA 02 — ADÃO E EVA */
export const gn02AdaoEva: Story = {
  id: 'gn-02-adao-eva',
  seasonId: 'genesis',
  blocoId: 'gn-b1',
  order: 2,
  title: 'Adão e Eva',
  reference: 'Gênesis 3',

  objetivo:
    'Ensinar que Deus dá orientações para proteger seus filhos e que, mesmo quando erramos, podemos falar a verdade e voltar para Ele.',
  personagens: ['Deus', 'Adão', 'Eva', 'serpente'],
  licao: 'Obedecer a Deus é escolher o caminho do cuidado, mesmo quando outra voz promete algo mais fácil.',
  fraseMemoravel: 'Eu posso obedecer e falar com Deus quando erro.',
  oracao:
    'Deus, ajude-nos a ouvir a sua voz e a escolher o que é certo. Quando errarmos, dê-nos coragem para contar a verdade e voltar para perto do Senhor. Amém.',
  valor: 'obediencia',
  valoresSecundarios: ['presenca'],

  summary: 'Adão e Eva precisaram escolher entre ouvir a orientação de Deus e seguir uma voz enganosa.',
  cover: { sky: 'dia', ground: 'jardim', motifs: ['garden', 'fruit-tree', 'serpent'] },

  chapters: [
    {
      id: 'gn-02-c1',
      title: 'Um jardim para cuidar',
      scene: { sky: 'dia', ground: 'jardim', motifs: ['garden', 'tree-of-life', 'fruit-tree'] },
      pages: {
        '5-7': [
          'Deus colocou Adão e Eva num jardim lindo. Havia árvores, rios e muitos frutos. Eles podiam cuidar dos animais e conversar com Deus. Tudo era bom, seguro e cheio de vida.',
          'Deus deu uma orientação clara: — Vocês podem comer das árvores, menos de uma. Não comam desse fruto. Adão e Eva podiam escolher obedecer. Deus queria protegê-los, não tirar sua alegria.',
        ],
        '8-10': [
          'Deus colocou Adão e Eva no jardim do Éden. Ali havia água correndo, árvores cheias de frutos e espaço para todos os animais. Eles receberam um trabalho bonito: cuidar daquele lugar. Também podiam conversar com Deus e desfrutar de tudo o que Ele havia preparado.',
          'Havia apenas uma orientação: eles poderiam comer das árvores do jardim, mas não do fruto de uma árvore específica. Deus não estava sendo cruel nem escondendo uma coisa boa. Ele estava ensinando um limite que protegeria Adão e Eva. Amar também é dar instruções seguras.',
        ],
      },
    },
    {
      id: 'gn-02-c2',
      title: 'Uma voz que confundiu',
      scene: { sky: 'entardecer', ground: 'jardim', motifs: ['serpent', 'fruit-tree', 'star'] },
      pages: {
        '5-7': [
          'Um dia, a serpente falou com Eva. Ela perguntou se Deus tinha proibido todos os frutos. Eva explicou a orientação, mas a serpente fez a regra parecer ruim. Ela tentou colocar dúvida no coração de Eva.',
          'Eva olhou para o fruto proibido. Parecia bonito e gostoso. Ela pegou, comeu e deu um pedaço a Adão. Adão também comeu. Naquele momento, eles perceberam que tinham escolhido desobedecer.',
        ],
        '8-10': [
          'A serpente conversou com Eva e fez uma pergunta que parecia inocente: "Foi mesmo que Deus disse?" Depois, torceu a orientação do Senhor e prometeu que nada de ruim aconteceria. A dúvida começou quando Eva passou a ouvir aquela voz mais do que confiava na palavra de Deus.',
          'Eva viu que o fruto parecia bom e desejou aquilo que Deus havia pedido que ela não comesse. Ela pegou o fruto, comeu e ofereceu a Adão. Ele também comeu. De repente, os dois entenderam que tinham feito uma escolha contra a orientação recebida. O jardim continuava bonito, mas o coração deles ficou pesado.',
        ],
      },
    },
    {
      id: 'gn-02-c3',
      title: 'A escolha depois do erro',
      scene: { sky: 'entardecer', ground: 'jardim', motifs: ['footprints', 'tree-of-life', 'serpent'] },
      pages: {
        '5-7': [
          'Adão e Eva ouviram Deus chegando e ficaram com medo. Eles tentaram se esconder entre as árvores. Deus chamou: — Onde vocês estão? Ele já sabia o que acontecera, mas queria que eles falassem com Ele.',
          'Quando fazemos algo errado, podemos esconder ou contar a verdade. Deus não quer que o medo mande em nós. Ele nos chama para perto, para aprendermos com a escolha e recebermos cuidado.',
        ],
        '8-10': [
          'Quando ouviram Deus caminhando pelo jardim, Adão e Eva sentiram vergonha e se esconderam. Deus chamou Adão e perguntou onde ele estava. Não era uma pergunta para descobrir o lugar; era um convite para que Adão saísse do esconderijo e conversasse com Ele.',
          'Depois de errar, a primeira escolha ainda importa. Podemos inventar desculpas e continuar escondidos, ou podemos ser honestos e pedir ajuda. Contar a verdade não apaga a consequência, mas abre espaço para o cuidado, o aprendizado e uma nova atitude diante de Deus.',
        ],
      },
      choice: {
        question: 'Depois de fazer uma escolha errada, qual caminho ajuda a recomeçar?',
        options: [
          {
            text: 'Contar a verdade e pedir ajuda',
            correct: true,
            feedback: 'Isso! A verdade nos tira do esconderijo e permite que Deus e os adultos seguros nos ajudem a recomeçar.',
          },
          {
            text: 'Esconder tudo e culpar outra pessoa',
            correct: false,
            feedback: 'Quando escondemos o erro, o medo cresce. Falar a verdade ajuda a aprender e a escolher melhor da próxima vez.',
          },
        ],
      },
    },
    {
      id: 'gn-02-c4',
      title: 'Deus continua cuidando',
      scene: { sky: 'dia', ground: 'jardim', motifs: ['garden', 'seed', 'footprints'] },
      pages: {
        '5-7': [
          'Deus explicou que a escolha teria consequências. Adão e Eva precisariam sair do jardim e trabalhar de outro jeito. O mundo ficaria mais difícil, mas Deus não deixou de cuidar deles.',
          'Essa história ensina que obedecer protege. Também ensina que, quando erramos, Deus nos encontra. Podemos falar a verdade, aprender e escolher um caminho novo com Ele.',
        ],
        '8-10': [
          'Deus contou a Adão e Eva que a desobediência traria consequências. Eles não continuariam vivendo no jardim do mesmo modo. A vida fora dali teria trabalho e dificuldades, porque as escolhas deles mudaram sua história. Mesmo assim, Deus não os abandonou nem deixou de vê-los.',
          'A história não termina apenas com uma porta fechada. Deus continuou cuidando de Adão e Eva, e nós também podemos aprender com eles. Obedecer é confiar no cuidado de Deus. Quando falhamos, a resposta não é fugir para sempre: é reconhecer o erro, buscar ajuda e caminhar de novo com Ele.',
        ],
      },
    },
  ],

  quiz: [
    {
      id: 'gn-02-q1',
      question: 'Onde Adão e Eva moravam?',
      options: ['No jardim do Éden', 'Num barco', 'Numa torre', 'Numa caverna'],
      optionIcons: ['garden', 'boat', 'tower', 'mountain'],
      correctIndex: 0,
      explanation: 'Deus colocou Adão e Eva no jardim do Éden, um lugar cheio de árvores, animais e vida.',
    },
    {
      id: 'gn-02-q2',
      question: 'O que Deus pediu que eles não comessem?',
      options: ['O fruto de uma árvore', 'Todo o pão', 'A água do rio', 'A comida dos animais'],
      optionIcons: ['fruit-tree', 'grain', 'storm-waves', 'sheep'],
      correctIndex: 0,
      explanation: 'Deus permitiu os frutos do jardim, mas pediu que não comessem da árvore escolhida.',
    },
    {
      id: 'gn-02-q3',
      question: 'Quem fez Eva duvidar da orientação de Deus?',
      options: ['A serpente', 'Um leão', 'Adão', 'Um anjo'],
      optionIcons: ['serpent', 'lion', 'shepherd-boy', 'angel'],
      correctIndex: 0,
      explanation: 'A serpente torceu a orientação de Deus e tentou colocar dúvida no coração de Eva.',
    },
    {
      id: 'gn-02-q4',
      question: 'Por que Adão e Eva se esconderam?',
      options: ['Sentiram medo e vergonha', 'Queriam brincar', 'Procuravam comida', 'Estavam dormindo'],
      correctIndex: 0,
      explanation: 'Depois de desobedecer, Adão e Eva sentiram medo e vergonha, por isso tentaram se esconder de Deus.',
    },
    {
      id: 'gn-02-q5',
      question: 'O que Deus fez quando chamou Adão?',
      options: ['Convidou-o a conversar', 'Foi embora sem dizer nada', 'Destruiu o jardim', 'Deu outro fruto'],
      correctIndex: 0,
      explanation: 'Deus chamou Adão para que ele saísse do esconderijo e conversasse com Ele.',
    },
    {
      id: 'gn-02-q6',
      question: 'O que podemos fazer depois de errar?',
      options: ['Contar a verdade e pedir ajuda', 'Culpar alguém', 'Esconder para sempre', 'Fingir que nada aconteceu'],
      correctIndex: 0,
      explanation: 'Falar a verdade não apaga a consequência, mas ajuda a aprender, receber cuidado e recomeçar.',
    },
    {
      id: 'gn-02-q7',
      question: 'Complete: "Onde ___?"',
      options: ['você está', 'fica o rio', 'está a serpente', 'estão os animais'],
      correctIndex: 0,
      explanation: 'Deus chamou Adão perguntando: "Onde você está?" — Gênesis 3:9.',
    },
    {
      id: 'gn-02-q8',
      question: 'Um amigo fez algo errado e está com medo. O que você pode fazer?',
      options: ['Ajudá-lo a contar a verdade a um adulto seguro', 'Mandar esconder', 'Rir dele', 'Culpar outra criança'],
      correctIndex: 0,
      explanation: 'Um adulto seguro pode ajudar a resolver a situação. Coragem e verdade são melhores que esconder e culpar.',
    },
  ],

  verseId: 'v-gn-02',

  wordBank: ['JARDIM', 'FRUTO', 'MULHER', 'ADAO', 'SERPENTE', 'ESCUTA', 'VERDADE', 'MEDO'],
  memoryPairs: [
    { icon: 'garden', label: 'Jardim' },
    { icon: 'fruit-tree', label: 'Fruto' },
    { icon: 'serpent', label: 'Serpente' },
    { icon: 'tree-of-life', label: 'Árvore' },
    { icon: 'footprints', label: 'Caminho' },
    { icon: 'seed', label: 'Semente' },
  ],
  orderSteps: [
    'Deus coloca Adão e Eva no jardim',
    'Deus dá uma orientação sobre o fruto',
    'A serpente faz Eva duvidar',
    'Adão e Eva comem o fruto e se escondem',
    'Deus os encontra e continua cuidando deles',
  ],

  perguntasConversa: [
    'Que orientação ajuda você a ficar seguro?',
    'Como você se sente quando precisa admitir um erro?',
    'Quem é um adulto seguro com quem você pode conversar?',
    'Como obedecer pode ser uma forma de confiar em Deus?',
  ],
  salaDeAula: {
    quebraGelo: 'Cada criança diz uma regra que ajuda a turma a cuidar uns dos outros.',
    dinamica:
      'O professor apresenta situações simples e as crianças levantam um cartão de ouvido para "escutar" ou de coração para "pedir ajuda".',
    atividade: 'Montar uma árvore de papel com folhas onde cada criança escreve uma escolha segura e obediente.',
  },
};
