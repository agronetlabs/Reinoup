import { useState, useRef, useEffect, useCallback } from 'react';
import { createStoryAudioPlayer, idlePlayback, type SpeechSource } from '../lib/story-audio-player';

function browserSpeech(): SpeechSource | null {
  if (!('speechSynthesis' in window)) return null;
  let utterance: SpeechSynthesisUtterance | null = null;
  return {
    speak(text, onEnd, onError) {
      window.speechSynthesis.cancel();
      utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang.toLowerCase().startsWith('pt-br'))
        ?? voices.find(v => v.lang.toLowerCase().startsWith('pt'));
      if (voice) utterance.voice = voice;
      utterance.onend = onEnd;
      utterance.onerror = onError;
      window.speechSynthesis.speak(utterance);
    },
    cancel() {
      if (utterance) {
        utterance.onend = null;
        utterance.onerror = null;
        utterance = null;
      }
      window.speechSynthesis.cancel();
    },
  };
}

export function useStoryAudio(enabled = true) {
  const [state, setState] = useState(idlePlayback);
  const playerRef = useRef<ReturnType<typeof createStoryAudioPlayer> | null>(null);
  useEffect(() => {
    const player = createStoryAudioPlayer(url => new Audio(url), browserSpeech(), setState);
    playerRef.current = player;
    const onVisibility = () => { if (document.hidden) player.stop(); };
    window.addEventListener('pagehide', player.stop);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pagehide', player.stop);
      document.removeEventListener('visibilitychange', onVisibility);
      player.dispose();
      playerRef.current = null;
    };
  }, []);
  const play = useCallback((url: string, text: string) => playerRef.current?.play(url, text), []);
  const stop = useCallback(() => playerRef.current?.stop(), []);
  useEffect(() => {
    if (!enabled) stop();
  }, [enabled, stop]);
  return { play, stop, ...state };
}
