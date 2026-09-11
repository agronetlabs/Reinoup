import type { AgeBand } from '../content/types';
import type { AudioSegmentSource } from '../../shared/story-audio-segments';
import { isApprovedVoiceForRole } from '../../shared/voice-policy';
import {
  audioAssetMatches, isStoryAudioManifest,
  type StoryAudioManifest, type StoryAudioPage, type StoryAudioSegment,
} from '../../shared/story-audio-manifest';
export { storyAudioContentHash } from '../../shared/story-audio-manifest';
export type { StoryAudioCue, StoryAudioPage, StoryAudioSegment, StoryAudioManifest } from '../../shared/story-audio-manifest';

const rawBase = import.meta.env?.BASE_URL || '/';
const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;
const manifestCache = new Map<string, Promise<StoryAudioManifest | null>>();

export function getStoryAudioPath(storyId: string, chapterId: string, pageIndex: number, ageBand: AgeBand): string {
  return `${base}audio/stories/${storyId}/${ageBand}/${chapterId}-p${pageIndex + 1}.mp3`;
}
export function getStoryAudioManifestPath(storyId: string): string {
  return `${base}audio/stories/${storyId}/manifest.json`;
}
async function loadManifest(storyId: string, fetchManifest: typeof fetch): Promise<StoryAudioManifest | null> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(storyId)) return null;
  let pending = manifestCache.get(storyId);
  if (!pending) {
    pending = fetchManifest(getStoryAudioManifestPath(storyId), { cache: 'force-cache' })
      .then(async response => {
        if (!response.ok) return null;
        const manifest: unknown = await response.json();
        return isStoryAudioManifest(manifest, storyId) ? manifest : null;
      }).catch(() => null);
    manifestCache.set(storyId, pending);
  }
  const manifest = await pending;
  if (!manifest) manifestCache.delete(storyId);
  return manifest;
}

export async function loadStoryAudioPage(storyId: string, chapterId: string, pageIndex: number, ageBand: AgeBand, text: string, fetchManifest: typeof fetch = fetch): Promise<StoryAudioPage | null> {
  const manifest = await loadManifest(storyId, fetchManifest);
  const page = manifest?.pages.find(candidate => candidate.chapterId === chapterId && candidate.pageIndex === pageIndex && candidate.ageBand === ageBand);
  const source: AudioSegmentSource = { storyId, chapterId, pageIndex, segmentId: `${chapterId}-p${pageIndex + 1}`, ageBand, text, role: 'narration' };
  return manifest && page && audioAssetMatches(page, source, manifest)
    ? manifest.version === 1 ? { ...page, role: 'narration', voiceId: manifest.voiceId } : page
    : null;
}
export async function loadStoryAudioSegment(source: AudioSegmentSource, fetchManifest: typeof fetch = fetch): Promise<StoryAudioSegment | null> {
  const manifest = await loadManifest(source.storyId, fetchManifest);
  const asset = manifest?.version === 2 ? manifest.segments?.find(candidate => candidate.segmentId === source.segmentId && candidate.ageBand === source.ageBand) : null;
  return manifest && asset && audioAssetMatches(asset, source, manifest) ? asset : null;
}
export function getStoryAudioPageUrl(page: StoryAudioPage | StoryAudioSegment): string | undefined {
  return page.role && isApprovedVoiceForRole(page.voiceId, page.role)
    ? `${base}audio/stories/${page.storyId}/${page.file}` : undefined;
}
export function clearStoryAudioManifestCache(): void {
  manifestCache.clear();
}
