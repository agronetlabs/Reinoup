import { describe, expect, test } from 'bun:test';
import {
  GENESIS_3D_CATALOG,
  getStory3DAsset,
  getStory3DAssetsForStory,
} from '../shared/story-3d-catalog';
import {
  buildStory3DPrompt,
  parseCliArgs,
} from '../scripts/generate-story-3d-art.mjs';

describe('3D Story Art Catalog & Specifications', () => {
  test('catalog contains complete coverage for gn-01-criacao and gn-03-caim-abel', () => {
    const gn01Assets = getStory3DAssetsForStory('gn-01-criacao');
    expect(gn01Assets.length).toBe(6); // cover + 5 chapters
    expect(gn01Assets.map(a => a.id)).toEqual([
      'gn-01-cover',
      'gn-01-c1',
      'gn-01-c2',
      'gn-01-c3',
      'gn-01-c4',
      'gn-01-c5',
    ]);

    const gn03Assets = getStory3DAssetsForStory('gn-03-caim-abel');
    expect(gn03Assets.length).toBe(5); // cover + 4 chapters
    expect(gn03Assets.map(a => a.id)).toEqual([
      'gn-03-cover',
      'gn-03-c1',
      'gn-03-c2',
      'gn-03-c3',
      'gn-03-c4',
    ]);
  });

  test('all specifications define valid landscape 1200x800 dimensions and guardrails', () => {
    for (const spec of GENESIS_3D_CATALOG) {
      expect(spec.dimensions.width).toBe(1200);
      expect(spec.dimensions.height).toBe(800);
      expect(spec.alt.length).toBeGreaterThan(15);
      expect(spec.subject.length).toBeGreaterThan(30);
      expect(spec.theologicalGuardrails.length).toBeGreaterThanOrEqual(2);
      expect(spec.targetPath.startsWith('story-art/genesis/')).toBe(true);
      expect(spec.targetPath.endsWith('.webp')).toBe(true);
    }
  });

  test('theological and editorial guardrails are preserved in gn-01 and gn-03', () => {
    const gn01C5 = getStory3DAsset('gn-01-c5')!;
    expect(gn01C5.theologicalGuardrails.some(g => g.includes('continuity with gn-02'))).toBe(true);
    expect(gn01C5.theologicalGuardrails.some(g => g.includes('No human representation of God'))).toBe(true);

    const gn03C3 = getStory3DAsset('gn-03-c3')!;
    expect(gn03C3.theologicalGuardrails.some(g => g.includes('avoid any depiction of physical assault'))).toBe(true);
  });

  test('prompt builder incorporates Disney Club 3D style and guardrails', () => {
    const cover = getStory3DAsset('gn-01-cover')!;
    const prompt = buildStory3DPrompt(cover);
    expect(prompt).toContain('Disney Club 3D');
    expect(prompt).toContain('No human representation or personification of God');
    expect(prompt).toContain('NO logos, words, text');
  });

  test('CLI parser handles filters and enforces single-mode selection', () => {
    const { assets: all, generate: genAll } = parseCliArgs([]);
    expect(all.length).toBe(GENESIS_3D_CATALOG.length);
    expect(genAll).toBe(false);

    const { assets: gn01 } = parseCliArgs(['--story', 'gn-01-criacao']);
    expect(gn01.length).toBe(6);

    const { assets: single } = parseCliArgs(['--asset', 'gn-03-cover']);
    expect(single.length).toBe(1);
    expect(single[0].id).toBe('gn-03-cover');

    expect(() => parseCliArgs(['--generate', '--dry-run'])).toThrow();
    expect(() => parseCliArgs(['--story', 'nonexistent'])).toThrow();
  });
});
