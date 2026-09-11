import { describe, expect, test } from 'bun:test';
import { createStoryAudioPlayer, idlePlayback, type PlaybackState } from '../src/lib/story-audio-player';

class FakeAudio extends EventTarget {
  pending = Promise.withResolvers<void>();
  pauses = 0;
  loads = 0;
  removed: string[] = [];
  play() { return this.pending.promise; }
  pause() { this.pauses++; }
  load() { this.loads++; }
  removeAttribute(name: string) { this.removed.push(name); }
  emit(name: string) { this.dispatchEvent(new Event(name)); }
}

function fixture(supported = true) {
  const audios: FakeAudio[] = [];
  const speechCalls: { text: string; end: () => void; error: () => void }[] = [];
  let cancellations = 0;
  const states: PlaybackState[] = [];
  const player = createStoryAudioPlayer(() => {
    const audio = new FakeAudio();
    audios.push(audio);
    return audio;
  }, supported ? {
    speak(text, end, error) { speechCalls.push({ text, end, error }); },
    cancel() { cancellations++; },
  } : null, state => states.push(state));
  return { player, audios, speechCalls, states, cancellations: () => cancellations };
}

describe('story narration lifecycle', () => {
  test('studio playback ends and releases its media resource', () => {
    const f = fixture();
    f.player.play('/story.mp3', 'História');
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
    f.player.play('/missing.mp3', 'Uma história');
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
    f.player.play('/slow.mp3', 'História');
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
    f.player.play('/old.mp3', 'Antiga');
    f.player.play('/new.mp3', 'Nova');
    f.audios[1].emit('play');
    f.audios[0].pending.reject(new Error('Old request'));
    await Promise.resolve();
    expect(f.speechCalls).toHaveLength(0);
    expect(f.states.at(-1)?.isStudioAudio).toBe(true);
  });

  test('stale speech callbacks cannot clear a newer narration', () => {
    const f = fixture();
    f.player.play('/old.mp3', 'Antiga');
    f.audios[0].emit('error');
    f.player.play('/new.mp3', 'Nova');
    f.audios[1].emit('play');
    f.speechCalls[0].end();
    f.speechCalls[0].error();
    expect(f.cancellations()).toBe(1);
    expect(f.states.at(-1)).toEqual({ ...idlePlayback, isPlaying: true, isStudioAudio: true });
  });

  test('unsupported fallback surfaces a readable error instead of staying busy', () => {
    const f = fixture(false);
    f.player.play('/missing.mp3', 'História');
    f.audios[0].emit('error');
    expect(f.states.at(-1)?.isPlaying).toBe(false);
    expect(f.states.at(-1)?.error).toContain('não está disponível');
  });

  test('speech errors are surfaced and retry clears them', () => {
    const f = fixture();
    f.player.play('/missing.mp3', 'História');
    f.audios[0].emit('error');
    f.speechCalls[0].error();
    expect(f.states.at(-1)?.error).toContain('tentar novamente');
    f.player.play('/retry.mp3', 'História');
    expect(f.states.at(-1)?.error).toBeNull();
  });

  test('disposal cancels speech without publishing state after unmount', () => {
    const f = fixture();
    f.player.play('/missing.mp3', 'História');
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
    f.player.play('/slow.mp3', 'História');
    f.player.dispose();
    f.audios[0].pending.reject(new Error('Aborted'));
    await Promise.resolve();
    expect(f.speechCalls).toHaveLength(0);
    expect(f.audios[0].pauses).toBe(1);
  });
});
