import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { GENESIS_3D_CATALOG } from '../shared/story-3d-catalog.ts';
import { STORY_ART_STYLE_PROMPT, STORY_ART_REFERENCE_PROMPT, STORY_ART_STYLE_REVISION } from './lib/story-art-style.mjs';

const app = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputBaseDir = resolve(app, '..', '.local', 'story-3d-art');
const referencePath = join(app, 'public', 'story-art', 'genesis', 'gn-02', 'cover.webp');
const model = 'gpt-image-2.5-sunburst';

export function buildStory3DPrompt(spec) {
  const guardrailsText = spec.theologicalGuardrails.map(g => `- ${g}`).join('\n');
  return `Create ONE original stylized 3D storybook illustration for children aged 5 to 10.
${STORY_ART_STYLE_PROMPT}
${STORY_ART_REFERENCE_PROMPT}
Lesson title for context only, never lettering in the image: ${spec.title}
Scene description: ${spec.subject}

Editorial & Theological Guardrails:
${guardrailsText}
- Composition must fit 3:2 landscape ratio (1200x800).
- Keep primary action in the central 80% to avoid interface occlusion.
- Keep the emotion faithful to the chapter; gentle lighting must not erase consequences or sorrow.
- NO logos, words, text, modern elements, cartoon mascots, or flat vector clip art.`;
}

export function parseCliArgs(args = process.argv.slice(2)) {
  const allowed = new Set(['--generate', '--dry-run', '--story', '--asset']);
  const values = new Map();
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!allowed.has(arg) || values.has(arg)) throw new Error(`Argumento inválido ou duplicado: ${arg}`);
    if (arg === '--story' || arg === '--asset') {
      const val = args[++i];
      if (!val || val.startsWith('--')) throw new Error(`${arg} exige um parâmetro de valor.`);
      values.set(arg, val);
    } else {
      values.set(arg, true);
    }
  }
  if (values.has('--generate') && values.has('--dry-run')) throw new Error('Escolha --generate ou --dry-run, não ambos.');
  const generate = values.has('--generate');
  const storyFilter = values.get('--story');
  const assetFilter = values.get('--asset');

  let assets = [...GENESIS_3D_CATALOG];
  if (storyFilter && storyFilter !== 'all') {
    assets = assets.filter(a => a.storyId === storyFilter);
  }
  if (assetFilter) {
    assets = assets.filter(a => a.id === assetFilter);
  }
  if (assets.length === 0) {
    throw new Error(`Nenhum ativo correspondeu aos filtros (story: ${storyFilter ?? 'none'}, asset: ${assetFilter ?? 'none'}).`);
  }
  return { assets, generate };
}

export async function runStory3DArtGeneration(args = process.argv.slice(2)) {
  const { assets, generate } = parseCliArgs(args);
  if (!generate) {
    console.log(JSON.stringify({
      mode: 'dry-run',
      model,
      styleRevision: STORY_ART_STYLE_REVISION,
      count: assets.length,
      paidRequests: 0,
      destination: '.local/story-3d-art/ (amostras privadas fora do Git)',
      assets: assets.map(a => ({
        id: a.id,
        storyId: a.storyId,
        title: a.title,
        targetPath: a.targetPath,
        prompt: buildStory3DPrompt(a),
      })),
    }, null, 2));
    return;
  }

  const key = process.env.OPENAI_API_KEY || process.env.SKILL_IMAGE_GEN_OPENAI_KEY;
  if (!key) throw new Error('Configure OPENAI_API_KEY no ambiente local ou em app/.env.local. Nunca envie a chave pela conversa.');

  const reference = await readFile(referencePath);
  const referenceHash = createHash('sha256').update(reference).digest('hex');

  for (const asset of assets) {
    const targetFolder = join(outputBaseDir, asset.storyId);
    await mkdir(targetFolder, { recursive: true });
    const stem = join(targetFolder, asset.id);
    try {
      await access(`${stem}.request.json`);
      throw new Error(`Solicitação já registrada para ${asset.id}. Confira a amostra existente antes de qualquer nova cobrança.`);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
  }

  for (const asset of assets) {
    const targetFolder = join(outputBaseDir, asset.storyId);
    const stem = join(targetFolder, asset.id);
    const prompt = buildStory3DPrompt(asset);
    const request = {
      id: asset.id,
      storyId: asset.storyId,
      model,
      styleRevision: STORY_ART_STYLE_REVISION,
      prompt,
      referenceHash,
      dimensions: asset.dimensions,
      startedAt: new Date().toISOString(),
    };

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
      headers: { Authorization: 'Bearer ' + key },
      body: form,
      signal: AbortSignal.timeout(240_000),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(`Image API ${response.status}: ${result.error?.code ?? 'unknown'}; request ${response.headers.get('x-request-id')}. Sem nova tentativa automática.`);
    }
    if (!result.data?.[0]?.b64_json) {
      throw new Error('O provedor não retornou uma imagem. Consulte o pedido antes de repetir.');
    }

    const bytes = Buffer.from(result.data[0].b64_json, 'base64');
    await writeFile(`${stem}.png`, bytes, { flag: 'wx' });

    await sharp(bytes)
      .resize({ width: asset.dimensions.width, height: asset.dimensions.height, fit: 'cover', position: 'centre' })
      .webp({ quality: 88 })
      .toFile(`${stem}.webp`);

    await writeFile(`${stem}.result.json`, JSON.stringify({
      ...request,
      completedAt: new Date().toISOString(),
      requestId: response.headers.get('x-request-id'),
      usage: result.usage,
      approval: 'pending-human-review',
    }, null, 2), { flag: 'wx' });

    console.log(`${asset.id}: amostra 3D gerada em ${stem}.webp; aguarda aprovação visual humana.`);
  }
}

if (import.meta.main) await runStory3DArtGeneration();
