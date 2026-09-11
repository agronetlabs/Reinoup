import type { AgeBand } from '../src/content/types';
import { isApprovedVoiceForRole, type VoiceRole } from './voice-policy';
import type { AudioSegmentSource } from './story-audio-segments';

export interface StoryAudioCue {
  text: string;
  startMs: number;
  endMs: number;
  characterStart: number;
  characterEnd: number;
}
export interface VoiceSettings {
  stability: number;
  similarityBoost: number;
  style: number;
  speed: number;
  useSpeakerBoost: boolean;
}
export interface StoryAudioAsset {
  storyId: string;
  ageBand: AgeBand;
  contentHash: string;
  file: string;
  durationMs: number;
  characterCost?: number;
  cues: StoryAudioCue[];
}
export interface StoryAudioPage extends StoryAudioAsset {
  chapterId: string;
  pageIndex: number;
  role?: 'narration';
  voiceId?: string;
  modelId?: string;
  voiceSettings?: VoiceSettings;
}
export interface StoryAudioSegment extends StoryAudioAsset {
  segmentId: string;
  role: VoiceRole;
  voiceId: string;
  modelId: string;
  voiceSettings: VoiceSettings;
}
export interface StoryAudioManifest {
  version: 1 | 2;
  storyId: string;
  generatedAt: string;
  provider: 'elevenlabs';
  modelId?: string;
  voiceId?: string;
  voiceSettings?: VoiceSettings;
  pages: StoryAudioPage[];
  segments?: StoryAudioSegment[];
}

export function storyAudioContentHash(text: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `fnv1a32-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const id = (value: unknown): value is string => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
const positive = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0;
function isVoiceSettings(value: unknown): value is VoiceSettings {
  return record(value) && ['stability', 'similarityBoost', 'style'].every(key =>
    typeof value[key] === 'number' && Number.isFinite(value[key]) && value[key] >= 0 && value[key] <= 1)
    && positive(value.speed) && typeof value.useSpeakerBoost === 'boolean';
}
export function isStoryAudioManifest(value: unknown, storyId: string): value is StoryAudioManifest {
  if (!record(value) || !id(storyId) || value.storyId !== storyId
    || (value.version !== 1 && value.version !== 2) || value.provider !== 'elevenlabs'
    || typeof value.generatedAt !== 'string' || !Number.isFinite(Date.parse(value.generatedAt))
    || !Array.isArray(value.pages)
    || (value.version === 2 && !Array.isArray(value.segments))
    || (value.version === 1 && value.segments !== undefined)) return false;
  const pages = value.pages;
  const entries = [...pages, ...(value.version === 2 ? value.segments as unknown[] : [])];
  const keys = new Set<string>();
  const files = new Set<string>();
  return entries.every(entry => {
    if (!record(entry) || entry.storyId !== storyId || !['5-7', '8-10'].includes(String(entry.ageBand))
      || typeof entry.file !== 'string' || !/^(5-7|8-10)\/(?:segments\/)?[a-z0-9-]+\.mp3$/.test(entry.file)
      || !positive(entry.durationMs) || !Array.isArray(entry.cues) || entry.cues.length === 0
      || typeof entry.contentHash !== 'string' || !/^fnv1a32-[a-f0-9]{8}$/.test(entry.contentHash)) return false;
    const page = pages.includes(entry);
    if (page ? !id(entry.chapterId) || !Number.isInteger(entry.pageIndex) || (entry.pageIndex as number) < 0 : !id(entry.segmentId)) return false;
    const key = `${entry.ageBand}:${page ? `${entry.chapterId}-p${(entry.pageIndex as number) + 1}` : entry.segmentId}`;
    if (keys.has(key) || files.has(entry.file)) return false;
    keys.add(key); files.add(entry.file);
    return true;
  });
}

export function audioAssetMatches(
  asset: StoryAudioPage | StoryAudioSegment,
  source: AudioSegmentSource,
  manifest: StoryAudioManifest,
  authorize = isApprovedVoiceForRole,
): boolean {
  const page = source.pageIndex !== undefined;
  if (manifest.version === 1 && !page) return false;
  const role = manifest.version === 1 ? 'narration' : asset.role;
  const voice = manifest.version === 1 ? manifest.voiceId : asset.voiceId;
  const model = manifest.version === 1 ? manifest.modelId : asset.modelId;
  const settings = manifest.version === 1 ? manifest.voiceSettings : asset.voiceSettings;
  const expectedFile = `${source.ageBand}/${page ? source.segmentId : `segments/${source.segmentId}`}.mp3`;
  if (asset.storyId !== source.storyId || asset.ageBand !== source.ageBand || asset.file !== expectedFile
    || role !== source.role || !authorize(voice, source.role) || typeof model !== 'string' || !model.trim()
    || !isVoiceSettings(settings)
    || asset.contentHash !== storyAudioContentHash(source.text) || !positive(asset.durationMs)
    || !Array.isArray(asset.cues) || asset.cues.length === 0) return false;
  let end = 0;
  let characterEnd = 0;
  for (const cue of asset.cues) {
    if (!record(cue) || !Number.isInteger(cue.characterStart) || !Number.isInteger(cue.characterEnd)
      || cue.characterStart < characterEnd || cue.characterEnd <= cue.characterStart || cue.characterEnd > source.text.length
      || !Number.isFinite(cue.startMs) || !Number.isFinite(cue.endMs) || cue.startMs < end
      || cue.endMs <= cue.startMs || cue.endMs > asset.durationMs
      || source.text.slice(cue.characterStart, cue.characterEnd) !== cue.text
      || !cue.text.trim() || source.text.slice(characterEnd, cue.characterStart).trim()) return false;
    end = cue.endMs; characterEnd = cue.characterEnd;
  }
  return !source.text.slice(characterEnd).trim();
}
