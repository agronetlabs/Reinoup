import type { Story } from '../../types';

/** AULA 05 — NOÉ E A ARCA */
export const gn05Noe: Story = {
  id: 'gn-05-noe',
  seasonId: 'genesis',
  blocoId: 'gn-b1',
  order: 5,
  title: 'Noé e a Arca',
  reference: 'Gênesis 6–9',

  objetivo:
    'Ensinar que Noé confiou na orientação de Deus e perseverou, mostrando que obedecer pode exigir paciência antes de vermos o resultado.',
  personagens: ['Deus', 'Noé', 'família de Noé', 'animais'],
  licao: 'Posso obedecer a Deus com confiança, mesmo quando ainda não entendo tudo.',
  fraseMemoravel: 'Eu posso obedecer a Deus, um passo de cada vez.',
  oracao:
    'Deus, dê-me confiança para obedecer e paciência para continuar quando uma tarefa parecer grande. Obrigado porque o Senhor cuida de nós. Amém.',
  valor: 'obediencia',
  valoresSecundarios: ['confianca', 'promessa'],

  summary: 'Noé ouviu Deus, construiu a arca e protegeu sua família e os animais durante o grande dilúvio.',
  cover: { sky: 'tempestade', ground: 'agua', motifs: ['ark', 'rain', 'dove'] },

  chapters: [
    {
      id: 'gn-05-c1',
      title: 'Noé ouve a Deus',
      scene: { sky: 'dia', ground: 'campo', motifs: ['ark', 'tent', 'seed'] },
      pages: {
        '5-7': [
          'Muita gente tinha esquecido de fazer o bem. Mas Noé amava a Deus e queria andar no caminho certo. Deus viu o coração de Noé e falou com ele.',
          'Deus avisou que viria uma grande chuva. Mandou Noé construir uma arca, um barco enorme. Noé escutou. A tarefa parecia grande, mas ele começou.',
        ],
        '8-10': [
          'Naquele tempo, muitas pessoas escolheram caminhos violentos e esqueceram o cuidado de Deus. Noé, porém, confiava no Senhor e procurava viver com integridade. Deus viu a situação da terra e falou com Noé sobre um plano de proteção para sua família.',
          'Deus avisou que uma grande chuva viria e deu instruções para construir uma arca enorme. Não era uma tarefa pequena, nem algo que Noé pudesse terminar depressa. Ele não recebeu todos os detalhes sobre o futuro, mas recebeu uma orientação clara: começar a construir e preparar um lugar seguro.',
        ],
      },
    },
    {
      id: 'gn-05-c2',
      title: 'Uma arca muito grande',
      scene: { sky: 'entardecer', ground: 'campo', motifs: ['ark', 'staff', 'seed'] },
      pages: {
        '5-7': [
          'Noé trabalhou com sua família. Cortou madeira, juntou peças e fez a arca do jeito que Deus ensinou. Todos os dias havia mais uma parte para fazer.',
          'Talvez algumas pessoas rissem de Noé. Mesmo assim, ele continuou. Obedecer é fazer o que é certo também quando ninguém entende ou aplaude.',
        ],
        '8-10': [
          'Noé e sua família trabalharam juntos. Eles prepararam a madeira, organizaram os espaços e fizeram a arca conforme as medidas dadas por Deus. Cada parte precisava ficar pronta antes da próxima, por isso a obra exigia atenção, cooperação e muita perseverança.',
          'Talvez os vizinhos achassem estranho construir um barco tão grande longe de um rio. Noé poderia ter parado para evitar perguntas, mas preferiu continuar fiel à orientação que recebera. Obedecer nem sempre traz aplausos imediatos; às vezes significa continuar fazendo o certo enquanto esperamos entender o que virá.',
        ],
      },
    },
    {
      id: 'gn-05-c3',
      title: 'Entrar e confiar',
      scene: { sky: 'tempestade', ground: 'campo', motifs: ['ark', 'sheep', 'dove'] },
      pages: {
        '5-7': [
          'Quando a arca ficou pronta, Deus chamou Noé, sua família e muitos animais. Eles entraram de dois em dois. Noé não sabia tudo o que aconteceria, mas confiou na palavra de Deus.',
          'Confiar não é fingir que não existe medo. É ouvir uma orientação segura e dar o próximo passo. Noé entrou na arca e ajudou os animais a encontrar seu lugar.',
        ],
        '8-10': [
          'Quando a arca terminou, Deus orientou Noé a entrar com sua família e a levar animais de muitas espécies. Eles chegaram aos poucos, em pares, e cada um encontrou um espaço dentro da embarcação. Noé não controlava o tempo da chuva, mas podia obedecer à instrução que tinha recebido.',
          'Confiar não significa que o medo desaparece ou que conhecemos todos os detalhes. Significa reconhecer uma orientação segura e dar o próximo passo. Noé entrou na arca, cuidou dos animais e esperou. A obediência dele incluía ação, paciência e atenção ao que Deus dizia.',
        ],
      },
      choice: {
        question: 'Quando uma tarefa segura parece grande, qual atitude combina com a de Noé?',
        options: [
          {
            text: 'Ouvir a orientação e começar um passo de cada vez',
            correct: true,
            feedback: 'Isso! Uma tarefa grande fica possível quando ouvimos, pedimos ajuda e começamos pelo próximo passo.',
          },
          {
            text: 'Desistir só porque ninguém aplaudiu',
            correct: false,
            feedback: 'A falta de aplausos não decide o que é certo. Você pode pedir ajuda e continuar, um passo de cada vez.',
          },
        ],
      },
    },
    {
      id: 'gn-05-c4',
      title: 'A promessa no céu',
      scene: { sky: 'entardecer', ground: 'agua', motifs: ['ark', 'rainbow', 'dove'] },
      pages: {
        '5-7': [
          'Choveu por muitos dias, e a água cobriu a terra. A arca ficou sobre as águas. Dentro dela, Deus cuidou de Noé, da família e dos animais.',
          'Depois, a chuva parou. Noé saiu e agradeceu a Deus. Deus colocou um arco-íris no céu como sinal da sua promessa. A família começou uma vida nova.',
        ],
        '8-10': [
          'A chuva caiu durante muitos dias, e as águas subiram ao redor da arca. Noé, sua família e os animais permaneceram dentro dela, esperando. O tempo de espera foi longo, mas Deus não se esqueceu deles. A arca flutuou até que as águas começassem a baixar.',
          'Quando a terra ficou seca, Deus disse que era hora de sair. Noé construiu um altar e agradeceu. Então Deus colocou o arco-íris nas nuvens como sinal de sua promessa de cuidado com a criação. A família de Noé pôde começar de novo, levando consigo a lembrança de que Deus cumpre o que promete.',
        ],
      },
    },
  ],

  quiz: [
    {
      id: 'gn-05-q1',
      question: 'Quem recebeu de Deus a tarefa de construir a arca?',
      options: ['Noé', 'Caim', 'Enoque', 'Babel'],
      optionIcons: ['ark', 'grain', 'footprints', 'tower'],
      correctIndex: 0,
      explanation: 'Deus escolheu Noé para construir a arca e preparar um lugar seguro.',
    },
    {
      id: 'gn-05-q2',
      question: 'Quem entrou na arca com Noé?',
      options: ['Sua família e os animais', 'Somente os peixes', 'Apenas os vizinhos', 'Ninguém'],
      optionIcons: ['sheep', 'big-fish', 'tent', 'stone-pillow'],
      correctIndex: 0,
      explanation: 'Noé entrou com sua família, e animais de muitas espécies também foram protegidos na arca.',
    },
    {
      id: 'gn-05-q3',
      question: 'O que apareceu no céu como sinal da promessa de Deus?',
      options: ['Um arco-íris', 'Uma torre', 'Uma coroa', 'Uma estrela cadente'],
      optionIcons: ['rainbow', 'tower', 'crown', 'star'],
      correctIndex: 0,
      explanation: 'Deus colocou o arco-íris nas nuvens como sinal de sua promessa.',
    },
    {
      id: 'gn-05-q4',
      question: 'Por que Noé continuou construindo mesmo quando a tarefa era difícil?',
      options: ['Porque confiou na orientação de Deus', 'Porque queria aplausos', 'Porque não tinha família', 'Porque odiava a chuva'],
      correctIndex: 0,
      explanation: 'Noé continuou porque confiava em Deus e queria obedecer ao que Ele tinha ensinado.',
    },
    {
      id: 'gn-05-q5',
      question: 'O que podemos fazer quando uma tarefa parece grande?',
      options: ['Começar um passo de cada vez e pedir ajuda', 'Desistir imediatamente', 'Esconder a tarefa', 'Rir de quem trabalha'],
      correctIndex: 0,
      explanation: 'Podemos ouvir as instruções, pedir ajuda e fazer uma parte de cada vez.',
    },
    {
      id: 'gn-05-q6',
      question: 'O que Noé fez ao sair da arca?',
      options: ['Agradeceu a Deus', 'Construiu uma torre para aparecer', 'Esqueceu a família', 'Foi embora sem olhar'],
      correctIndex: 0,
      explanation: 'Noé construiu um altar e agradeceu a Deus pelo cuidado.',
    },
    {
      id: 'gn-05-q7',
      question: 'Complete: "Noé fez tudo exatamente como ___ havia ordenado."',
      options: ['Deus', 'Caim', 'o vizinho', 'o rei'],
      correctIndex: 0,
      explanation: 'Noé fez tudo como Deus havia ordenado — Gênesis 6:22.',
    },
    {
      id: 'gn-05-q8',
      question: 'Você recebeu uma tarefa segura e difícil. Qual atitude ajuda?',
      options: ['Ouvir, pedir ajuda e começar', 'Esconder a tarefa', 'Desistir sem tentar', 'Fazer de qualquer jeito'],
      correctIndex: 0,
      explanation: 'Ouvir com atenção, pedir ajuda e começar pelo próximo passo torna a tarefa possível.',
    },
  ],

  verseId: 'v-gn-05',

  wordBank: ['FAMILIA', 'ARCA', 'CHUVA', 'AGUA', 'ANIMAIS', 'POMBA', 'ARCOIRIS', 'PROMESSA'],
  memoryPairs: [
    { icon: 'ark', label: 'Arca' },
    { icon: 'rain', label: 'Chuva' },
    { icon: 'rainbow', label: 'Promessa' },
    { icon: 'dove', label: 'Pomba' },
    { icon: 'sheep', label: 'Animais' },
    { icon: 'seed', label: 'Vida nova' },
  ],
  orderSteps: [
    'Deus fala com Noé sobre a grande chuva',
    'Noé constrói a arca com sua família',
    'Noé entra na arca com a família e os animais',
    'A chuva cai e Deus cuida de quem está na arca',
    'Noé sai, agradece e recebe o sinal do arco-íris',
  ],

  perguntasConversa: [
    'Que tarefa fica mais fácil quando você pede ajuda?',
    'Como você se sente quando precisa esperar?',
    'O que significa obedecer mesmo sem ver o resultado?',
    'Qual promessa de cuidado você lembra ao olhar para um arco-íris?',
  ],
  salaDeAula: {
    quebraGelo: 'Construir uma arca imaginária com cadeiras e escolher juntos quem cuidaria de cada animal.',
    dinamica:
      'A turma recebe uma tarefa coletiva de montagem e pratica ouvir instruções, dividir funções e começar por etapas.',
    atividade: 'Fazer um arco-íris de papel com uma atitude de obediência escrita em cada cor.',
  },
};
