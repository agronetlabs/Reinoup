import { describe, expect, test } from 'bun:test';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { CARD_ART_STYLE } from '../shared/card-art-policy';
import { STORY_ART_STYLE_PROMPT, STORY_ART_REFERENCE_PROMPT, STORY_ART_STYLE_REVISION } from '../scripts/lib/story-art-style.mjs';
import { gn01Criacao } from '../src/content/seasons/genesis/01-criacao';
import { gn03CaimAbel } from '../src/content/seasons/genesis/03-caim-abel';
import { getStoryArt } from '../src/lib/story-art';
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

  test('visual specifications follow the actual lessons, chapter order and existing asset paths', () => {
    for (const story of [gn01Criacao, gn03CaimAbel]) {
      const assets = getStory3DAssetsForStory(story.id);
      const cover = assets.find(asset => asset.kind === 'cover')!;
      expect(cover.title).toBe(`${story.title} — Capa`);
      expect(`/${cover.targetPath}`).toBe(getStoryArt(story.id)!.src.replace(/\.svg$/, '.webp'));
      const chapters = assets.filter(asset => asset.kind === 'chapter');
      expect(chapters.map(asset => asset.id)).toEqual(story.chapters.map(chapter => chapter.id));
      for (const [index, asset] of chapters.entries()) {
        expect(asset.chapterIndex).toBe(index);
        expect(asset.title).toBe(story.chapters[index].title);
        expect(`/${asset.targetPath}`).toBe(getStoryArt(asset.id)!.src.replace(/\.svg$/, '.webp'));
      }
    }
  });

  test('theological and editorial guardrails are preserved in gn-01 and gn-03', () => {
    const gn01C5 = getStory3DAsset('gn-01-c5')!;
    expect(gn01C5.theologicalGuardrails.some(g => g.includes('continuity with gn-02'))).toBe(true);
    expect(gn01C5.theologicalGuardrails.some(g => g.includes('No human representation of God'))).toBe(true);

    const gn03C3 = getStory3DAsset('gn-03-c3')!;
    expect(gn03C3.theologicalGuardrails.some(g => g.includes('avoid any depiction of physical assault'))).toBe(true);
    expect(gn03C3.theologicalGuardrails.some(g => g.includes('loss already described'))).toBe(true);
    expect(getStory3DAsset('gn-01-c1')!.theologicalGuardrails.join(' ')).toContain('Do not anticipate the sun, moon or stars');
    expect(getStory3DAsset('gn-01-c2')!.theologicalGuardrails.join(' ')).toContain('No sun, moon or stars yet');
    expect(getStory3DAsset('gn-03-c4')!.theologicalGuardrails.join(' ')).toContain('Do not invent the appearance');
  });

  test('prompt builder applies the same stylized direction without replacing authored scenes', () => {
    const cover = getStory3DAsset('gn-01-cover')!;
    const prompt = buildStory3DPrompt(cover);
    expect(prompt).toContain(CARD_ART_STYLE);
    expect(prompt).toContain('No human representation or personification of God');
    expect(prompt).toContain('NO logos, words, text');
    for (const spec of GENESIS_3D_CATALOG) {
      const scenePrompt = buildStory3DPrompt(spec);
      expect(scenePrompt).toContain(STORY_ART_STYLE_PROMPT);
      expect(scenePrompt).toContain(STORY_ART_REFERENCE_PROMPT);
      expect(scenePrompt).toContain(spec.subject);
      for (const guardrail of spec.theologicalGuardrails) expect(scenePrompt).toContain(guardrail);
    }
    expect(STORY_ART_STYLE_PROMPT).toContain('not a photograph');
    expect(STORY_ART_STYLE_PROMPT).toContain('Do not redesign the official mascot');
    expect(STORY_ART_STYLE_PROMPT).toContain('Preserve the authored lesson');
  });

  test('story dry-run reports the revision without expanding its scope or making paid requests', () => {
    const result = spawnSync(process.execPath, [
      fileURLToPath(new URL('../scripts/generate-story-3d-art.mjs', import.meta.url)),
      '--dry-run', '--story', 'gn-01-criacao',
    ], { encoding: 'utf8' });
    expect(result.status).toBe(0);
    const report = JSON.parse(result.stdout);
    expect(report.mode).toBe('dry-run');
    expect(report.styleRevision).toBe(STORY_ART_STYLE_REVISION);
    expect(report.model).toBe('gpt-image-2.5-sunburst');
    expect(report.count).toBe(6);
    expect(report.paidRequests).toBe(0);
    expect(report.assets.map((asset: { id: string }) => asset.id)).toEqual(getStory3DAssetsForStory('gn-01-criacao').map(asset => asset.id));
  });

  test('both original gn-02 generator modes also use the shared style', async () => {
    const source = await Bun.file(new URL('../scripts/generate-gn02-art.mjs', import.meta.url)).text();
    expect(source.match(/\$\{STORY_ART_STYLE_PROMPT\}/g)).toHaveLength(2);
    expect(source).toContain('styleRevision: STORY_ART_STYLE_REVISION');
    expect(source).not.toContain('richly detailed textures');
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
