import { useState, useRef, useEffect, useCallback } from 'react';
import { attachAudioLifecycle, createStoryAudioPlayer, idlePlayback, type PlaybackRequest, type SpeechSource } from '../lib/story-audio-player';
import { BRAZILIAN_VOICE_UNAVAILABLE, pickBrazilianVoice } from '../lib/brazilian-voice';

function browserSpeech(): SpeechSource | null {
  if (!('speechSynthesis' in window)) return null;
  let utterance: SpeechSynthesisUtterance | null = null;
  return {
    speak(text, onEnd, onError, onProgress) {
      const voice = pickBrazilianVoice(window.speechSynthesis.getVoices());
      if (!voice) {
        onError(BRAZILIAN_VOICE_UNAVAILABLE);
        return;
      }
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
      utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.voice = voice;
      utterance.onend = onEnd;
      utterance.onerror = () => onError();
      utterance.onboundary = event => onProgress(text.length > 0 ? event.charIndex / text.length : 0);
      window.speechSynthesis.speak(utterance);
    },
    cancel() {
      if (utterance) {
        utterance.onend = null;
        utterance.onerror = null;
        utterance.onboundary = null;
        utterance = null;
      }
      window.speechSynthesis.cancel();
    },
    pause: () => window.speechSynthesis.pause(),
    resume: () => window.speechSynthesis.resume(),
  };
}

export function useStoryAudio(enabled = true) {
  const [state, setState] = useState(idlePlayback);
  const playerRef = useRef<ReturnType<typeof createStoryAudioPlayer> | null>(null);
  useEffect(() => {
    const player = createStoryAudioPlayer(url => new Audio(url), browserSpeech(), setState);
    playerRef.current = player;
    const detach = attachAudioLifecycle(player, window, document);
    return () => {
      detach();
      player.dispose();
      playerRef.current = null;
    };
  }, []);
  const play = useCallback((request: PlaybackRequest) => {
    if (enabled && !document.hidden) playerRef.current?.play(request);
  }, [enabled]);
  const stop = useCallback(() => playerRef.current?.stop(), []);
  const pause = useCallback(() => playerRef.current?.pause(), []);
  const resume = useCallback(() => {
    if (enabled && !document.hidden) playerRef.current?.resume();
  }, [enabled]);
  useEffect(() => {
    if (!enabled) stop();
  }, [enabled, stop]);
  return { play, stop, pause, resume, ...state };
}
