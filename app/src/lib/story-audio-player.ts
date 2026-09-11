export interface PlaybackState {
  isPlaying: boolean;
  isStudioAudio: boolean;
  error: string | null;
}

export interface AudioSource extends EventTarget {
  play(): Promise<void>;
  pause(): void;
  removeAttribute(name: string): void;
  load(): void;
}

export interface SpeechSource {
  speak(text: string, onEnd: () => void, onError: () => void): void;
  cancel(): void;
}

export const idlePlayback: PlaybackState = { isPlaying: false, isStudioAudio: false, error: null };

export function createStoryAudioPlayer(
  createAudio: (url: string) => AudioSource,
  speech: SpeechSource | null,
  notify: (state: PlaybackState) => void,
) {
  let generation = 0;
  let disposed = false;
  let releaseAudio = () => {};
  let speaking = false;
  const publish = (state: PlaybackState) => { if (!disposed) notify(state); };

  function stop() {
    generation++;
    releaseAudio();
    releaseAudio = () => {};
    if (speaking) {
      speaking = false;
      speech?.cancel();
    }
    publish(idlePlayback);
  }

  function play(url: string, text: string) {
    if (disposed) throw new Error('Narration player is disposed');
    stop();
    const current = generation;
    const audio = createAudio(url);
    let fallbackStarted = false;
    const isCurrent = () => !disposed && current === generation;
    const finish = () => {
      if (!isCurrent()) return;
      releaseAudio();
      releaseAudio = () => {};
      speaking = false;
      publish(idlePlayback);
    };
    const onPlay = () => {
      if (isCurrent() && !fallbackStarted) publish({ ...idlePlayback, isPlaying: true, isStudioAudio: true });
    };
    const fallback = () => {
      // Media errors and play() rejection can report the same failure.
      if (!isCurrent() || fallbackStarted) return;
      fallbackStarted = true;
      releaseAudio();
      releaseAudio = () => {};
      if (!speech) {
        publish({ ...idlePlayback, error: 'A narração não está disponível neste navegador. Você pode continuar lendo.' });
        return;
      }
      speaking = true;
      publish({ ...idlePlayback, isPlaying: true });
      speech.speak(text, finish, () => {
        if (!isCurrent()) return;
        speaking = false;
        publish({ ...idlePlayback, error: 'Não consegui narrar agora. Toque para tentar novamente ou continue lendo.' });
      });
    };
    audio.addEventListener('play', onPlay);
    audio.addEventListener('ended', finish);
    audio.addEventListener('error', fallback);
    releaseAudio = () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('ended', finish);
      audio.removeEventListener('error', fallback);
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    };
    publish({ ...idlePlayback, isPlaying: true });
    void audio.play().catch(fallback);
  }

  return {
    play,
    stop,
    dispose() {
      disposed = true;
      stop();
    },
  };
}
