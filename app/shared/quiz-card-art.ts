export interface QuizCardImage {
  src: string;
  alt: string;
}

export const GN02_QUIZ_CARD_ART = [
  {
    id: 'gn-02-q2-fruto',
    optionIndex: 0,
    alt: 'Uma árvore com frutos entre folhas verdes.',
    subject: 'A stylized fruit-bearing garden tree with a rounded trunk and broad, simple leaf clusters. A clearly visible low branch carries a few large round fruits. Show enough trunk and canopy to read as a tree, not just a floating fruit. Suggest bark with a few soft grooves, not rough photographic detail. Do not specify a real-world forbidden fruit species.',
  },
  {
    id: 'gn-02-q2-pao',
    optionIndex: 1,
    alt: 'Pães redondos assados em uma cesta simples.',
    subject: 'Several unmistakable plump round baked bread loaves in a simple rounded basket on a low stone surface. Soft matte golden crust with a few broad shallow cuts; simplify the basket weave into wide rounded bands. No flour pores, tiny crumbs or photographic food texture. Depict finished bread, not ears of wheat or grain.',
  },
  {
    id: 'gn-02-q2-rio',
    optionIndex: 2,
    alt: 'Água limpa correndo em um rio tranquilo entre pedras.',
    subject: 'A close, legible view of clear fresh river water flowing gently between a few smooth rounded stones and simple green riverbanks. Use broad soft reflections and a clean curved flow, not dense foam or sparkling microdetail. Make the water the main subject. Not ocean waves, a storm, a boat or an abstract wave symbol.',
  },
  {
    id: 'gn-02-q2-alimento',
    optionIndex: 3,
    alt: 'Capim fresco como alimento em um cocho baixo.',
    subject: 'Fresh cut grass and leafy fodder grouped into a few large readable tufts in a simple low rounded stone feeding trough. Soft matte surfaces and a quiet garden clearing; avoid gritty stone pores and hundreds of individual grass blades. Make the animal food itself the central subject, not an animal. No packaged feed or modern objects.',
  },
] as const;

export type QuizCardArtId = typeof GN02_QUIZ_CARD_ART[number]['id'];

export interface QuizCardArtApproval {
  assetId: QuizCardArtId;
  approvalReference: string;
}

// O lote autorizado para produzir amostras ainda exige aprovação visual para entrar no app.
export const APPROVED_QUIZ_CARD_ART: readonly QuizCardArtApproval[] = [];

export function getApprovedQuizCardArt(storyId: string, questionId: string, optionIndex: number, baseUrl = '/'): QuizCardImage | undefined {
  if (storyId !== 'gn-02-adao-eva' || questionId !== 'gn-02-q2') return undefined;
  const art = GN02_QUIZ_CARD_ART.find(candidate => candidate.optionIndex === optionIndex);
  if (!art || !APPROVED_QUIZ_CARD_ART.some(approval =>
    approval.assetId === art.id && approval.approvalReference.trim().length > 0
  )) return undefined;
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return {
    src: `${base}story-art/genesis/gn-02/quiz/${art.id}.webp`,
    alt: art.alt,
  };
}

export function isApprovedQuizCardImage(image: QuizCardImage | undefined, baseUrl = '/'): image is QuizCardImage {
  if (!image) return false;
  return GN02_QUIZ_CARD_ART.some(art => {
    const approved = getApprovedQuizCardArt('gn-02-adao-eva', 'gn-02-q2', art.optionIndex, baseUrl);
    return approved?.src === image.src && approved.alt === image.alt;
  });
}
