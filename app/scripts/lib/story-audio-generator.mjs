import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { audioAssetMatches, isStoryAudioManifest } from '../../shared/story-audio-manifest.ts';

export const MANIFEST_VERSION = 2;
export const WARM_NARRATION_SETTINGS = Object.freeze({
  stability: 0.42,
  similarity_boost: 0.78,
  style: 0.45,
  speed: 0.92,
  use_speaker_boost: true,
});

export function contentHash(text) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `fnv1a32-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

export function alignmentToCues(alignment) {
  const characters = alignment?.characters;
  const starts = alignment?.character_start_times_seconds;
  const ends = alignment?.character_end_times_seconds;
  if (!Array.isArray(characters) || !Array.isArray(starts) || !Array.isArray(ends)) return [];
  if (characters.length !== starts.length || characters.length !== ends.length
    || characters.some(character => typeof character !== 'string' || !character.length)
    || starts.some((start, index) => !Number.isFinite(start) || start < 0
      || !Number.isFinite(ends[index]) || ends[index] < start
      || (index > 0 && start < ends[index - 1]))) return [];

  const cues = [];
  let wordStart = -1;
  const offsets = [0];
  for (const character of characters) offsets.push(offsets.at(-1) + character.length);
  for (let index = 0; index <= characters.length; index++) {
    const character = characters[index];
    const isBoundary = index === characters.length || /\s/.test(character);
    if (wordStart < 0 && !isBoundary) wordStart = index;
    if (wordStart >= 0 && isBoundary) {
      cues.push({
        text: characters.slice(wordStart, index).join(''),
        startMs: Math.round(Number(starts[wordStart]) * 1000),
        endMs: Math.round(Number(ends[index - 1]) * 1000),
        characterStart: offsets[wordStart],
        characterEnd: offsets[index],
      });
      wordStart = -1;
    }
  }
  return cues.filter(cue =>
    cue.text.length > 0
    && Number.isFinite(cue.startMs)
    && Number.isFinite(cue.endMs)
    && cue.endMs >= cue.startMs
  );
}

export async function requestNarration({
  apiKey,
  voiceId,
  modelId,
  text,
  fetchImpl = fetch,
  retries = 3,
  voiceSettings = WARM_NARRATION_SETTINGS,
}) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}/with-timestamps?output_format=mp3_44100_128`;
  for (let attempt = 0; ; attempt++) {
    const response = await fetchImpl(url, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: voiceSettings,
      }),
    });
    if (response.ok) {
      const payload = await response.json();
      if (!payload.audio_base64) throw new Error('ElevenLabs não retornou audio_base64');
      const alignment = payload.alignment ?? payload.normalized_alignment;
      const cues = alignmentToCues(alignment);
      if (!cues.length || alignment.characters.join('') !== text) throw new Error('Alinhamento inválido ou divergente do texto versionado');
      const durationMs = cues.at(-1)?.endMs ?? 0;
      const rawCharacterCost = response.headers.get('character-cost');
      const characterCost = rawCharacterCost === null ? null : Number(rawCharacterCost);
      return {
        audio: Buffer.from(payload.audio_base64, 'base64'),
        cues,
        durationMs,
        characterCost: Number.isFinite(characterCost) ? characterCost : null,
      };
    }
    const details = (await response.text()).slice(0, 500);
    const retryable = response.status === 429 || response.status >= 500;
    if (!retryable || attempt >= retries) {
      throw new Error(`ElevenLabs ${response.status}: ${details}`);
    }
    const retryAfter = Number(response.headers.get('retry-after'));
    const delayMs = Number.isFinite(retryAfter) ? retryAfter * 1000 : 500 * (2 ** attempt);
    await Bun.sleep(delayMs);
  }
}

export async function readManifest(filePath) {
  try {
    const parsed = JSON.parse(await readFile(filePath, 'utf8'));
    return isStoryAudioManifest(parsed, path.basename(path.dirname(filePath))) ? parsed : null;
  } catch {
    return null;
  }
}

export function retainedAudioEntries(previous, sources, fileExists, authorize) {
  if (!previous) return [];
  const upgraded = [...previous.pages, ...(previous.segments ?? [])].map(asset =>
    previous.version === 1 ? { ...asset, role: 'narration', voiceId: previous.voiceId, modelId: previous.modelId, voiceSettings: previous.voiceSettings } : asset);
  return upgraded.filter(asset => {
    const source = sources.find(item => item.ageBand === asset.ageBand && (item.pageIndex !== undefined
      ? item.chapterId === asset.chapterId && item.pageIndex === asset.pageIndex : item.segmentId === asset.segmentId));
    return source && audioAssetMatches(asset, source, { ...previous, version: 2 }, authorize) && fileExists(asset.file);
  });
}

export async function writeManifestAtomic(filePath, manifest) {
  await mkdir(path.dirname(filePath), { recursive: true });
  const pendingPath = `${filePath}.new`;
  await writeFile(pendingPath, `${JSON.stringify(manifest, null, 2)}\n`);
  await rename(pendingPath, filePath);
}
