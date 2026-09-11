import { readFile, mkdir, writeFile, access, rename } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { STORY_ART_STYLE_PROMPT, STORY_ART_REFERENCE_PROMPT, STORY_ART_STYLE_REVISION } from './lib/story-art-style.mjs';

const app = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const archive = resolve(app, '..', '.local', 'gn02-raster');
const referencePath = join(archive, 'cover-pilot-sunburst.png');
const scenes = {
  '01-jardim-cuidado': 'Chapter 1: caring for Eden. Both adults tend small plants beside a clear stream, one kneeling to gently arrange the earth, the other offering water from a plain clay jug. Peaceful animals in the distance. Wide welcoming morning scene, faces and hands clearly readable. No snake and no forbidden fruit being picked. The image illustrates responsibility, abundance and care.',
  '02-voz-serpente': 'A quiet conversation in a garden orchard. The adult woman stands beside a fruit tree looking thoughtfully at a small green snake resting on a low branch. The adult man stands nearby. Both keep their hands at their sides. Show expressive, thoughtful faces. Soft late-afternoon light, simplified rounded foliage and a quietly receding garden. Frame all three characters clearly.',
  '03-esconderijo': 'Two adult gardeners stand together partly behind a flowering shrub in a peaceful garden at dusk. Their expressive faces are thoughtful and a little concerned, visible above the foliage. Both look toward an empty path where warm sunlight breaks through the canopy. Their cream woven clothes and blue and orange sashes remain visible. The composition conveys a quiet moment of reflection and reassurance.',
  '04-novo-caminho': 'Chapter 4: a new path. The same two adults, still fully clothed in their established tunics, walk hand in hand away from the lush garden into an open landscape. Three-quarter side view with faces visible, quietly reflective yet hopeful. The garden recedes behind them; a simple earthen path leads toward distant hills in morning light. No snake, no flames, no threatening guards. The image conveys consequences and continuing care, not abandonment.',
};
const scene = process.argv.find(arg => arg.startsWith('--scene='))?.slice(8);
if (!scene || !(scene in scenes)) throw new Error(`Specify --scene=${Object.keys(scenes).join('|')}`);
if (!process.argv.includes('--generate')) throw new Error('Paid generation requires explicit --generate.');
const key = process.env.OPENAI_API_KEY;
if (!key) throw new Error('Missing OPENAI_API_KEY; inject it locally, never into frontend code.');
await mkdir(archive, { recursive: true });
const original = join(archive, `${scene}.png`);
const output = join(app, 'public/story-art/genesis/gn-02', `${scene}.webp`);
try {
  await access(original);
  throw new Error('Original already exists; refusing a duplicate paid request.');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const reference = await readFile(referencePath);
const textOnly = process.argv.includes('--text-only');
const model = 'gpt-image-2.5-sunburst';
const prompt = `Create a NEW original cinematic 3D illustrated scene for the same family Bible story as the supplied reference.
${STORY_ART_STYLE_PROMPT}
${STORY_ART_REFERENCE_PROMPT}
Preserve the reference character identities, facial features, skin tone, curly dark hair and short beard of the adult man, long wavy dark hair of the adult woman, and their cream/sand clothing with blue and orange sashes. These are adult people. Keep materials softly stylized rather than photorealistic.
Change the composition, poses, expressions and camera to tell this specific scene: ${scenes[scene]}
Use layered foreground, middle distance and background. Keep faces and story action in the central 70 percent; reserve bottom corners for interface cropping. Landscape 3:2. No words, lettering, modern objects, logos, mascot or interface. Family-friendly, expressive and original, not flat vector clip art.`;
const form = new FormData();
form.set('model', model);
form.set('prompt', prompt);
form.set('n', '1');
form.set('size', '1536x1024');
form.set('quality', 'medium');
form.set('image', new Blob([reference], { type: 'image/png' }), 'character-reference.png');
const textPrompt = `An original 3D animated storybook illustration, landscape 1536x1024.
${STORY_ART_STYLE_PROMPT}
Two adult gardeners: a warm brown-skinned man with short curly dark hair, a short beard, cream knee-length tunic, blue sash and sandals; and a warm brown-skinned woman with long wavy dark hair, full-length sand-colored dress, orange sash and sandals. Keep these identities and costumes unchanged. ${scenes[scene]} Keep faces and action central, with a clear readable composition. No text, logos, mascot or interface.`;
const response = await fetch(`https://api.openai.com/v1/images/${textOnly ? 'generations' : 'edits'}`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${key}`, ...(textOnly ? { 'Content-Type': 'application/json' } : {}) },
  body: textOnly ? JSON.stringify({ model, prompt: textPrompt, n: 1, size: '1536x1024', quality: 'medium' }) : form,
  signal: AbortSignal.timeout(240_000),
});
const result = await response.json();
if (!response.ok) throw new Error(`Image API ${response.status}: ${result.error?.code ?? 'unknown'}; request ${response.headers.get('x-request-id')}`);
if (!result.data?.[0]?.b64_json) throw new Error('Provider returned no image. No automatic retry.');
const image = Buffer.from(result.data[0].b64_json, 'base64');
await sharp(image).metadata();
await writeFile(`${original}.tmp`, image);
await rename(`${original}.tmp`, original);
await sharp(image).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 88 }).toFile(`${output}.tmp`);
await rename(`${output}.tmp`, output);
const report = {
  scene, model, styleRevision: STORY_ART_STYLE_REVISION, prompt: textOnly ? textPrompt : prompt,
  referenceHash: textOnly ? null : createHash('sha256').update(reference).digest('hex'),
  referenceMode: textOnly ? 'text-description-only' : 'image-edit',
  usage: result.usage, requestId: response.headers.get('x-request-id'),
  generatedAt: new Date().toISOString(),
};
await writeFile(join(archive, `${scene}.json`), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ scene, output, usage: result.usage }));
