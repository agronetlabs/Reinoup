import { describe, expect, test } from 'bun:test';
import {
  APPROVED_STORY_3D_ART_IDS,
  CARD_ART_STYLE,
  isApprovedStory3DArtId,
} from '../shared/card-art-policy';
import { isApprovedQuizCardImage } from '../shared/quiz-card-art';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Scene } from '../src/components/illustrations/Scene';
import { MotifIcon } from '../src/components/illustrations/MotifIcon';
import { gn01Criacao } from '../src/content/seasons/genesis/01-criacao';
import { gn02AdaoEva } from '../src/content/seasons/genesis/02-adao-eva';

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

  test('a WebP path or filename alone does not approve a quiz illustration', () => {
    for (const src of [
      '/story-art/genesis/gn-02/quiz/card.webp',
      '/story-art/genesis/gn-02/quiz/gn-02-q2-pao.webp',
      '/story-art/genesis/gn-02/quiz/card.svg',
      '/brand/mascote.webp',
      'https://example.com/card.webp',
    ]) expect(isApprovedQuizCardImage({ src, alt: 'Pães em uma cesta' })).toBe(false);
    expect(isApprovedQuizCardImage(undefined)).toBe(false);
  });

  test('approved scenes keep their raster and unconverted stories keep useful distinct artwork', () => {
    const pending = renderToStaticMarkup(createElement(Scene, {
      scene: gn01Criacao.cover, artId: gn01Criacao.id, height: 150,
    }));
    expect(pending).toContain('data-art-status="legacy-fallback"');
    expect(pending).toContain('/generated-1789149714768-9qjjj.png');
    const approved = renderToStaticMarkup(createElement(Scene, {
      scene: gn02AdaoEva.cover, artId: gn02AdaoEva.id,
    }));
    expect(approved).toContain('data-art-status="approved-3d"');
    expect(approved).toContain('/story-art/genesis/gn-02/cover.webp');
    expect(approved).not.toContain('brand/mascote');
    expect(pending).not.toContain('Arte 3D em produção');
  });

  test('missing scene metadata retains scene-specific figures rather than an identical placeholder', () => {
    const fallback = renderToStaticMarkup(createElement(Scene, { scene: gn02AdaoEva.cover, height: 150, width: 200 }));
    expect(fallback).toContain('<svg');
    expect(fallback).toContain('data-art-status="legacy-fallback"');
    expect(fallback).toContain('width:200px');
    expect(fallback).toContain('height:150px');
    const sheep = renderToStaticMarkup(createElement(MotifIcon, { motif: 'sheep', size: 36 }));
    const tree = renderToStaticMarkup(createElement(MotifIcon, { motif: 'fruit-tree', size: 36 }));
    expect(sheep).not.toBe(tree);
  });
});
