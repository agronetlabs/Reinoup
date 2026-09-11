export const CARD_ART_STYLE = 'DisneyClub3D' as const;

// These are the only story rasters that are currently produced and retained
// as approved 3D artwork. Planned catalog entries stay pending until files are
// generated and reviewed.
export const APPROVED_STORY_3D_ART_IDS = [
  'gn-02-adao-eva',
  'gn-02-c1',
  'gn-02-c2',
  'gn-02-c3',
  'gn-02-c4',
] as const;

export type ApprovedStory3DArtId = typeof APPROVED_STORY_3D_ART_IDS[number];

export function isApprovedStory3DArtId(artId: string | undefined): artId is ApprovedStory3DArtId {
  return typeof artId === 'string'
    && APPROVED_STORY_3D_ART_IDS.includes(artId as ApprovedStory3DArtId);
}

export function isApproved3DImageSource(source: string | undefined): boolean {
  return typeof source === 'string'
    && source.startsWith('/')
    && source.includes('/story-art/')
    && source.endsWith('.webp');
}
