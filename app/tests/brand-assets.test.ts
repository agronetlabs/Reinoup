import { describe, expect, test } from 'bun:test';
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const app = resolve(dirname(fileURLToPath(import.meta.url)), '..');

describe('official mascot only', () => {
  test.each([['mascote', 160], ['mascote-busto', 128]] as const)(
    '%s embedded fallback is a resized copy of the official artwork',
    async (name, width) => {
      const expected = await sharp(join(app, 'public', 'brand', `${name}.png`))
        .resize({ width, withoutEnlargement: true })
        .png({ palette: true, compressionLevel: 9 })
        .toBuffer();
      const actual = await readFile(join(app, 'src', 'assets', 'brand', `${name}-fallback.png`));
      expect(actual.equals(expected)).toBe(true);
      const metadata = await sharp(actual).metadata();
      expect(metadata.hasAlpha).toBe(true);
      expect(metadata.width).toBe(width);
    },
  );

  test('legacy mascot renderer is not present or imported by any screen', async () => {
    expect(existsSync(join(app, 'src', 'components', 'mascot', 'Mascot.tsx'))).toBe(false);
    const files = await readdir(join(app, 'src'), { recursive: true });
    for (const file of files.filter(name => /\.(ts|tsx)$/.test(name))) {
      const source = await readFile(join(app, 'src', file), 'utf8');
      expect(source, file).not.toMatch(/from\s+['"][^'"]*\/Mascot['"]/);
      expect(source, file).not.toMatch(/<Mascot(?:\s|\/|>)/);
    }
  });
});
