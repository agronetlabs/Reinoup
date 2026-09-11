import { describe, expect, test } from 'bun:test';
import { STORIES } from '../src/content/stories';
import { AUDIO_PILOT_STORY_ID, choiceAudioSegments, quizAudioSegments, storyAudioInventory, summaryAudioSegments } from '../shared/story-audio-segments';
import { audioAssetMatches, isStoryAudioManifest, storyAudioContentHash, type StoryAudioManifest, type StoryAudioSegment } from '../shared/story-audio-manifest';
import { clearStoryAudioManifestCache, getStoryAudioPageUrl, loadStoryAudioSegment } from '../src/lib/story-audio';
import { attachAudioLifecycle, createStoryAudioPlayer, type PlaybackState } from '../src/lib/story-audio-player';
import { selectAudioSources } from '../scripts/lib/story-audio-selection.mjs';
import { alignmentToCues, retainedAudioEntries } from '../scripts/lib/story-audio-generator.mjs';
import { WITHDRAWN_VOICE_IDS } from '../shared/voice-policy';

const story = STORIES.find(item => item.id === AUDIO_PILOT_STORY_ID)!;
const choice = story.chapters.find(item => item.choice)!;
const inventory = ['5-7', '8-10'].flatMap(age => storyAudioInventory(story, age as '5-7' | '8-10'));
const source = summaryAudioSegments(story, '5-7')[1];
const settings = { stability: 0.42, similarityBoost: 0.78, style: 0.45, speed: 0.92, useSpeakerBoost: true };
const asset: StoryAudioSegment = {
  storyId: story.id, segmentId: source.segmentId, ageBand: source.ageBand, role: source.role,
  voiceId: 'test-only-voice', modelId: 'test-model', voiceSettings: settings,
  file: `5-7/segments/${source.segmentId}.mp3`, contentHash: storyAudioContentHash(source.text),
  durationMs: 1000, cues: [{ text: source.text, startMs: 0, endMs: 1000, characterStart: 0, characterEnd: source.text.length }],
};
const manifest: StoryAudioManifest = { version: 2, storyId: story.id, generatedAt: '2026-09-11T12:00:00Z', provider: 'elevenlabs', pages: [], segments: [asset] };
const approveTestVoice = (voice: unknown): voice is string => voice === 'test-only-voice';

describe('pilot static segment mapping', () => {
  test('has stable unique IDs, preserves pages, and shares one positive phrase per age', () => {
    expect(inventory).toHaveLength(130);
    expect(inventory.filter(item => item.pageIndex !== undefined)).toHaveLength(16);
    expect(inventory.filter(item => item.segmentId === 'quiz-positive-feedback')).toHaveLength(2);
    expect(new Set(inventory.map(item => `${item.ageBand}:${item.segmentId}`)).size).toBe(130);
    expect(inventory.reduce((sum, item) => sum + item.text.length, 0)).toBe(7928);
    expect(inventory.find(item => item.segmentId === 'gn-02-c1-p1' && item.ageBand === '5-7')?.text)
      .not.toBe(inventory.find(item => item.segmentId === 'gn-02-c1-p1' && item.ageBand === '8-10')?.text);
  });
  test('no guide surfaces for other stories', () => {
    const other = STORIES.find(item => item.id !== story.id)!;
    expect(storyAudioInventory(other, '5-7').every(item => item.pageIndex !== undefined)).toBe(true);
    expect(quizAudioSegments(other.id, story.quiz[0], '5-7')).toEqual([]);
    expect(choiceAudioSegments(other.id, choice, '5-7')).toEqual([]);
    expect(summaryAudioSegments(other, '5-7')).toEqual([]);
  });
  test('before answering quiz exposes only question and unmarked options', () => {
    for (const question of story.quiz) {
      const before = quizAudioSegments(story.id, question, '5-7');
      expect(before.map(item => item.text)).toEqual([question.question, ...question.options]);
      expect(before.every(item => item.role === 'challenge')).toBe(true);
      expect(before.some(item => item.text === question.explanation)).toBe(false);
      expect(JSON.stringify(before)).not.toContain('correctIndex');
      const correct = quizAudioSegments(story.id, question, '5-7', question.correctIndex);
      expect(correct.map(item => item.role)).toEqual(['mascot', 'explanation']);
      const retry = quizAudioSegments(story.id, question, '5-7', (question.correctIndex + 1) % question.options.length);
      expect(retry.map(item => item.text)).toEqual([question.explanation]);
      expect(quizAudioSegments(story.id, question, '5-7', -1)).toEqual([]);
    }
  });
  test('choice feedback is available only for the selected answer', () => {
    expect(choiceAudioSegments(story.id, choice, '8-10').map(item => item.text))
      .toEqual([choice.choice!.question, ...choice.choice!.options.map(item => item.text)]);
    choice.choice!.options.forEach((option, index) => {
      expect(choiceAudioSegments(story.id, choice, '8-10', index).map(item => item.text)).toEqual([option.feedback]);
    });
    expect(choiceAudioSegments(story.id, choice, '8-10', 999)).toEqual([]);
  });
});

describe('manifest safety and compatibility', () => {
  test('v2 requires exact role authorization; production remains closed', () => {
    expect(isStoryAudioManifest(manifest, story.id)).toBe(true);
    expect(audioAssetMatches(asset, source, manifest, approveTestVoice)).toBe(true);
    expect(audioAssetMatches(asset, source, manifest)).toBe(false);
    expect(audioAssetMatches({ ...asset, role: 'mascot' }, source, manifest, approveTestVoice)).toBe(false);
    expect(getStoryAudioPageUrl(asset)).toBeUndefined();
  });
  test('v1 narrator pages still validate without converting their path or text', () => {
    const pageSource = inventory[0];
    const page = { ...asset, chapterId: pageSource.chapterId!, pageIndex: 0, contentHash: storyAudioContentHash(pageSource.text),
      file: `5-7/${pageSource.segmentId}.mp3`, cues: [{ ...asset.cues[0], text: pageSource.text, characterEnd: pageSource.text.length }] };
    const legacy = { ...manifest, version: 1 as const, voiceId: asset.voiceId, modelId: asset.modelId, voiceSettings: settings, pages: [page], segments: undefined };
    expect(isStoryAudioManifest(legacy, story.id)).toBe(true);
    expect(audioAssetMatches(page, pageSource, legacy, approveTestVoice)).toBe(true);
    expect(audioAssetMatches(asset, source, legacy, approveTestVoice)).toBe(false);
    expect(audioAssetMatches(page, pageSource, legacy)).toBe(false);
    const retained = retainedAudioEntries(legacy, inventory, () => true, approveTestVoice);
    expect(retained).toHaveLength(1);
    expect(retained[0].file).toBe(page.file);
    expect(retained[0].cues).toEqual(page.cues);
    expect(retained[0].voiceId).toBe(legacy.voiceId);
    expect(retainedAudioEntries(legacy, inventory, () => true)).toEqual([]);
    expect(retainedAudioEntries(legacy, inventory, () => false, approveTestVoice)).toEqual([]);
  });
  test('rejects malformed, duplicate, foreign and traversal manifest entries', () => {
    for (const file of ['../escape.mp3', '/abs.mp3', 'https://host/audio.mp3', '5-7\\bad.mp3', '5-7/%2e%2e/bad.mp3', '5-7/a.mp3?x']) {
      expect(isStoryAudioManifest({ ...manifest, segments: [{ ...asset, file }] }, story.id)).toBe(false);
    }
    expect(isStoryAudioManifest({ ...manifest, pages: null }, story.id)).toBe(false);
    expect(isStoryAudioManifest({ ...manifest, segments: [null] }, story.id)).toBe(false);
    expect(isStoryAudioManifest({ ...manifest, segments: [asset, asset] }, story.id)).toBe(false);
    expect(isStoryAudioManifest({ ...manifest, storyId: 'other' }, story.id)).toBe(false);
    expect(isStoryAudioManifest({ ...manifest, generatedAt: 'not-date' }, story.id)).toBe(false);
  });
  test('rejects stale content and malformed or incomplete cues/settings', () => {
    expect(audioAssetMatches(asset, { ...source, text: 'Mudou.' }, manifest, approveTestVoice)).toBe(false);
    const invalid = [
      { startMs: -1 }, { startMs: Number.NaN }, { endMs: 1001 }, { endMs: 0 },
      { characterStart: -1 }, { characterEnd: source.text.length + 1 }, { characterEnd: 1.2 },
      { text: 'outro texto' }, { text: source.text.slice(1), characterStart: 1 },
    ];
    for (const change of invalid) expect(audioAssetMatches({ ...asset, cues: [{ ...asset.cues[0], ...change }] }, source, manifest, approveTestVoice)).toBe(false);
    expect(audioAssetMatches({ ...asset, cues: [asset.cues[0], asset.cues[0]] }, source, manifest, approveTestVoice)).toBe(false);
    expect(audioAssetMatches({ ...asset, voiceSettings: { ...settings, speed: Number.NaN } }, source, manifest, approveTestVoice)).toBe(false);
  });
  test('cache never grants a withdrawn or unreviewed segment voice', async () => {
    for (const voiceId of [WITHDRAWN_VOICE_IDS[0], 'unreviewed']) {
      clearStoryAudioManifestCache();
      let calls = 0;
      const fetcher = async () => { calls++; return new Response(JSON.stringify({ ...manifest, segments: [{ ...asset, voiceId }] })); };
      expect(await loadStoryAudioSegment(source, fetcher)).toBeNull();
      expect(await loadStoryAudioSegment(source, fetcher)).toBeNull();
      expect(calls).toBe(1);
    }
  });
  test('malformed alignment is rejected and astral characters keep UTF-16 offsets', () => {
    expect(alignmentToCues({ characters: ['a'], character_start_times_seconds: [], character_end_times_seconds: [1] })).toEqual([]);
    expect(alignmentToCues({ characters: ['a', 'b'], character_start_times_seconds: [0, .1], character_end_times_seconds: [.2, .3] })).toEqual([]);
    expect(alignmentToCues({ characters: ['🌟', ' ', 'a'], character_start_times_seconds: [0, .1, .2], character_end_times_seconds: [.1, .2, .3] })[1].characterStart).toBe(3);
  });
});

describe('CLI selection and dry-run', () => {
  test('exact selectors reject missing, unknown or empty values rather than widening production', () => {
    for (const args of [['--story'], ['--story', ''], ['--story', 'gn-02'], ['--season', 'unknown'], ['--chapter', 'unknown'],
      ['--page', '1'], ['--through-order', '6'], ['--scope', 'other'], ['--bad'], ['--age', 'pt-BR'], ['--story', story.id, '--story', story.id]]) {
      expect(() => selectAudioSources(STORIES, args)).toThrow();
    }
    expect(selectAudioSources(STORIES, ['--story', story.id, '--scope', 'pages']).sources).toHaveLength(16);
    expect(selectAudioSources(STORIES, ['--story', story.id, '--scope', 'segments']).sources).toHaveLength(114);
    expect(selectAudioSources(STORIES, ['--story', story.id, '--age', '8-10', '--chapter', 'gn-02-c1', '--page', '2']).sources).toHaveLength(1);
  });
  test('generator and validator inventory are identical, deterministic, keyless and voice-independent', () => {
    const run = (script: string, args: string[]) => Bun.spawnSync([process.execPath, `scripts/${script}-story-audio.mjs`, ...args], {
      cwd: import.meta.dir + '\\..', env: { ...process.env, ELEVENLABS_API_KEY: '', ELEVENLABS_VOICE_ID: WITHDRAWN_VOICE_IDS[0] },
    });
    const args = ['--dry-run', '--story', story.id];
    const generated = run('generate', args);
    const validated = run('validate', args);
    expect(generated.exitCode).toBe(0);
    expect(validated.exitCode).toBe(0);
    expect(generated.stdout.toString()).toBe(validated.stdout.toString());
    expect(run('generate', args).stdout.toString()).toBe(generated.stdout.toString());
    expect(generated.stdout.toString()).toContain('130 entradas · 16 páginas · 114 segmentos · 7928');
    expect(run('generate', ['--story', story.id]).exitCode).toBe(1);
    expect(run('validate', ['--dry-run', '--story', 'unknown']).exitCode).toBe(1);
  });
});

describe('shared player lifecycle', () => {
  function player() {
    const states: PlaybackState[] = [];
    let cancels = 0;
    const instance = createStoryAudioPlayer(() => { throw new Error('No approved MP3 expected'); },
      { speak() {}, cancel() { cancels++; }, pause() {}, resume() {} }, state => states.push(state));
    return { instance, states, cancels: () => cancels };
  }
  test('another segment stops a paused player; stale resume cannot overlap', () => {
    const first = player(); const second = player();
    first.instance.play({ text: 'Pergunta' }); first.instance.pause();
    second.instance.play({ text: 'Opção' });
    first.instance.resume();
    expect(first.cancels()).toBe(1);
    expect(first.states.at(-1)?.isPaused).toBe(false);
    expect(second.states.at(-1)?.isPlaying).toBe(true);
    first.instance.dispose(); second.instance.dispose();
  });
  test('visibility and pagehide stop playback without automatic resume and detach cleanly', () => {
    const f = player();
    const page = new EventTarget();
    const visibility = Object.assign(new EventTarget(), { hidden: false });
    const detach = attachAudioLifecycle(f.instance, page, visibility);
    f.instance.play({ text: 'Pergunta' });
    visibility.hidden = true; visibility.dispatchEvent(new Event('visibilitychange'));
    expect(f.states.at(-1)?.isPlaying).toBe(false);
    visibility.hidden = false; visibility.dispatchEvent(new Event('visibilitychange'));
    f.instance.resume();
    expect(f.states.at(-1)?.isPlaying).toBe(false);
    f.instance.play({ text: 'Opção' }); page.dispatchEvent(new Event('pagehide'));
    expect(f.cancels()).toBe(2);
    detach(); f.instance.dispose();
    const count = f.states.length;
    page.dispatchEvent(new Event('pagehide'));
    expect(f.states).toHaveLength(count);
  });
});
