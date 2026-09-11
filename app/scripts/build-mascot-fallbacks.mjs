import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const app = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(app, 'src', 'assets', 'brand');
await mkdir(output, { recursive: true });

for (const [name, width] of [['mascote', 160], ['mascote-busto', 128]]) {
  await sharp(join(app, 'public', 'brand', `${name}.png`))
    .resize({ width, withoutEnlargement: true })
    .png({ palette: true, compressionLevel: 9 })
    .toFile(join(output, `${name}-fallback.png`));
  console.log(`Fallback oficial gerado: ${name}`);
}
