export interface PlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  isStudioAudio: boolean;
  error: string | null;
  progress: number;
  elapsedMs: number;
  durationMs: number;
  activeCue: PlaybackCue | null;
}

export interface AudioSource extends EventTarget {
  currentTime: number;
  duration: number;
  play(): Promise<void>;
  pause(): void;
  removeAttribute(name: string): void;
  load(): void;
}

export interface SpeechSource {
  speak(text: string, onEnd: () => void, onError: (message?: string) => void, onProgress: (progress: number) => void): void;
  cancel(): void;
  pause(): void;
  resume(): void;
}

export interface PlaybackCue {
  text: string;
  startMs: number;
  endMs: number;
  characterStart: number;
  characterEnd: number;
}

export interface PlaybackRequest {
  url?: string;
  text: string;
  durationMs?: number;
  cues?: PlaybackCue[];
}

export const idlePlayback: PlaybackState = {
  isPlaying: false,
  isPaused: false,
  isStudioAudio: false,
  error: null,
  progress: 0,
  elapsedMs: 0,
  durationMs: 0,
  activeCue: null,
};

export function createStoryAudioPlayer(
  createAudio: (url: string) => AudioSource,
  speech: SpeechSource | null,
  notify: (state: PlaybackState) => void,
) {
  let generation = 0;
  let disposed = false;
  let releaseAudio = () => {};
  let pauseCurrent = () => {};
  let resumeCurrent = () => {};
  let speaking = false;
  let state = idlePlayback;
  const publish = (next: PlaybackState) => {
    state = next;
    if (!disposed) notify(next);
  };

  function stop() {
    generation++;
    releaseAudio();
    releaseAudio = () => {};
    pauseCurrent = () => {};
    resumeCurrent = () => {};
    if (speaking) {
      speaking = false;
      speech?.cancel();
    }
    publish(idlePlayback);
  }

  function play(request: PlaybackRequest) {
    if (disposed) throw new Error('Narration player is disposed');
    stop();
    const { url, text, cues = [] } = request;
    const current = generation;
    const audio = url ? createAudio(url) : null;
    let fallbackStarted = false;
    let fallbackPending = false;
    let playAttempt = 0;
    const isCurrent = () => !disposed && current === generation;
    const finish = () => {
      if (!isCurrent()) return;
      releaseAudio();
      releaseAudio = () => {};
      speaking = false;
      pauseCurrent = () => {};
      resumeCurrent = () => {};
      publish(idlePlayback);
    };
    const onPlay = () => {
      if (audio && isCurrent() && !fallbackStarted) {
        if (state.isPaused) {
          audio.pause();
          return;
        }
        publish({ ...state, isPlaying: true, isStudioAudio: true, durationMs: request.durationMs ?? state.durationMs });
      }
    };
    const onTimeUpdate = () => {
      if (!audio || !isCurrent() || fallbackStarted || state.isPaused) return;
      const elapsedMs = Math.max(0, audio.currentTime * 1000);
      const durationMs = request.durationMs
        ?? (Number.isFinite(audio.duration) ? audio.duration * 1000 : 0);
      const activeCue = cues.find(cue => elapsedMs >= cue.startMs && elapsedMs < cue.endMs) ?? null;
      publish({
        ...idlePlayback,
        isPlaying: true,
        isStudioAudio: true,
        elapsedMs,
        durationMs,
        progress: durationMs > 0 ? Math.min(1, elapsedMs / durationMs) : 0,
        activeCue,
      });
    };
    const fallback = () => {
      // Media errors and play() rejection can report the same failure.
      if (!isCurrent() || fallbackStarted) return;
      if (state.isPaused) {
        fallbackPending = true;
        return;
      }
      fallbackStarted = true;
      releaseAudio();
      releaseAudio = () => {};
      if (!speech) {
        publish({ ...idlePlayback, error: 'A narração não está disponível neste navegador. Você pode continuar lendo.' });
        return;
      }
      speaking = true;
      publish({ ...idlePlayback, isPlaying: true });
      speech.speak(text, finish, message => {
        if (!isCurrent()) return;
        stop();
        publish({ ...idlePlayback, error: message ?? 'Não consegui narrar agora. Toque para tentar novamente ou continue lendo.' });
      }, progress => {
        if (!isCurrent() || state.isPaused) return;
        publish({ ...idlePlayback, isPlaying: true, progress: Math.max(0, Math.min(1, progress)) });
      });
    };
    const startAudio = () => {
      if (!audio) {
        fallback();
        return;
      }
      const attempt = ++playAttempt;
      void audio.play().catch(() => {
        // pause() can reject an outstanding play(); it is not a missing MP3.
        if (isCurrent() && attempt === playAttempt) fallback();
      });
    };
    pauseCurrent = () => {
      if (!isCurrent() || !state.isPlaying) return;
      if (!fallbackStarted && state.isStudioAudio) onTimeUpdate();
      playAttempt++;
      publish({ ...state, isPlaying: false, isPaused: true });
      if (fallbackStarted) speech?.pause();
      else audio?.pause();
    };
    resumeCurrent = () => {
      if (!isCurrent() || !state.isPaused) return;
      publish({ ...state, isPlaying: true, isPaused: false });
      if (fallbackPending) {
        fallbackPending = false;
        fallback();
      } else if (fallbackStarted) speech?.resume();
      else startAudio();
    };
    audio?.addEventListener('play', onPlay);
    audio?.addEventListener('timeupdate', onTimeUpdate);
    audio?.addEventListener('ended', finish);
    audio?.addEventListener('error', fallback);
    releaseAudio = () => {
      if (!audio) return;
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', finish);
      audio.removeEventListener('error', fallback);
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    };
    publish({ ...idlePlayback, isPlaying: true });
    startAudio();
  }

  return {
    play,
    stop,
    pause: () => pauseCurrent(),
    resume: () => resumeCurrent(),
    dispose() {
      disposed = true;
      stop();
    },
  };
}
