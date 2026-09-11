export interface QuizCardImage {
  src: string;
  alt: string;
}

export const GN02_QUIZ_CARD_ART = [
  {
    id: 'gn-02-q2-fruto',
    optionIndex: 0,
    alt: 'Uma árvore com frutos entre folhas verdes.',
    subject: 'A fruit-bearing garden tree, with a clearly visible low branch carrying a few round natural fruits among green leaves. Show enough trunk and canopy to read as a tree, not just a floating fruit. Do not specify a real-world forbidden fruit species.',
  },
  {
    id: 'gn-02-q2-pao',
    optionIndex: 1,
    alt: 'Pães redondos assados em uma cesta simples.',
    subject: 'Several unmistakable round baked bread loaves in a simple woven basket on a low natural stone surface. Rich golden crust, soft tactile scoring. Depict finished bread, not ears of wheat or grain.',
  },
  {
    id: 'gn-02-q2-rio',
    optionIndex: 2,
    alt: 'Água limpa correndo em um rio tranquilo entre pedras.',
    subject: 'A close, legible view of clear fresh river water flowing gently between smooth stones and green riverbanks. Make the water the main subject. Not ocean waves, a storm, a boat or an abstract wave symbol.',
  },
  {
    id: 'gn-02-q2-alimento',
    optionIndex: 3,
    alt: 'Capim fresco como alimento em um cocho baixo.',
    subject: 'Fresh cut grass and leafy fodder in a simple low stone feeding trough in a garden clearing. Make the animal food itself the central subject, not an animal. No packaged feed or modern objects.',
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
