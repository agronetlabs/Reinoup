import { describe, expect, test } from 'bun:test';
import { createStoryAudioPlayer, idlePlayback, type PlaybackState } from '../src/lib/story-audio-player';
import { BRAZILIAN_VOICE_UNAVAILABLE, pickBrazilianVoice } from '../src/lib/brazilian-voice';
import { assertApprovedVoice, isApprovedVoice, WITHDRAWN_VOICE_IDS } from '../shared/voice-policy';
import {
  clearStoryAudioManifestCache,
  loadStoryAudioPage,
  storyAudioContentHash,
} from '../src/lib/story-audio';
import {
  WARM_NARRATION_SETTINGS,
  alignmentToCues,
  contentHash,
  requestNarration,
} from '../scripts/lib/story-audio-generator.mjs';

class FakeAudio extends EventTarget {
  pending = Promise.withResolvers<void>();
  currentTime = 0;
  duration = Number.NaN;
  pauses = 0;
  plays = 0;
  loads = 0;
  removed: string[] = [];
  play() { this.plays++; return this.pending.promise; }
  pause() { this.pauses++; }
  load() { this.loads++; }
  removeAttribute(name: string) { this.removed.push(name); }
  emit(name: string) { this.dispatchEvent(new Event(name)); }
}

function fixture(supported = true) {
  const audios: FakeAudio[] = [];
  const speechCalls: { text: string; end: () => void; error: (message?: string) => void; progress: (value: number) => void }[] = [];
  let cancellations = 0;
  let speechPauses = 0;
  let speechResumes = 0;
  const states: PlaybackState[] = [];
  const player = createStoryAudioPlayer(() => {
    const audio = new FakeAudio();
    audios.push(audio);
    return audio;
  }, supported ? {
    speak(text, end, error, progress) { speechCalls.push({ text, end, error, progress }); },
    cancel() { cancellations++; },
    pause() { speechPauses++; },
    resume() { speechResumes++; },
  } : null, state => states.push(state));
  return { player, audios, speechCalls, states, cancellations: () => cancellations,
    speechPauses: () => speechPauses, speechResumes: () => speechResumes };
}

describe('story narration lifecycle', () => {
  test('no approved MP3 goes directly to Brazilian speech without requesting a legacy URL', () => {
    const f = fixture();
    f.player.play({ text: 'Uma história' });
    expect(f.audios).toHaveLength(0);
    expect(f.speechCalls).toHaveLength(1);
    expect(f.states.at(-1)?.isStudioAudio).toBe(false);
    f.player.pause();
    f.player.resume();
    expect(f.speechCalls).toHaveLength(1);
    expect(f.speechResumes()).toBe(1);
  });
  test('studio playback ends and releases its media resource', () => {
    const f = fixture();
    f.player.play({ url: '/story.mp3', text: 'História' });
    f.audios[0].emit('play');
    expect(f.states.at(-1)).toEqual({ ...idlePlayback, isPlaying: true, isStudioAudio: true });
    f.audios[0].emit('ended');
    expect(f.states.at(-1)).toEqual(idlePlayback);
    expect(f.audios[0].removed).toEqual(['src']);
    expect(f.audios[0].loads).toBe(1);
    expect(f.speechCalls).toHaveLength(0);
  });

  test('error event and play rejection start only one speech fallback', async () => {
    const f = fixture();
    f.player.play({ url: '/missing.mp3', text: 'Uma história' });
    f.audios[0].emit('error');
    f.audios[0].pending.reject(new Error('Unavailable'));
    await Promise.resolve();
    expect(f.speechCalls).toHaveLength(1);
    expect(f.speechCalls[0].text).toBe('Uma história');
    expect(f.states.at(-1)).toEqual({ ...idlePlayback, isPlaying: true });
    f.speechCalls[0].end();
    expect(f.states.at(-1)).toEqual(idlePlayback);
  });

  test('stop prevents a late play rejection or media event from restarting speech', async () => {
    const f = fixture();
    f.player.play({ url: '/slow.mp3', text: 'História' });
    f.player.stop();
    f.audios[0].pending.reject(new Error('Aborted'));
    f.audios[0].emit('error');
    f.audios[0].emit('play');
    await Promise.resolve();
    expect(f.speechCalls).toHaveLength(0);
    expect(f.states.at(-1)).toEqual(idlePlayback);
    expect(f.audios[0].pauses).toBe(1);
  });

  test('old audio cannot replace a newer page with its fallback', async () => {
    const f = fixture();
    f.player.play({ url: '/old.mp3', text: 'Antiga' });
    f.player.play({ url: '/new.mp3', text: 'Nova' });
    f.audios[1].emit('play');
    f.audios[0].pending.reject(new Error('Old request'));
    await Promise.resolve();
    expect(f.speechCalls).toHaveLength(0);
    expect(f.states.at(-1)?.isStudioAudio).toBe(true);
  });

  test('stale speech callbacks cannot clear a newer narration', () => {
    const f = fixture();
    f.player.play({ url: '/old.mp3', text: 'Antiga' });
    f.audios[0].emit('error');
    f.player.play({ url: '/new.mp3', text: 'Nova' });
    f.audios[1].emit('play');
    f.speechCalls[0].end();
    f.speechCalls[0].error();
    expect(f.cancellations()).toBe(1);
    expect(f.states.at(-1)).toEqual({ ...idlePlayback, isPlaying: true, isStudioAudio: true });
  });

  test('unsupported fallback surfaces a readable error instead of staying busy', () => {
    const f = fixture(false);
    f.player.play({ url: '/missing.mp3', text: 'História' });
    f.audios[0].emit('error');
    expect(f.states.at(-1)?.isPlaying).toBe(false);
    expect(f.states.at(-1)?.error).toContain('não está disponível');
  });

  test('speech errors are surfaced and retry clears them', () => {
    const f = fixture();
    f.player.play({ url: '/missing.mp3', text: 'História' });
    f.audios[0].emit('error');
    f.speechCalls[0].error();
    expect(f.states.at(-1)?.error).toContain('tentar novamente');
    f.player.play({ url: '/retry.mp3', text: 'História' });
    expect(f.states.at(-1)?.error).toBeNull();
  });

  test('missing Brazilian voice is reported and late speech callbacks cannot restart playback', () => {
    const f = fixture();
    f.player.play({ url: '/missing.mp3', text: 'Deus' });
    f.audios[0].emit('error');
    f.speechCalls[0].error(BRAZILIAN_VOICE_UNAVAILABLE);
    f.speechCalls[0].progress(0.5);
    expect(f.states.at(-1)?.isPlaying).toBe(false);
    expect(f.states.at(-1)?.error).toBe(BRAZILIAN_VOICE_UNAVAILABLE);
  });

  test('disposal cancels speech without publishing state after unmount', () => {
    const f = fixture();
    f.player.play({ url: '/missing.mp3', text: 'História' });
    f.audios[0].emit('error');
    const count = f.states.length;
    f.player.dispose();
    f.speechCalls[0].end();
    f.speechCalls[0].error();
    expect(f.states).toHaveLength(count);
    expect(f.cancellations()).toBe(1);
  });

  test('disposal while loading suppresses late fallback', async () => {
    const f = fixture();
    f.player.play({ url: '/slow.mp3', text: 'História' });
    f.player.dispose();
    f.audios[0].pending.reject(new Error('Aborted'));
    await Promise.resolve();
    expect(f.speechCalls).toHaveLength(0);
    expect(f.audios[0].pauses).toBe(1);
  });

  test('publishes timed progress and the active word cue', () => {
    const f = fixture();
    f.player.play({
      url: '/story.mp3',
      text: 'Deus criou',
      durationMs: 2_000,
      cues: [{ text: 'criou', startMs: 900, endMs: 1_500, characterStart: 5, characterEnd: 10 }],
    });
    f.audios[0].emit('play');
    f.audios[0].currentTime = 1;
    f.audios[0].emit('timeupdate');
    expect(f.states.at(-1)?.progress).toBe(0.5);
    expect(f.states.at(-1)?.activeCue?.text).toBe('criou');
  });

  test('pause retains time and cue; resume reuses the same MP3', () => {
    const f = fixture();
    f.player.play({ url: '/story.mp3', text: 'Deus criou', durationMs: 2000,
      cues: [{ text: 'criou', startMs: 900, endMs: 1500, characterStart: 5, characterEnd: 10 }] });
    const audio = f.audios[0];
    audio.emit('play');
    audio.currentTime = 1;
    audio.emit('timeupdate');
    const playing = f.states.at(-1)!;
    f.player.pause();
    f.player.pause();
    expect(f.states.at(-1)).toEqual({ ...playing, isPlaying: false, isPaused: true });
    expect(audio.removed).toEqual([]);
    expect(audio.loads).toBe(0);
    expect(audio.pauses).toBe(1);
    audio.currentTime = 1.2;
    audio.emit('timeupdate');
    expect(f.states.at(-1)?.elapsedMs).toBe(1000);
    f.player.resume();
    f.player.resume();
    audio.emit('play');
    expect(f.audios).toHaveLength(1);
    expect(audio.plays).toBe(2);
    expect(audio.currentTime).toBe(1.2);
    expect(f.states.at(-1)).toEqual(playing);
    audio.emit('timeupdate');
    expect(f.states.at(-1)?.elapsedMs).toBe(1200);
  });

  test('pause during pending play does not trigger speech from the rejected promise', async () => {
    const f = fixture();
    f.player.play({ url: '/slow.mp3', text: 'Deus' });
    f.player.pause();
    f.audios[0].pending.reject(new Error('AbortError caused by pause'));
    await Promise.resolve();
    expect(f.speechCalls).toHaveLength(0);
    expect(f.states.at(-1)?.isPaused).toBe(true);
    f.audios[0].pending = Promise.withResolvers<void>();
    f.player.resume();
    f.audios[0].emit('play');
    expect(f.states.at(-1)?.isPaused).toBe(false);
    expect(f.speechCalls).toHaveLength(0);
  });

  test('error while paused defers speech until resume', () => {
    const f = fixture();
    f.player.play({ url: '/missing.mp3', text: 'Deus' });
    f.player.pause();
    f.audios[0].emit('error');
    expect(f.speechCalls).toHaveLength(0);
    f.player.resume();
    expect(f.speechCalls).toHaveLength(1);
    expect(f.states.at(-1)?.isPlaying).toBe(true);
  });

  test('speech pause and resume preserve the utterance and its progress', () => {
    const f = fixture();
    f.player.play({ url: '/missing.mp3', text: 'Deus criou' });
    f.audios[0].emit('error');
    f.speechCalls[0].progress(0.5);
    f.player.pause();
    f.speechCalls[0].progress(0.7);
    expect(f.states.at(-1)?.progress).toBe(0.5);
    expect(f.states.at(-1)?.isPaused).toBe(true);
    expect(f.speechPauses()).toBe(1);
    expect(f.cancellations()).toBe(0);
    f.player.resume();
    expect(f.speechResumes()).toBe(1);
    expect(f.speechCalls).toHaveLength(1);
    f.speechCalls[0].progress(0.8);
    expect(f.states.at(-1)?.progress).toBe(0.8);
  });

  test('stop while paused releases resources and makes resume inert', () => {
    const f = fixture();
    f.player.play({ url: '/story.mp3', text: 'Deus' });
    f.player.pause();
    f.player.stop();
    f.player.resume();
    expect(f.audios[0].plays).toBe(1);
    expect(f.audios[0].removed).toEqual(['src']);
    expect(f.states.at(-1)).toEqual(idlePlayback);
  });

  test('changing page discards paused speech and ignores its stale callbacks', () => {
    const f = fixture();
    f.player.play({ url: '/missing.mp3', text: 'Antiga' });
    f.audios[0].emit('error');
    f.player.pause();
    f.player.play({ url: '/new.mp3', text: 'Nova' });
    f.audios[1].emit('play');
    f.speechCalls[0].progress(1);
    f.speechCalls[0].end();
    f.player.resume();
    expect(f.cancellations()).toBe(1);
    expect(f.audios[1].plays).toBe(1);
    expect(f.states.at(-1)?.isStudioAudio).toBe(true);
    expect(f.states.at(-1)?.isPaused).toBe(false);
  });

  test('late resume rejection after navigation cannot start an old fallback', async () => {
    const f = fixture();
    f.player.play({ url: '/old.mp3', text: 'Antiga' });
    f.player.pause();
    f.audios[0].pending = Promise.withResolvers<void>();
    f.player.resume();
    f.player.play({ url: '/new.mp3', text: 'Nova' });
    f.audios[0].pending.reject(new Error('Late rejection'));
    await Promise.resolve();
    expect(f.speechCalls).toHaveLength(0);
  });

  test('disposing paused speech cancels it and prevents later resume', () => {
    const f = fixture();
    f.player.play({ url: '/missing.mp3', text: 'Deus' });
    f.audios[0].emit('error');
    f.player.pause();
    const count = f.states.length;
    f.player.dispose();
    f.player.resume();
    expect(f.cancellations()).toBe(1);
    expect(f.speechResumes()).toBe(0);
    expect(f.states).toHaveLength(count);
  });
});

describe('Brazilian Portuguese voice selection', () => {
  test('does not substitute Portuguese from Portugal, unspecified Portuguese or English', () => {
    expect(pickBrazilianVoice([{ lang: 'pt-PT' }, { lang: 'pt' }, { lang: 'en-US' }])).toBeNull();
    expect(pickBrazilianVoice([])).toBeNull();
  });
  test('prefers a local Brazilian voice and accepts case/separator variations', () => {
    const local = { lang: 'PT_br', localService: true };
    const online = { lang: 'pt-BR', localService: false };
    expect(pickBrazilianVoice([online, local])).toBe(local);
    expect(pickBrazilianVoice([online])).toBe(online);
  });
  test('a later voice list can be selected without retaining an empty-list cache', () => {
    expect(pickBrazilianVoice([])).toBeNull();
    const voice = { lang: 'pt-BR' };
    expect(pickBrazilianVoice([voice])).toBe(voice);
  });
});

describe('story narration manifests', () => {
  test('withdrawn and unapproved voices cannot authorize generation or playback', () => {
    expect(isApprovedVoice(undefined)).toBe(false);
    expect(isApprovedVoice('unreviewed-voice')).toBe(false);
    expect(isApprovedVoice(WITHDRAWN_VOICE_IDS[0])).toBe(false);
    expect(() => assertApprovedVoice(WITHDRAWN_VOICE_IDS[0])).toThrow('não autorizada');
    expect(() => assertApprovedVoice(undefined)).toThrow('não autorizada');
  });

  test('a cached manifest with matching text cannot re-enable a withdrawn voice', async () => {
    clearStoryAudioManifestCache();
    const fetchManifest = async () => new Response(JSON.stringify({
      version: 1, storyId: 'gn-02', voiceId: WITHDRAWN_VOICE_IDS[0],
      pages: [{
        storyId: 'gn-02', chapterId: 'jardim', pageIndex: 0, ageBand: '5-7',
        contentHash: storyAudioContentHash('Deus criou'), file: '5-7/jardim-p1.mp3',
        durationMs: 1000, cues: [],
      }],
    }));
    expect(await loadStoryAudioPage('gn-02', 'jardim', 0, '5-7', 'Deus criou', fetchManifest)).toBeNull();
  });

  test('generator and browser use the same content hash', () => {
    expect(contentHash('No princípio, Deus criou.')).toBe(storyAudioContentHash('No princípio, Deus criou.'));
  });

  test('turns character alignment into word cues', () => {
    const cues = alignmentToCues({
      characters: [...'Deus criou'],
      character_start_times_seconds: [0, .1, .2, .3, .4, .5, .6, .7, .8, .9],
      character_end_times_seconds: [.1, .2, .3, .4, .5, .6, .7, .8, .9, 1],
    });
    expect(cues).toEqual([
      { text: 'Deus', startMs: 0, endMs: 400, characterStart: 0, characterEnd: 4 },
      { text: 'criou', startMs: 500, endMs: 1000, characterStart: 5, characterEnd: 10 },
    ]);
  });

  test('decodes timestamp response without exposing the API key', async () => {
    let authorization = '';
    let requestBody: Record<string, unknown> = {};
    const result = await requestNarration({
      apiKey: 'secret-key',
      voiceId: 'voice',
      modelId: 'model',
      text: 'Oi',
      fetchImpl: async (_url: string | URL | Request, init?: RequestInit) => {
        authorization = new Headers(init?.headers).get('xi-api-key') ?? '';
        requestBody = JSON.parse(String(init?.body));
        return new Response(JSON.stringify({
          audio_base64: Buffer.from('audio').toString('base64'),
          normalized_alignment: {
            characters: ['O', 'i'],
            character_start_times_seconds: [0, .1],
            character_end_times_seconds: [.1, .2],
          },
        }), { headers: { 'character-cost': '2' } });
      },
    });
    expect(authorization).toBe('secret-key');
    expect(result.audio.toString()).toBe('audio');
    expect(result.durationMs).toBe(200);
    expect(result.characterCost).toBe(2);
    expect(requestBody.voice_settings).toEqual(WARM_NARRATION_SETTINGS);
  });

  test('rejects stale manifest entries so playback falls back safely', async () => {
    clearStoryAudioManifestCache();
    const fetchManifest = async () => new Response(JSON.stringify({
      version: 1,
      storyId: 'gn-01',
      pages: [{
        storyId: 'gn-01',
        chapterId: 'luz',
        pageIndex: 0,
        ageBand: '5-7',
        contentHash: storyAudioContentHash('texto antigo'),
        file: '5-7/luz-p1.mp3',
        durationMs: 100,
        cues: [],
      }],
    }));
    expect(await loadStoryAudioPage('gn-01', 'luz', 0, '5-7', 'texto novo', fetchManifest)).toBeNull();
  });
});
