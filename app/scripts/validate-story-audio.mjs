import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { STORIES } from '../src/content/stories.ts';
import { WARM_NARRATION_SETTINGS, contentHash, readManifest } from './lib/story-audio-generator.mjs';
import { isApprovedVoice } from '../shared/voice-policy.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/audio/stories');
const args = process.argv.slice(2);
const option = name => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};
const season = option('--season');
const throughOrder = Number(option('--through-order') ?? Number.POSITIVE_INFINITY);
const expectedSettings = {
  stability: WARM_NARRATION_SETTINGS.stability,
  similarityBoost: WARM_NARRATION_SETTINGS.similarity_boost,
  style: WARM_NARRATION_SETTINGS.style,
  speed: WARM_NARRATION_SETTINGS.speed,
  useSpeakerBoost: WARM_NARRATION_SETTINGS.use_speaker_boost,
};
const stories = STORIES.filter(story =>
  (!season || story.seasonId === season) && story.order <= throughOrder
);
const failures = [];
let audioBytes = 0;
let billedCharacters = 0;
let pageCount = 0;

for (const story of stories) {
  const manifest = await readManifest(path.join(root, story.id, 'manifest.json'));
  if (!manifest) {
    failures.push(`${story.id}: manifesto ausente ou inválido`);
    continue;
  }
  if (
    manifest.provider !== 'elevenlabs'
    || !isApprovedVoice(manifest.voiceId)
    || manifest.modelId !== 'eleven_multilingual_v2'
    || JSON.stringify(manifest.voiceSettings) !== JSON.stringify(expectedSettings)
  ) {
    failures.push(`${story.id}: configuração de voz divergente`);
  }
  const expectedPages = story.chapters.flatMap(chapter =>
    ['5-7', '8-10'].flatMap(ageBand =>
      chapter.pages[ageBand].map((text, pageIndex) => ({ chapter, ageBand, text, pageIndex }))
    )
  );
  if (manifest.pages.length !== expectedPages.length) {
    failures.push(`${story.id}: ${manifest.pages.length}/${expectedPages.length} páginas`);
  }
  for (const expected of expectedPages) {
    const page = manifest.pages.find(candidate =>
      candidate.chapterId === expected.chapter.id
      && candidate.ageBand === expected.ageBand
      && candidate.pageIndex === expected.pageIndex
    );
    if (!page) {
      failures.push(`${story.id}: página ausente ${expected.ageBand}/${expected.chapter.id}/${expected.pageIndex + 1}`);
      continue;
    }
    const audioPath = path.join(root, story.id, page.file);
    if (page.contentHash !== contentHash(expected.text)) failures.push(`${story.id}/${page.file}: hash divergente`);
    if (!existsSync(audioPath)) {
      failures.push(`${story.id}/${page.file}: MP3 ausente`);
      continue;
    }
    const audio = await readFile(audioPath);
    const isMp3 = audio.subarray(0, 3).toString('ascii') === 'ID3'
      || (audio[0] === 0xff && (audio[1] & 0xe0) === 0xe0);
    if (!isMp3 || audio.length < 1_000) failures.push(`${story.id}/${page.file}: MP3 inválido`);
    if (!(page.durationMs > 0) || !Array.isArray(page.cues) || page.cues.length === 0) {
      failures.push(`${story.id}/${page.file}: duração/cues inválidos`);
    }
    if (!Number.isInteger(page.characterCost) || page.characterCost < 1) {
      failures.push(`${story.id}/${page.file}: character-cost ausente`);
    }
    for (const cue of page.cues) {
      if (
        expected.text.slice(cue.characterStart, cue.characterEnd) !== cue.text
        || cue.startMs < 0
        || cue.endMs < cue.startMs
      ) failures.push(`${story.id}/${page.file}: cue inválido`);
    }
    pageCount++;
    audioBytes += audio.length;
    billedCharacters += page.characterCost;
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Áudio válido: ${stories.length} histórias · ${pageCount} páginas · ${billedCharacters} caracteres · ${audioBytes} bytes`);
