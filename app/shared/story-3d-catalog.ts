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
    subject: 'A breathtaking, lush panoramic Eden garden in full vibrant life. Winding sparkling river flowing from distant hills, ancient leafy fruit trees, gentle animals (a lion and lamb resting peacefully, deer drinking at the water), colourful birds in the warm golden sky. Cinematic 3D animated film style, tactile foliage and water reflections, warm natural light, inviting and serene.',
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
    alt: 'A vastidão cósmica da criação primordial, com uma suave luz divina rompendo a escuridão serena',
    subject: 'The primordial beginning before the formation of earth. A majestic, awe-inspiring deep indigo cosmic expanse with soft swirling nebula clouds, quiet distant twinkling stars, and a warm radiant celestial glow breaking peacefully through the deep darkness. Calm, mysterious and full of hope, not frightening or void. Cinematic 3D lighting, volumetric warm beams.',
    theologicalGuardrails: [
      'No human figure representing God.',
      'The darkness must feel serene and expectant, not scary or menacing.',
    ],
    dimensions: { width: 1200, height: 800 },
    targetPath: 'story-art/genesis/gn-01/01-no-comeco.webp',
  },
  {
    id: 'gn-01-c2',
    storyId: 'gn-01-criacao',
    chapterIndex: 1,
    kind: 'chapter',
    title: 'Haja luz',
    alt: 'A primeira luz do dia surgindo sobre águas cristalinas e as primeiras colinas verdejantes brotando',
    subject: 'The early earth awakening. Clear crystal-blue waters separating under a fresh morning sky with soft clouds. Fresh green sprouts, mossy stones, and tender young plants emerging along rolling hills under the bright golden sunrise light. Tactile natural textures, fresh droplets on leaves, optimistic and vibrant.',
    theologicalGuardrails: [
      'No human figure representing God.',
      'Focus on the wonder of plants and fresh waters emerging.',
    ],
    dimensions: { width: 1200, height: 800 },
    targetPath: 'story-art/genesis/gn-01/02-haja-luz.webp',
  },
  {
    id: 'gn-01-c3',
    storyId: 'gn-01-criacao',
    chapterIndex: 2,
    kind: 'chapter',
    title: 'Um céu que brilha',
    alt: 'O sol dourado e a lua prateada em um céu de transição entre entardecer e estrelas, com aves voando e peixes saltando na água',
    subject: 'A magical sky of transition between golden sunset and starlit twilight. A brilliant glowing sun on one side and a gentle crescent moon with glowing constellations on the other. Multi-colored tropical birds soaring playfully in the breeze, while playful fish and a friendly dolphin leap gently from the sparkling ocean waters below.',
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
    title: 'A terra se enche de vida',
    alt: 'Animais de diferentes portes reunidos em um campo florido em harmonia e alegria',
    subject: 'A joyful gathering of land animals in a sunlit meadow of wildflowers. A majestic friendly lion with soft fluffy mane lying next to a playful little lamb, a gentle tall giraffe peering down curiously, an elephant spraying fresh water droplets joyfully, and rabbits hopping in clover. Tactile fur and skin textures, warm Disney-storybook 3D render.',
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
    subject: 'Adam and Eve standing hand-in-hand in a peaceful glade of Eden, looking out over the beauty of creation under a warm sunset sky. Adam with wavy dark hair, warm brown skin and cream tunic; Eve with long flowing dark wavy hair and sand-colored dress. Respectful, tender, family-friendly animation aesthetic consistent with gn-02 continuity.',
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
    subject: 'A pastoral biblical landscape dividing two brotherly callings under open skies. On one side, terraced golden wheat fields and harvest baskets; on the other side, rolling green hills with white fluffy sheep grazing. Rustic stone altars in the distance with gentle smoke rising in the evening air. Cinematic 3D animated storybook style, warm earth tones, respectful and contemplative.',
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
    title: 'Dois irmãos, dois caminhos',
    alt: 'Caim trabalhando a terra com grãos e Abel cuidando das ovelhas com dedicação',
    subject: 'Two young adult brothers working their respective crafts on family land. Cain, strong and grounded with tan skin, dark hair, simple brown farming tunic, tending golden wheat stalks with a wooden sickle. Abel, gentle and observant with dark curly hair and woven sheep-wool sash, petting a small lamb near a stream. Warm sunny afternoon, authentic biblical pastoral feel.',
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
    title: 'A raiva que cresceu',
    alt: 'Caim pensativo diante do altar de pedras no campo, com uma expressão de inquietação e reflexão',
    subject: 'Cain sitting alone beside a rustic natural stone altar in an open field at late twilight. He has a pensive, troubled expression with furrowed brow, looking down at his clasped hands, grappling with inner jealousy and disappointment. The background has deep twilight indigo and amber sky. Atmospheric 3D lighting focusing on internal emotional struggle, empathetic and dramatic without becoming sinister.',
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
    title: 'A escolha antes do erro',
    alt: 'Caim caminhando no campo sob a luz suave do entardecer no momento crucial de decisão',
    subject: 'Cain walking across a wide quiet grassy plain as evening falls. A soft warm shaft of light from above illuminates his path, representing God speaking gentle counsel to his heart ("Sin is crouching at the door, but you can master it"). Cain is paused mid-stride, face filled with the weight of moral choice. Subtle, poetic, cinematic 3D animation style.',
    theologicalGuardrails: [
      'Strictly avoid any depiction of physical assault, blood, or weapons.',
      'Center the scene on the opportunity to stop, breathe, and choose the right way.',
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
    subject: 'A vast, peaceful biblical night sky filled with millions of sparkling stars above a lone traveler on a distant path between rolling dunes and quiet hills. A gentle glowing mark of protection rests over him, symbolizing God guarding human life even in consequences and sorrow. Quiet, deeply moving, conveying mercy, accountability, and hope.',
    theologicalGuardrails: [
      'No grotesque or monstrous punishment mark; the mark in Genesis is a seal of protection against harm.',
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
