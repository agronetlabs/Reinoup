import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { GN02_QUIZ_CARD_ART } from '../shared/quiz-card-art.ts';
import { STORY_ART_STYLE_PROMPT, STORY_ART_REFERENCE_PROMPT, STORY_ART_STYLE_REVISION } from './lib/story-art-style.mjs';

const app = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = resolve(app, '..', '.local', 'gn02-quiz-art');
const referencePath = join(app, 'public', 'story-art', 'genesis', 'gn-02', 'cover.webp');
const model = 'gpt-image-2.5-sunburst';

export function quizCardPrompt(art) {
  return `Create ONE original stylized 3D storybook quiz-card illustration for children aged 5 to 10.
${STORY_ART_STYLE_PROMPT}
${STORY_ART_REFERENCE_PROMPT}
Subject: ${art.subject}
The illustration must communicate this one answer literally and immediately at small mobile-card size. Compose the subject centrally with a quiet, softly receding natural background. Keep the full subject inside the central 80 percent for a 4:3 card crop.
Use the same camera distance, soft lighting, background simplicity and visual weight for all four options. Keep the answer object large; do not add faces to objects or decorative objects that compete with the answer.
This is a quiz answer illustration, not an additional biblical event. Keep the same visual richness, warmth and prominence for all alternatives, without hinting which answer is correct. No people, mascot, logos, words, lettering, numbers, interface, badges or check marks. No flat vector clip art.`;
}

export function selectQuizCardArt(args) {
  const allowed = new Set(['--generate', '--dry-run', '--asset']);
  const values = new Map();
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (!allowed.has(arg) || values.has(arg)) throw new Error(`Argumento inválido ou duplicado: ${arg}`);
    if (arg === '--asset') {
      const value = args[++index];
      if (!value || value.startsWith('--')) throw new Error('--asset exige um ID do lote autorizado.');
      values.set(arg, value);
    } else values.set(arg, true);
  }
  if (values.has('--generate') && values.has('--dry-run')) throw new Error('Escolha --generate ou --dry-run, não ambos.');
  const id = values.get('--asset');
  const assets = GN02_QUIZ_CARD_ART.filter(art => !id || art.id === id);
  if (!assets.length) throw new Error(`Arte fora do lote autorizado: ${id}`);
  return { assets, generate: values.has('--generate') };
}

export async function generateQuizCardArt(args = process.argv.slice(2)) {
  const { assets, generate } = selectQuizCardArt(args);
  if (!generate) {
    console.log(JSON.stringify({
      mode: 'dry-run', model, styleRevision: STORY_ART_STYLE_REVISION, count: assets.length, paidRequests: 0,
      destination: '.local/gn02-quiz-art (amostras privadas, sem publicação)',
      assets: assets.map(art => ({ id: art.id, alt: art.alt, prompt: quizCardPrompt(art) })),
    }, null, 2));
    return;
  }
  const key = process.env.OPENAI_API_KEY || process.env.SKILL_IMAGE_GEN_OPENAI_KEY;
  if (!key) throw new Error('Configure OPENAI_API_KEY no ambiente local ou em app/.env.local. Nunca envie a chave pela conversa.');
  const reference = await readFile(referencePath);
  const referenceHash = createHash('sha256').update(reference).digest('hex');
  await mkdir(outputDir, { recursive: true });
  for (const art of assets) {
    const stem = join(outputDir, art.id);
    try {
      await access(`${stem}.request.json`);
      throw new Error(`Solicitação já registrada para ${art.id}. Confira a amostra ou o resultado no provedor antes de qualquer nova cobrança.`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  for (const art of assets) {
    const stem = join(outputDir, art.id);
    const prompt = quizCardPrompt(art);
    const request = { id: art.id, model, styleRevision: STORY_ART_STYLE_REVISION, prompt, referenceHash, startedAt: new Date().toISOString() };
    // Um pedido interrompido pode ter sido cobrado; nunca tentar novamente automaticamente.
    await writeFile(`${stem}.request.json`, JSON.stringify(request, null, 2), { flag: 'wx' });
    const form = new FormData();
    form.set('model', model);
    form.set('prompt', prompt);
    form.set('n', '1');
    form.set('size', '1536x1024');
    form.set('quality', 'medium');
    form.set('image', new Blob([reference], { type: 'image/webp' }), 'reinoup-reference.webp');
    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}` },
      body: form,
      signal: AbortSignal.timeout(240_000),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(`Image API ${response.status}: ${result.error?.code ?? 'unknown'}; request ${response.headers.get('x-request-id')}. Sem nova tentativa automática.`);
    if (!result.data?.[0]?.b64_json) throw new Error('O provedor não retornou uma imagem. Consulte o pedido antes de repetir.');
    const bytes = Buffer.from(result.data[0].b64_json, 'base64');
    await writeFile(`${stem}.png`, bytes, { flag: 'wx' });
    const metadata = await sharp(bytes).metadata();
    if (!metadata.width || !metadata.height) throw new Error(`Imagem inválida: ${art.id}. Original preservado para inspeção.`);
    await sharp(bytes).resize({ width: 768, height: 576, fit: 'cover', position: 'centre' })
      .webp({ quality: 88 }).toFile(`${stem}.webp`);
    await writeFile(`${stem}.result.json`, JSON.stringify({
      ...request, completedAt: new Date().toISOString(), requestId: response.headers.get('x-request-id'),
      usage: result.usage, approval: 'pending-human-review',
    }, null, 2), { flag: 'wx' });
    console.log(`${art.id}: amostra em ${stem}.webp; aguarda aprovação visual, não publicada.`);
  }
}

if (import.meta.main) await generateQuizCardArt();
