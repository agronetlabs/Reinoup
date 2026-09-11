import { describe, expect, test } from 'bun:test';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { getStoryArt, resolveStoryArtSource } from '../src/lib/story-art';
import { gn02AdaoEva } from '../src/content/seasons/genesis/02-adao-eva';

describe('cinematic story artwork', () => {
  test.each([gn02AdaoEva.id, ...gn02AdaoEva.chapters.map(chapter => chapter.id)])(
    '%s has a mobile-sized raster and an offline vector fallback',
    async id => {
      const art = getStoryArt(id)!;
      expect(art.src.endsWith('.webp')).toBe(true);
      expect(art.fallbackSrc?.endsWith('.svg')).toBe(true);
      const path = fileURLToPath(new URL(`../public${art.src}`, import.meta.url));
      const fallback = fileURLToPath(new URL(`../public${art.fallbackSrc}`, import.meta.url));
      expect(existsSync(fallback)).toBe(true);
      const meta = await sharp(path).metadata();
      expect(meta.width).toBe(1200);
      expect(meta.height).toBe(800);
      expect((await Bun.file(path).arrayBuffer()).byteLength).toBeLessThan(400_000);
      expect(resolveStoryArtSource(art, [])).toBe(art.src);
      expect(resolveStoryArtSource(art, [art.src])).toBe(art.fallbackSrc);
      expect(resolveStoryArtSource(art, [art.src, art.fallbackSrc!])).toBeUndefined();
      expect(resolveStoryArtSource(art, ['/unrelated.webp'])).toBe(art.src);
    },
  );
  test('legacy vector metadata remains inspectable but is not treated as 3D art', () => {
    const art = getStoryArt('gn-01-criacao')!;
    expect(resolveStoryArtSource(art, [])).toBe(art.src);
    expect(resolveStoryArtSource(art, [art.src])).toBeUndefined();
    expect(art.src.endsWith('.svg')).toBe(true);
  });
  test('the pilot cover keeps faces within the shallow story-card crop', () => {
    expect(getStoryArt(gn02AdaoEva.id)!.focalPoint).toBe('50% 0%');
  });
});
