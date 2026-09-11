import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { STORIES } from '../src/content/stories.ts';
import { assertApprovedVoiceForRole } from '../shared/voice-policy.ts';
import { audioAssetMatches, storyAudioContentHash } from '../shared/story-audio-manifest.ts';
import { storyAudioInventory } from '../shared/story-audio-segments.ts';
import { selectAudioSources, printAudioInventory } from './lib/story-audio-selection.mjs';
import { MANIFEST_VERSION, WARM_NARRATION_SETTINGS, readManifest, retainedAudioEntries, requestNarration, writeManifestAtomic } from './lib/story-audio-generator.mjs';

const { sources, dryRun, force } = selectAudioSources(STORIES, process.argv.slice(2), { generation: true });
if (dryRun) {
  printAudioInventory(sources);
} else {
  const voiceForRole = role => process.env[role === 'narration' ? 'ELEVENLABS_VOICE_ID' : `ELEVENLABS_${role.toUpperCase()}_VOICE_ID`];
  // Validate the entire selection before the first paid request or local write.
  for (const role of new Set(sources.map(source => source.role))) assertApprovedVoiceForRole(voiceForRole(role), role);
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY ausente. Use --dry-run sem consumir créditos.');
  const modelId = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/audio/stories');
  const voiceSettings = {
    stability: WARM_NARRATION_SETTINGS.stability, similarityBoost: WARM_NARRATION_SETTINGS.similarity_boost,
    style: WARM_NARRATION_SETTINGS.style, speed: WARM_NARRATION_SETTINGS.speed,
    useSpeakerBoost: WARM_NARRATION_SETTINGS.use_speaker_boost,
  };
  let generated = 0;
  let skipped = 0;
  for (const storyId of new Set(sources.map(source => source.storyId))) {
    const storyDir = path.join(root, storyId);
    const manifestPath = path.join(storyDir, 'manifest.json');
    const previous = await readManifest(manifestPath);
    const story = STORIES.find(candidate => candidate.id === storyId);
    const allSources = ['5-7', '8-10'].flatMap(age => storyAudioInventory(story, age));
    // Upgrade v1 metadata without regenerating approved, matching narrator files.
    const manifest = { version: MANIFEST_VERSION, storyId, provider: 'elevenlabs', generatedAt: new Date().toISOString(), pages: [], segments: [] };
    const current = retainedAudioEntries(previous, allSources, file => existsSync(path.join(storyDir, file)));
    for (const source of sources.filter(item => item.storyId === storyId)) {
      const file = `${source.ageBand}/${source.pageIndex !== undefined ? source.segmentId : `segments/${source.segmentId}`}.mp3`;
      const voiceId = voiceForRole(source.role);
      const old = current.find(asset => asset.file === file);
      if (!force && old?.voiceId === voiceId && old.modelId === modelId && JSON.stringify(old.voiceSettings) === JSON.stringify(voiceSettings)) {
        skipped++; continue;
      }
      assertApprovedVoiceForRole(voiceId, source.role);
      const narration = await requestNarration({ apiKey, voiceId, modelId, text: source.text });
      const asset = {
        storyId, ageBand: source.ageBand, role: source.role, voiceId, modelId, voiceSettings,
        ...(source.pageIndex !== undefined ? { chapterId: source.chapterId, pageIndex: source.pageIndex } : { segmentId: source.segmentId }),
        contentHash: storyAudioContentHash(source.text), file, durationMs: narration.durationMs, cues: narration.cues,
        ...(narration.characterCost === null ? {} : { characterCost: narration.characterCost }),
      };
      if (!audioAssetMatches(asset, source, manifest)) throw new Error(`Áudio inválido: ${source.segmentId}`);
      await mkdir(path.dirname(path.join(storyDir, file)), { recursive: true });
      await writeFile(path.join(storyDir, file), narration.audio);
      const oldIndex = current.findIndex(entry => entry.file === file);
      if (oldIndex >= 0) current.splice(oldIndex, 1);
      current.push(asset); generated++;
    }
    manifest.pages = current.filter(asset => asset.pageIndex !== undefined);
    manifest.segments = current.filter(asset => asset.segmentId !== undefined);
    await writeManifestAtomic(manifestPath, manifest);
  }
  console.log(`Concluído: ${generated} geradas; ${skipped} já estavam atuais.`);
}
