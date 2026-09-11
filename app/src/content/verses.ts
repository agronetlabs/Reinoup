import type { Verse } from './types';

/**
 * Simplified, kid-friendly paraphrases (not verbatim translation text), grouped by
 * category so the "Versículos sobre amor" collection mission has a full 10-verse set.
 */
export const VERSES: Verse[] = [
  // ---- amor (10) ----
  {
    id: 'v-amor-1',
    reference: 'João 3:16',
    category: 'amor',
    text: {
      '5-7': 'Deus ama tanto o mundo que deu o seu Filho para todos nós.',
      '8-10': 'Deus amou o mundo de tal maneira que deu o seu Filho, para que todo aquele que nele crê seja salvo.',
    },
  },
  {
    id: 'v-amor-2',
    reference: '1 Coríntios 13:4',
    category: 'amor',
    text: {
      '5-7': 'O amor é paciente e bondoso, não quer coisas só pra si.',
      '8-10': 'O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha.',
    },
  },
  {
    id: 'v-amor-3',
    reference: '1 João 4:19',
    category: 'amor',
    text: {
      '5-7': 'Nós amamos porque Deus nos amou primeiro.',
      '8-10': 'Nós amamos porque ele nos amou primeiro.',
    },
  },
  {
    id: 'v-amor-4',
    reference: 'João 13:34',
    category: 'amor',
    text: {
      '5-7': 'Jesus disse: amem uns aos outros, assim como eu amei vocês.',
      '8-10': 'Um novo mandamento vos dou: que vos ameis uns aos outros, assim como eu vos amei.',
    },
  },
  {
    id: 'v-amor-5',
    reference: 'Romanos 5:8',
    category: 'amor',
    text: {
      '5-7': 'Deus mostrou o amor dele por nós mesmo quando erramos.',
      '8-10': 'Deus demonstra seu amor por nós: quando ainda éramos pecadores, Cristo morreu por nós.',
    },
  },
  {
    id: 'v-amor-6',
    reference: 'Marcos 12:31',
    category: 'amor',
    text: {
      '5-7': 'Ame o seu próximo como você ama a si mesmo.',
      '8-10': 'Ame o seu próximo como a si mesmo. Não há mandamento maior do que estes.',
    },
  },
  {
    id: 'v-amor-7',
    reference: 'Provérbios 17:17',
    category: 'amor',
    text: {
      '5-7': 'Um amigo de verdade ama em todo tempo.',
      '8-10': 'Em todo tempo ama o amigo, e na angústia nasce o irmão.',
    },
  },
  {
    id: 'v-amor-8',
    reference: 'Colossenses 3:14',
    category: 'amor',
    text: {
      '5-7': 'O mais importante de tudo é amar, isso une todo o resto.',
      '8-10': 'Acima de tudo, revistam-se do amor, que é o elo perfeito.',
    },
  },
  {
    id: 'v-amor-9',
    reference: '1 João 4:7',
    category: 'amor',
    text: {
      '5-7': 'Amemos uns aos outros, porque o amor vem de Deus.',
      '8-10': 'Amados, amemo-nos uns aos outros, pois o amor procede de Deus.',
    },
  },
  {
    id: 'v-amor-10',
    reference: 'Efésios 4:32',
    category: 'amor',
    text: {
      '5-7': 'Seja bom com os outros e perdoe, assim como Deus perdoa você.',
      '8-10': 'Sejam bondosos e compassivos uns para com os outros, perdoando-se mutuamente, assim como Deus os perdoou em Cristo.',
    },
  },

  // ---- coragem (5) ----
  {
    id: 'v-coragem-1',
    reference: 'Filipenses 4:13',
    category: 'coragem',
    text: {
      '5-7': 'Eu posso tudo com a força que Deus me dá.',
      '8-10': 'Tudo posso naquele que me fortalece.',
    },
  },
  {
    id: 'v-coragem-2',
    reference: 'Josué 1:9',
    category: 'coragem',
    text: {
      '5-7': 'Seja forte e corajoso, Deus está com você.',
      '8-10': 'Seja forte e corajoso! Não se apavore, nem se desanime, pois o Senhor, o seu Deus, estará com você por onde você andar.',
    },
  },
  {
    id: 'v-coragem-3',
    reference: 'Isaías 41:10',
    category: 'coragem',
    text: {
      '5-7': 'Não tenha medo, Deus está com você e vai te ajudar.',
      '8-10': 'Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus; eu te fortaleço, e te ajudo.',
    },
  },
  {
    id: 'v-coragem-4',
    reference: 'Salmos 27:1',
    category: 'coragem',
    text: {
      '5-7': 'Deus é a minha luz, de quem eu vou ter medo?',
      '8-10': 'O Senhor é a minha luz e a minha salvação; a quem temerei?',
    },
  },
  {
    id: 'v-coragem-5',
    reference: '2 Timóteo 1:7',
    category: 'coragem',
    text: {
      '5-7': 'Deus não nos deu medo, mas força, amor e bom senso.',
      '8-10': 'Deus não nos deu espírito de covardia, mas de poder, de amor e de moderação.',
    },
  },

  // ---- fe (5) ----
  {
    id: 'v-fe-1',
    reference: 'Hebreus 11:1',
    category: 'confianca',
    text: {
      '5-7': 'Ter fé é confiar em Deus mesmo sem ver.',
      '8-10': 'A fé é a certeza daquilo que esperamos e a prova das coisas que não vemos.',
    },
  },
  {
    id: 'v-fe-2',
    reference: 'Provérbios 3:5',
    category: 'confianca',
    text: {
      '5-7': 'Confie em Deus de todo o coração.',
      '8-10': 'Confie no Senhor de todo o coração e não se apoie no seu próprio entendimento.',
    },
  },
  {
    id: 'v-fe-3',
    reference: 'Mateus 17:20',
    category: 'confianca',
    text: {
      '5-7': 'Com uma fezinha pequena como uma sementinha, tudo é possível.',
      '8-10': 'Se tiverem fé do tamanho de um grão de mostarda, vocês poderão dizer a este monte: vá daqui para lá, e ele irá.',
    },
  },
  {
    id: 'v-fe-4',
    reference: 'Salmos 46:1',
    category: 'confianca',
    text: {
      '5-7': 'Deus é o nosso refúgio e a nossa força.',
      '8-10': 'Deus é o nosso refúgio e a nossa fortaleza, socorro bem presente na angústia.',
    },
  },
  {
    id: 'v-fe-5',
    reference: 'Romanos 8:28',
    category: 'confianca',
    text: {
      '5-7': 'Deus faz tudo ajudar para o bem de quem o ama.',
      '8-10': 'Sabemos que Deus age em todas as coisas para o bem daqueles que o amam.',
    },
  },

  // ---- obediencia (5) ----
  {
    id: 'v-obed-1',
    reference: 'Efésios 6:1',
    category: 'obediencia',
    text: {
      '5-7': 'Filhos, obedeçam aos seus pais, isso é bom.',
      '8-10': 'Filhos, obedeçam a seus pais no Senhor, pois isso é justo.',
    },
  },
  {
    id: 'v-obed-2',
    reference: 'João 14:15',
    category: 'obediencia',
    text: {
      '5-7': 'Se você ama Jesus, vai fazer o que ele pede.',
      '8-10': 'Se vocês me amam, obedecerão aos meus mandamentos.',
    },
  },
  {
    id: 'v-obed-3',
    reference: '1 Samuel 15:22',
    category: 'obediencia',
    text: {
      '5-7': 'Obedecer a Deus é melhor do que dar presentes para ele.',
      '8-10': 'Obedecer é melhor do que sacrifício, e prestar atenção é melhor do que a gordura de carneiros.',
    },
  },
  {
    id: 'v-obed-4',
    reference: 'Tiago 1:22',
    category: 'obediencia',
    text: {
      '5-7': 'Não é só ouvir a Palavra, é fazer o que ela diz.',
      '8-10': 'Sejam praticantes da palavra, e não apenas ouvintes.',
    },
  },
  {
    id: 'v-obed-5',
    reference: 'Provérbios 1:8',
    category: 'obediencia',
    text: {
      '5-7': 'Escute os ensinamentos do seu pai e da sua mãe.',
      '8-10': 'Ouça, meu filho, a instrução de seu pai e não despreze o ensino de sua mãe.',
    },
  },

  // ---- gratidao (3) ----
  {
    id: 'v-grat-1',
    reference: 'Salmos 107:1',
    category: 'gratidao',
    text: {
      '5-7': 'Agradeça a Deus porque ele é bom.',
      '8-10': 'Deem graças ao Senhor, porque ele é bom; o seu amor dura para sempre.',
    },
  },
  {
    id: 'v-grat-2',
    reference: '1 Tessalonicenses 5:18',
    category: 'gratidao',
    text: {
      '5-7': 'Dê graças em tudo, isso é o que Deus quer.',
      '8-10': 'Deem graças em todas as circunstâncias, pois esta é a vontade de Deus para vocês.',
    },
  },
  {
    id: 'v-grat-3',
    reference: 'Salmos 118:24',
    category: 'gratidao',
    text: {
      '5-7': 'Este é o dia que Deus fez, vamos ser felizes nele!',
      '8-10': 'Este é o dia que o Senhor fez; alegremo-nos e regozijemo-nos nele.',
    },
  },

  // ---- perdao (2) ----
  {
    id: 'v-perdao-1',
    reference: 'Mateus 6:14',
    category: 'perdao',
    text: {
      '5-7': 'Se você perdoar os outros, Deus também vai te perdoar.',
      '8-10': 'Se perdoarem as pessoas que pecam contra vocês, o Pai celestial também os perdoará.',
    },
  },
  {
    id: 'v-perdao-2',
    reference: 'Colossenses 3:13',
    category: 'perdao',
    text: {
      '5-7': 'Seja paciente e perdoe, assim como Jesus perdoa você.',
      '8-10': 'Suportem-se uns aos outros e perdoem as queixas que tiverem uns contra os outros, como o Senhor os perdoou.',
    },
  },

  // ---- versículos das histórias (um por aula da temporada) ----
  {
    id: 'v-gn-01',
    reference: 'Gênesis 1:1',
    category: 'identidade',
    text: {
      '5-7': 'No começo, Deus criou o céu e a terra.',
      '8-10': 'No princípio, Deus criou os céus e a terra.',
    },
  },
  {
    id: 'v-gn-02',
    reference: 'Gênesis 3:9',
    category: 'obediencia',
    text: {
      '5-7': 'Deus chamou Adão: Onde você está?',
      '8-10': 'O Senhor Deus chamou o homem e perguntou: Onde você está?',
    },
  },
  {
    id: 'v-gn-03',
    reference: 'Gênesis 4:7',
    category: 'obediencia',
    text: {
      '5-7': 'Faça o que é certo. A raiva quer mandar, mas você pode escolher o bem.',
      '8-10': 'Faça o que é certo. O pecado quer dominar você, mas você deve dominá-lo.',
    },
  },
  {
    id: 'v-gn-04',
    reference: 'Gênesis 5:24',
    category: 'presenca',
    text: {
      '5-7': 'Enoque andava com Deus, e Deus o levou para perto dele.',
      '8-10': 'Enoque andou com Deus; então Deus o levou para junto de si.',
    },
  },
  {
    id: 'v-gn-05',
    reference: 'Gênesis 6:22',
    category: 'obediencia',
    text: {
      '5-7': 'Noé fez tudo como Deus havia mandado.',
      '8-10': 'Noé fez tudo exatamente como Deus havia ordenado.',
    },
  },
  {
    id: 'v-gn-06',
    reference: 'Gênesis 11:9',
    category: 'obediencia',
    text: {
      '5-7': 'Ali Deus confundiu a língua do povo e espalhou as pessoas.',
      '8-10': 'Por isso a cidade foi chamada Babel, porque ali o Senhor confundiu a língua de todos.',
    },
  },
];

export function getVerse(id: string): Verse | undefined {
  return VERSES.find((v) => v.id === id);
}

export function versesByCategory(category: Verse['category']): Verse[] {
  return VERSES.filter((v) => v.category === category);
}

/** Deterministic "verse of the day" — same for everyone on a given calendar date. */
export function getVerseOfDay(date = new Date()): Verse {
  const start = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86_400_000);
  return VERSES[dayOfYear % VERSES.length];
}
