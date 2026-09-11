export interface Story3DAssetSpec {
  id: string;
  storyId: string;
  chapterIndex?: number;
  kind: 'cover' | 'chapter';
  title: string;
  alt: string;
  subject: string;
  theologicalGuardrails: string[];
  dimensions: { width: number; height: number };
  targetPath: string;
}

export const GENESIS_3D_CATALOG: readonly Story3DAssetSpec[] = [
  // ============================================================
  // Gênesis 01: Deus Criou Tudo
  // ============================================================
  {
    id: 'gn-01-cover',
    storyId: 'gn-01-criacao',
    kind: 'cover',
    title: 'Deus criou tudo — Capa',
    alt: 'Jardim cheio de vida, árvores, rio cristalino e animais sob a luz dourada do amanhecer',
    subject: 'A welcoming overview of the creation described in the lesson: a gently winding river between broad green hills and rounded fruit trees, with a few clearly recognizable animals and birds. Use simple grouped foliage, soft matte surfaces and diffuse golden light. The living landscape is the single focus; leave quiet space around it rather than filling every corner with detail.',
    theologicalGuardrails: [
      'No human representation or personification of God.',
      'Show nature in peaceful harmony and abundant care.',
      'Leave ample clear area at bottom and top for interface overlay.',
    ],
    dimensions: { width: 1200, height: 800 },
    targetPath: 'story-art/genesis/gn-01/cover.webp',
  },
  {
    id: 'gn-01-c1',
    storyId: 'gn-01-criacao',
    chapterIndex: 0,
    kind: 'chapter',
    title: 'No começo, só Deus',
    alt: 'Escuridão serena, sem astros ou paisagens, antes das coisas criadas',
    subject: 'A calm, uncluttered deep-blue expanse conveying the beginning before created things appear. Soft broad tonal transitions and a sense of expectant stillness, without a visible light source or celestial objects. The first chapter establishes that everything begins with God, without depicting a figure.',
    theologicalGuardrails: [
      'No human figure representing God.',
      'The darkness must feel serene and expectant, not scary or menacing.',
      'Do not anticipate the sun, moon or stars, land, plants, animals or people in this chapter.',
    ],
    dimensions: { width: 1200, height: 800 },
    targetPath: 'story-art/genesis/gn-01/01-no-comeco.webp',
  },
  {
    id: 'gn-01-c2',
    storyId: 'gn-01-criacao',
    chapterIndex: 1,
    kind: 'chapter',
    title: 'Haja luz!',
    alt: 'A primeira luz iluminando as águas, a terra e as plantas, sem astros visíveis',
    subject: 'The first light gently illuminating the water, newly visible land and the plants described in this chapter. A few broad green hills, rounded trees and large simple leaves beside clear water. The illumination is diffuse, without a visible source in the sky; preserve the distinction between this first light and the later creation of luminaries.',
    theologicalGuardrails: [
      'No human figure representing God.',
      'Focus on the wonder of plants and fresh waters emerging.',
      'No sun, moon or stars yet; those belong to the following chapter.',
    ],
    dimensions: { width: 1200, height: 800 },
    targetPath: 'story-art/genesis/gn-01/02-haja-luz.webp',
  },
  {
    id: 'gn-01-c3',
    storyId: 'gn-01-criacao',
    chapterIndex: 2,
    kind: 'chapter',
    title: 'Luzes, peixes e aves',
    alt: 'O sol dourado e a lua prateada em um céu de transição entre entardecer e estrelas, com aves voando e peixes saltando na água',
    subject: 'A simplified storybook overview of the luminaries and the sea and sky creatures introduced in this chapter. A warm sun and a quiet moon with a few stars mark day and night as an illustrative composition, not a literal single instant. Rounded birds fly above clear water with a few large readable fish silhouettes. Keep sea and sky distinct with broad shapes and soft highlights.',
    theologicalGuardrails: [
      'No mythological creatures; only real animals in stylized family animation form.',
      'Show joyful harmony between sea and sky creatures.',
    ],
    dimensions: { width: 1200, height: 800 },
    targetPath: 'story-art/genesis/gn-01/03-luzes-peixes-aves.webp',
  },
  {
    id: 'gn-01-c4',
    storyId: 'gn-01-criacao',
    chapterIndex: 3,
    kind: 'chapter',
    title: 'Os animais',
    alt: 'Animais de diferentes portes reunidos em um campo florido em harmonia e alegria',
    subject: 'A friendly gathering of recognizable land animals from the lesson in a simple green meadow: a lion with a rounded mane, an elephant, a giraffe and a small rabbit. Show different sizes through clear silhouettes and curious natural poses. Fur and skin are soft matte volumes with only a few broad details, against a quiet background.',
    theologicalGuardrails: [
      'No predation or danger; all animals live in gentle paradise peace.',
      'Friendly, curious expressions suitable for young children.',
    ],
    dimensions: { width: 1200, height: 800 },
    targetPath: 'story-art/genesis/gn-01/04-animais.webp',
  },
  {
    id: 'gn-01-c5',
    storyId: 'gn-01-criacao',
    chapterIndex: 4,
    kind: 'chapter',
    title: 'Deus criou você',
    alt: 'Adão e Eva em contemplação afetuosa do belo jardim sob a luz suave do entardecer',
    subject: 'Adam and Eve contemplating the garden together, illustrating the people created in this chapter. Preserve the gn-02 identities: both are adults with warm brown skin; Adam has short curly dark hair, a short beard, a cream tunic, blue sash and sandals; Eve has long wavy dark hair, a sand-colored dress, orange sash and sandals. Keep their existing proportions and facial identities. Use simplified matte cloth, rounded foliage and warm diffuse light.',
    theologicalGuardrails: [
      'Maintain exact character continuity with gn-02 (Adam and Eve clothing, skin tone, hair).',
      'Modest, tasteful attire appropriate for children 5-10.',
      'No human representation of God; His presence is felt through warm celestial light.',
    ],
    dimensions: { width: 1200, height: 800 },
    targetPath: 'story-art/genesis/gn-01/05-deus-criou-voce.webp',
  },

  // ============================================================
  // Gênesis 03: Caim e Abel
  // ============================================================
  {
    id: 'gn-03-cover',
    storyId: 'gn-03-caim-abel',
    kind: 'cover',
    title: 'Caim e Abel — Capa',
    alt: 'Caim com feixes de trigo no campo de cultivo e Abel com seu rebanho de ovelhas em colinas pastoris',
    subject: 'Cain and Abel on the family land, showing their different work with equal dignity. Cain stands beside a basket of crops and simple planted rows; Abel tends a small flock on a rounded green hillside. They are related young adults with warm brown skin and dark hair, in simple modest clothing. Focus on the brothers and their work, with soft matte materials and a quiet pastoral background.',
    theologicalGuardrails: [
      'Do not foreshadow violence or depict malice in the cover.',
      'Show both vocations (farming and shepherding) with dignity and care.',
    ],
    dimensions: { width: 1200, height: 800 },
    targetPath: 'story-art/genesis/gn-03/cover.webp',
  },
  {
    id: 'gn-03-c1',
    storyId: 'gn-03-caim-abel',
    chapterIndex: 0,
    kind: 'chapter',
    title: 'Dois irmãos, dois presentes',
    alt: 'Caim trabalhando a terra com grãos e Abel cuidando das ovelhas com dedicação',
    subject: 'Two young adult brothers caring for the family land as described in the chapter. Cain, with warm brown skin, dark hair and a simple brown tunic, gathers crops in a basket. Abel, with related features, dark curly hair and a simple cream tunic, tends a sheep nearby. Show their work and care through clear poses, simplified rounded plants and matte cloth, without depicting a sacrifice.',
    theologicalGuardrails: [
      'Brothers should look related (similar features, olive/tan skin, dark hair).',
      'Dignify both agricultural labor and pastoral care.',
    ],
    dimensions: { width: 1200, height: 800 },
    targetPath: 'story-art/genesis/gn-03/01-dois-irmaos.webp',
  },
  {
    id: 'gn-03-c2',
    storyId: 'gn-03-caim-abel',
    chapterIndex: 1,
    kind: 'chapter',
    title: 'Quando a raiva cresce',
    alt: 'Caim pensativo diante do altar de pedras no campo, com uma expressão de inquietação e reflexão',
    subject: 'Cain beside a simple stone altar in the field, his closed posture and furrowed brow conveying the frustration and anger described in the chapter. Keep his face readable and relatable rather than sinister. Rounded stones, a quiet background and diffuse evening light support the emotion without turning it into spectacle. Do not replace this emotion with a smile.',
    theologicalGuardrails: [
      'Focus on the internal conflict and emotion (anger/sadness), not on demonic or horrifying caricatures.',
      'Keep Cain relatable to children learning to process frustration and jealousy.',
    ],
    dimensions: { width: 1200, height: 800 },
    targetPath: 'story-art/genesis/gn-03/02-raiva-cresce.webp',
  },
  {
    id: 'gn-03-c3',
    storyId: 'gn-03-caim-abel',
    chapterIndex: 2,
    kind: 'chapter',
    title: 'Escolher antes de agir',
    alt: 'Caim sozinho no campo silencioso após a perda de Abel, com tristeza contida',
    subject: 'A quiet field after the loss described in this chapter. Cain stands alone with lowered shoulders beside an empty path, conveying the consequence of his choice through absence and restrained sorrow. Keep the foreground uncluttered, the landscape softly rounded and the light gentle. Do not depict the assault or body, and do not turn the event into a happy reconciliation.',
    theologicalGuardrails: [
      'Strictly avoid any depiction of physical assault, blood, or weapons.',
      'Respect the loss already described in the chapter and its lesson about stopping and seeking help; do not invent a rescue or erase the consequence.',
    ],
    dimensions: { width: 1200, height: 800 },
    targetPath: 'story-art/genesis/gn-03/03-escolher-ajuda.webp',
  },
  {
    id: 'gn-03-c4',
    storyId: 'gn-03-caim-abel',
    chapterIndex: 3,
    kind: 'chapter',
    title: 'Deus vê e protege',
    alt: 'Caim caminhando sob um vasto céu estrelado de esperança e recomeço, sob o cuidado protetor de Deus',
    subject: 'Cain leaving the cultivated land along a quiet path, as described in the chapter. His posture remains reflective and sorrowful, but the scene is not threatening. Use broad rounded hills, a simple night sky and soft ambient light to frame his journey. Do not add a glowing symbol, a visible divine companion or a new event.',
    theologicalGuardrails: [
      'Do not invent the appearance of the protective mark: the lesson does not describe its shape.',
      'The mood must emphasize divine mercy, protection of life, and the solemn journey of a new beginning.',
    ],
    dimensions: { width: 1200, height: 800 },
    targetPath: 'story-art/genesis/gn-03/04-deus-protege.webp',
  },
] as const;

export function getStory3DAsset(id: string): Story3DAssetSpec | undefined {
  return GENESIS_3D_CATALOG.find(spec => spec.id === id);
}

export function getStory3DAssetsForStory(storyId: string): Story3DAssetSpec[] {
  return GENESIS_3D_CATALOG.filter(spec => spec.storyId === storyId);
}
