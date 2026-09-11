import type { Story } from '../../types';

/** AULA 04 — ENOQUE ANDOU COM DEUS */
export const gn04Enoque: Story = {
  id: 'gn-04-enoque',
  seasonId: 'genesis',
  blocoId: 'gn-b1',
  order: 4,
  title: 'Enoque andou com Deus',
  reference: 'Gênesis 5:21–24',

  objetivo:
    'Mostrar que a presença de Deus acompanha a criança todos os dias e que andar com Ele aparece em escolhas simples de confiança, bondade e verdade.',
  personagens: ['Deus', 'Enoque', 'Matusalém'],
  licao: 'Andar com Deus é viver perto dele todos os dias, nas grandes e nas pequenas escolhas.',
  fraseMemoravel: 'Eu posso andar com Deus hoje.',
  oracao:
    'Deus, obrigado porque o Senhor está perto. Ajude-me a andar com o Senhor quando brinco, estudo, converso e escolho fazer o bem. Amém.',
  valor: 'presenca',
  valoresSecundarios: ['obediencia'],

  summary: 'Enoque viveu perto de Deus, confiando nele todos os dias, até que Deus o levou para junto de si.',
  cover: { sky: 'dia', ground: 'campo', motifs: ['footprints', 'star', 'seed'] },

  chapters: [
    {
      id: 'gn-04-c1',
      title: 'Uma vida comum',
      scene: { sky: 'dia', ground: 'campo', motifs: ['seed', 'sheep', 'tent'] },
      pages: {
        '5-7': [
          'Enoque viveu há muito tempo. Ele tinha família, trabalho e tarefas de cada dia. A vida dele parecia comum, como a nossa vida em casa e na escola.',
          'Enoque teve um filho chamado Matusalém. Enquanto cuidava da família, Enoque aprendeu a prestar atenção em Deus. Ele não precisava esperar um dia perfeito para estar perto do Senhor.',
        ],
        '8-10': [
          'Enoque viveu numa época muito antiga e tinha uma rotina de verdade: família, trabalho, decisões e responsabilidades. A Bíblia não conta que ele morava num palácio ou fazia coisas famosas. Ela apresenta alguém que aprendeu a viver com Deus no meio da vida comum.',
          'Quando seu filho Matusalém nasceu, Enoque continuou cuidando da família e realizando suas tarefas. A presença de Deus não era uma visita rápida em um dia especial. Era uma companhia que dava sentido às escolhas de todos os dias. Ele podia confiar nele em todos os momentos.',
        ],
      },
    },
    {
      id: 'gn-04-c2',
      title: 'Andar perto de Deus',
      scene: { sky: 'entardecer', ground: 'campo', motifs: ['footprints', 'star', 'angel'] },
      pages: {
        '5-7': [
          'A Bíblia diz que Enoque andou com Deus. Isso não quer dizer que ele caminhava sozinho por uma estrada o tempo todo. Quer dizer que confiava em Deus e queria viver do jeito que Deus ensinava.',
          'Enoque podia conversar com Deus, agradecer e pedir direção. Cada escolha certa era como um passo. Passo a passo, ele ficava perto do Senhor.',
        ],
        '8-10': [
          'A Bíblia resume a vida de Enoque com uma frase especial: ele andou com Deus. Isso significa que Enoque confiava no Senhor, conversava com Ele e desejava que suas atitudes combinassem com aquilo que Deus ensinava. Não era uma caminhada apenas com os pés, mas com o coração.',
          'Andar com Deus inclui momentos grandes e pequenos. É agradecer por uma coisa boa, falar a verdade quando seria mais fácil esconder, pedir perdão e tratar alguém com cuidado. Nenhum desses passos parece uma aventura para uma multidão, mas todos mostram em que direção o coração está andando.',
        ],
      },
    },
    {
      id: 'gn-04-c3',
      title: 'Um passo de cada vez',
      scene: { sky: 'dia', ground: 'campo', motifs: ['footprints', 'seed', 'sheep'] },
      pages: {
        '5-7': [
          'Você pode andar com Deus hoje. Pode conversar com Ele ao acordar. Pode escolher a verdade numa brincadeira. Pode ajudar alguém sem esperar aplausos.',
          'Não é preciso fazer tudo perfeito. Quando você erra, pode pedir perdão e tentar de novo. Deus continua perto, ensinando cada passo.',
        ],
        '8-10': [
          'Você também pode andar com Deus hoje. Pode falar com Ele antes de começar o dia, agradecer durante uma refeição ou pedir ajuda quando uma decisão parecer difícil. Pode escolher a verdade em uma brincadeira, dividir espaço e procurar quem ficou sozinho.',
          'Andar com Deus não significa nunca errar. Significa não fugir dele quando o erro acontece. Podemos reconhecer o que fizemos, pedir perdão a Deus e às pessoas envolvidas, e tentar uma atitude diferente. A presença de Deus transforma cada recomeço em mais um passo.',
        ],
      },
      choice: {
        question: 'Qual atitude parece um passo de quem anda com Deus?',
        options: [
          {
            text: 'Falar a verdade e tratar os outros com cuidado',
            correct: true,
            feedback: 'Muito bem! Verdade e cuidado mostram que você quer caminhar na direção que Deus ensina.',
          },
          {
            text: 'Fazer qualquer coisa para receber aplausos',
            correct: false,
            feedback: 'Aplausos não são o objetivo. Andar com Deus é escolher o bem, mesmo quando ninguém está olhando.',
          },
        ],
      },
    },
    {
      id: 'gn-04-c4',
      title: 'Deus o levou',
      scene: { sky: 'entardecer', ground: 'campo', motifs: ['angel', 'star', 'footprints'] },
      pages: {
        '5-7': [
          'Enoque andou com Deus por muitos anos. Um dia, Deus o levou para estar com Ele. Enoque não terminou sua história longe de Deus: terminou bem perto.',
          'A vida de Enoque nos lembra que Deus está presente. Cada passo de confiança importa. Podemos andar com Deus hoje, amanhã e em todos os dias.',
        ],
        '8-10': [
          'Enoque andou com Deus por muitos anos. Então aconteceu algo diferente: Deus o levou para junto de si, e Enoque não foi mais encontrado entre as pessoas. A Bíblia conta esse momento com poucas palavras, mas a mensagem é clara: a vida de Enoque foi marcada pela proximidade com Deus até o fim.',
          'Nós ainda temos muitos dias para viver, aprender e crescer. A história de Enoque não manda procurar algo extraordinário para provar a fé. Ela nos convida a perceber a presença de Deus na rotina e a dar um passo de confiança, bondade e verdade de cada vez.',
        ],
      },
    },
  ],

  quiz: [
    {
      id: 'gn-04-q1',
      question: 'Como a Bíblia descreve Enoque?',
      options: ['Ele andou com Deus', 'Ele construiu uma torre', 'Ele cuidou de um leão', 'Ele foi rei'],
      optionIcons: ['footprints', 'tower', 'lion', 'crown'],
      correctIndex: 0,
      explanation: 'A frase especial da história é que Enoque andou com Deus.',
    },
    {
      id: 'gn-04-q2',
      question: 'Qual era o nome do filho de Enoque?',
      options: ['Matusalém', 'Abel', 'Noé', 'Caim'],
      correctIndex: 0,
      explanation: 'A Bíblia conta que Enoque teve um filho chamado Matusalém.',
    },
    {
      id: 'gn-04-q3',
      question: 'O que aconteceu com Enoque?',
      options: ['Deus o levou para junto de si', 'Ele se perdeu no mar', 'Ele entrou numa torre', 'Ele fugiu para o deserto'],
      optionIcons: ['angel', 'boat', 'tower', 'tent'],
      correctIndex: 0,
      explanation: 'Depois de andar com Deus, Enoque foi levado por Deus e não foi mais encontrado entre as pessoas.',
    },
    {
      id: 'gn-04-q4',
      question: 'O que significa andar com Deus?',
      options: ['Confiar nele e viver do jeito que ensina', 'Nunca sair de casa', 'Caminhar sem parar', 'Ser famoso'],
      correctIndex: 0,
      explanation: 'Andar com Deus é confiar nele e deixar que suas escolhas mostrem essa confiança.',
    },
    {
      id: 'gn-04-q5',
      question: 'Onde podemos conversar com Deus?',
      options: ['Em qualquer lugar', 'Somente num palácio', 'Apenas numa montanha', 'Somente à noite'],
      correctIndex: 0,
      explanation: 'Podemos conversar com Deus em qualquer lugar: em casa, na escola, brincando ou descansando.',
    },
    {
      id: 'gn-04-q6',
      question: 'O que fazer quando erramos enquanto andamos com Deus?',
      options: ['Reconhecer, pedir perdão e tentar de novo', 'Esconder para sempre', 'Desistir de Deus', 'Culpar um amigo'],
      correctIndex: 0,
      explanation: 'Deus continua perto quando erramos. Podemos reconhecer, pedir perdão e escolher um novo passo.',
    },
    {
      id: 'gn-04-q7',
      question: 'Complete: "Enoque andou com ___."',
      options: ['Deus', 'Caim', 'o rei', 'a serpente'],
      correctIndex: 0,
      explanation: 'A Bíblia diz: "Enoque andou com Deus; então Deus o levou" — Gênesis 5:24.',
    },
    {
      id: 'gn-04-q8',
      question: 'Qual pode ser um passo de quem anda com Deus na escola?',
      options: ['Falar a verdade e incluir alguém', 'Rir de quem está sozinho', 'Esconder o material de alguém', 'Colar na atividade'],
      correctIndex: 0,
      explanation: 'Falar a verdade e cuidar de quem está sozinho são escolhas que mostram a presença de Deus na rotina.',
    },
  ],

  verseId: 'v-gn-04',

  wordBank: ['ENOQUE', 'DEUS', 'PASSOS', 'FAMILIA', 'VERDADE', 'CUIDAR', 'PRESENCA', 'ORACAO'],
  memoryPairs: [
    { icon: 'footprints', label: 'Passos' },
    { icon: 'star', label: 'Presença' },
    { icon: 'seed', label: 'Semente' },
    { icon: 'sheep', label: 'Cuidado' },
    { icon: 'angel', label: 'Perto' },
    { icon: 'tent', label: 'Família' },
  ],
  orderSteps: [
    'Enoque vive uma rotina com sua família',
    'Enoque aprende a confiar em Deus',
    'Enoque anda com Deus em cada escolha',
    'Enoque continua perto de Deus por muitos anos',
    'Deus leva Enoque para junto de si',
  ],

  perguntasConversa: [
    'Em que momento do dia você gosta de conversar com Deus?',
    'Que escolha pequena pode ser um passo de confiança?',
    'Como você percebe que Deus está perto?',
    'O que você pode fazer quando errar?',
  ],
  salaDeAula: {
    quebraGelo: 'Fazer uma trilha de pegadas de papel até a roda e cada criança dizer uma atitude de cuidado.',
    dinamica:
      'A turma percorre uma sequência de passos: agradecer, ouvir, dizer a verdade, ajudar e pedir perdão, repetindo que Deus está perto.',
    atividade: 'Montar um caminho de pegadas para casa, com uma escolha de bondade escrita em cada uma.',
  },
};
