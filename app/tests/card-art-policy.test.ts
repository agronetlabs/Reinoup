import { describe, expect, test } from 'bun:test';
import {
  APPROVED_STORY_3D_ART_IDS,
  CARD_ART_STYLE,
  isApproved3DImageSource,
  isApprovedStory3DArtId,
} from '../shared/card-art-policy';

describe('card artwork policy', () => {
  test('uses the single approved visual style', () => {
    expect(CARD_ART_STYLE).toBe('DisneyClub3D');
  });

  test('only the existing gn-02 raster set is approved as story 3D art', () => {
    expect(APPROVED_STORY_3D_ART_IDS).toEqual([
      'gn-02-adao-eva',
      'gn-02-c1',
      'gn-02-c2',
      'gn-02-c3',
      'gn-02-c4',
    ]);
    expect(isApprovedStory3DArtId('gn-02-c2')).toBe(true);
    expect(isApprovedStory3DArtId('gn-01-c1')).toBe(false);
    expect(isApprovedStory3DArtId(undefined)).toBe(false);
  });

  test('accepts only story-art WebP sources for approved card rasters', () => {
    expect(isApproved3DImageSource('/story-art/genesis/gn-02/quiz/card.webp')).toBe(true);
    expect(isApproved3DImageSource('/story-art/genesis/gn-02/quiz/card.svg')).toBe(false);
    expect(isApproved3DImageSource('/brand/mascote.webp')).toBe(false);
    expect(isApproved3DImageSource('https://example.com/card.webp')).toBe(false);
  });
});
