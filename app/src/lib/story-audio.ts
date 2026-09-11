import type { AgeBand } from '../content/types';
import { isApprovedVoice } from '../../shared/voice-policy';

const rawBase = import.meta.env?.BASE_URL || '/';
const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

export interface StoryAudioCue {
  text: string;
  startMs: number;
  endMs: number;
  characterStart: number;
  characterEnd: number;
}

export interface StoryAudioPage {
  storyId: string;
  chapterId: string;
  pageIndex: number;
  ageBand: AgeBand;
  contentHash: string;
  file: string;
  durationMs: number;
  characterCost?: number;
  cues: StoryAudioCue[];
}

export interface StoryAudioManifest {
  version: 1;
  storyId: string;
  generatedAt: string;
  provider: 'elevenlabs';
  modelId: string;
  voiceId: string;
  voiceSettings?: {
    stability: number;
    similarityBoost: number;
    style: number;
    speed: number;
    useSpeakerBoost: boolean;
  };
  pages: StoryAudioPage[];
}

const manifestCache = new Map<string, Promise<StoryAudioManifest | null>>();

export function storyAudioContentHash(text: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `fnv1a32-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

export function getStoryAudioPath(
  storyId: string,
  chapterId: string,
  pageIndex: number,
  ageBand: AgeBand
): string {
  return `${base}audio/stories/${storyId}/${ageBand}/${chapterId}-p${pageIndex + 1}.mp3`;
}

export function getStoryAudioManifestPath(storyId: string): string {
  return `${base}audio/stories/${storyId}/manifest.json`;
}

export async function loadStoryAudioPage(
  storyId: string,
  chapterId: string,
  pageIndex: number,
  ageBand: AgeBand,
  text: string,
  fetchManifest: typeof fetch = fetch,
): Promise<StoryAudioPage | null> {
  let pending = manifestCache.get(storyId);
  if (!pending) {
    pending = fetchManifest(getStoryAudioManifestPath(storyId), { cache: 'force-cache' })
      .then(async response => {
        if (!response.ok) return null;
        const manifest = await response.json() as StoryAudioManifest;
        return manifest.version === 1 && manifest.storyId === storyId
          && isApprovedVoice(manifest.voiceId) ? manifest : null;
      })
      .catch(() => null);
    manifestCache.set(storyId, pending);
  }
  const manifest = await pending;
  if (!manifest) manifestCache.delete(storyId);
  if (!manifest || !isApprovedVoice(manifest.voiceId)) return null;
  const page = manifest?.pages.find(candidate =>
    candidate.chapterId === chapterId
    && candidate.pageIndex === pageIndex
    && candidate.ageBand === ageBand
  );
  return page?.contentHash === storyAudioContentHash(text) ? page : null;
}

export function getStoryAudioPageUrl(page: StoryAudioPage): string {
  return `${base}audio/stories/${page.storyId}/${page.file}`;
}

export function clearStoryAudioManifestCache(): void {
  manifestCache.clear();
}
