import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { STORIES } from '../src/content/stories.ts';
import { assertApprovedVoice } from '../shared/voice-policy.ts';
import {
  MANIFEST_VERSION,
  WARM_NARRATION_SETTINGS,
  contentHash,
  readManifest,
  requestNarration,
  writeManifestAtomic,
} from './lib/story-audio-generator.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public/audio/stories');
const args = process.argv.slice(2);
const option = name => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};
const dryRun = args.includes('--dry-run');
const force = args.includes('--force');
const storyFilter = option('--story');
const seasonFilter = option('--season');
const throughOrderOption = option('--through-order');
const throughOrder = throughOrderOption === undefined ? undefined : Number(throughOrderOption);
const ageFilter = option('--age');
const chapterFilter = option('--chapter');
const pageOption = option('--page');
const pageFilter = pageOption === undefined ? undefined : Number(pageOption) - 1;
const apiKey = process.env.ELEVENLABS_API_KEY;
const voiceId = process.env.ELEVENLABS_VOICE_ID;
const modelId = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';
const ageBands = ageFilter ? [ageFilter] : ['5-7', '8-10'];

if (!dryRun) assertApprovedVoice(voiceId);
if (ageBands.some(age => age !== '5-7' && age !== '8-10')) {
  throw new Error('--age deve ser 5-7 ou 8-10');
}
if (pageFilter !== undefined && (!Number.isInteger(pageFilter) || pageFilter < 0 || !chapterFilter)) {
  throw new Error('--page deve ser um inteiro a partir de 1 e requer --chapter');
}
if (throughOrder !== undefined && (!Number.isInteger(throughOrder) || throughOrder < 1 || !seasonFilter)) {
  throw new Error('--through-order deve ser um inteiro positivo e requer --season');
}
if (!dryRun && !apiKey) {
  console.error('ELEVENLABS_API_KEY ausente. Use --dry-run para listar sem consumir créditos.');
  process.exit(1);
}

const stories = STORIES.filter(story =>
  (!storyFilter || story.id === storyFilter)
  && (!seasonFilter || story.seasonId === seasonFilter)
  && (throughOrder === undefined || story.order <= throughOrder)
);
if (storyFilter && stories.length === 0) throw new Error(`História desconhecida: ${storyFilter}`);
if (seasonFilter && stories.length === 0) throw new Error(`Temporada desconhecida ou vazia: ${seasonFilter}`);

let generated = 0;
let skipped = 0;
let planned = 0;
let generatedCharacters = 0;
let billedCharacters = 0;
console.log(`ElevenLabs: voz ${voiceId} · modelo ${modelId}`);
for (const story of stories) {
  const storyDir = path.join(publicDir, story.id);
  const manifestPath = path.join(storyDir, 'manifest.json');
  const previous = await readManifest(manifestPath);
  const manifestVoiceSettings = {
    stability: WARM_NARRATION_SETTINGS.stability,
    similarityBoost: WARM_NARRATION_SETTINGS.similarity_boost,
    style: WARM_NARRATION_SETTINGS.style,
    speed: WARM_NARRATION_SETTINGS.speed,
    useSpeakerBoost: WARM_NARRATION_SETTINGS.use_speaker_boost,
  };
  const sameVoiceConfiguration = previous?.voiceId === voiceId
    && previous?.modelId === modelId
    && JSON.stringify(previous.voiceSettings) === JSON.stringify(manifestVoiceSettings);
  const isSelectedPage = page =>
    ageBands.includes(page.ageBand)
    && (!chapterFilter || page.chapterId === chapterFilter)
    && (pageFilter === undefined || page.pageIndex === pageFilter);
  const preservedPages = previous?.pages.filter(page => !isSelectedPage(page)) ?? [];
  if (previous && !sameVoiceConfiguration && preservedPages.length > 0) {
    throw new Error(
      `A voz/modelo de ${story.id} mudou. Regenere todas as páginas existentes para não publicar áudio misto.`,
    );
  }
  const pages = [];

  for (const ageBand of ageBands) {
    for (const chapter of story.chapters) {
      if (chapterFilter && chapter.id !== chapterFilter) continue;
      for (const [pageIndex, text] of chapter.pages[ageBand].entries()) {
        if (pageFilter !== undefined && pageIndex !== pageFilter) continue;
        const hash = contentHash(text);
        const relativeFile = `${ageBand}/${chapter.id}-p${pageIndex + 1}.mp3`;
        const oldPage = previous?.pages.find(page =>
          page.ageBand === ageBand && page.chapterId === chapter.id && page.pageIndex === pageIndex
        );
        if (
          !force
          && sameVoiceConfiguration
          && oldPage?.contentHash === hash
          && oldPage.file === relativeFile
          && existsSync(path.join(storyDir, relativeFile))
        ) {
          pages.push(oldPage);
          skipped++;
          continue;
        }
        planned++;
        console.log(`${dryRun ? '•' : '🔊'} ${story.id} / ${ageBand} / ${chapter.id} / página ${pageIndex + 1}`);
        if (dryRun) continue;

        const narration = await requestNarration({ apiKey, voiceId, modelId, text });
        const filePath = path.join(storyDir, relativeFile);
        await mkdir(path.dirname(filePath), { recursive: true });
        await writeFile(filePath, narration.audio);
        pages.push({
          storyId: story.id,
          chapterId: chapter.id,
          pageIndex,
          ageBand,
          contentHash: hash,
          file: relativeFile.replaceAll('\\', '/'),
          durationMs: narration.durationMs,
          ...(narration.characterCost === null ? {} : { characterCost: narration.characterCost }),
          cues: narration.cues,
        });
        generated++;
        generatedCharacters += text.length;
        billedCharacters += narration.characterCost ?? text.length;
      }
    }
  }

  if (!dryRun) {
    await writeManifestAtomic(manifestPath, {
      version: MANIFEST_VERSION,
      storyId: story.id,
      generatedAt: new Date().toISOString(),
      provider: 'elevenlabs',
      modelId,
      voiceId,
      voiceSettings: manifestVoiceSettings,
      pages: [...preservedPages, ...pages],
    });
  }
}

console.log(dryRun
  ? `\nDry-run: ${planned} página(s) seriam geradas; ${skipped} já estão atuais.`
  : `\nConcluído: ${generated} geradas (${generatedCharacters} caracteres de texto; ${billedCharacters} cobrados pelo header); ${skipped} já estavam atuais.`);
