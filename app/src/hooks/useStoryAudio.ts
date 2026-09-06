import { useState, useRef, useEffect, useCallback } from 'react';

let cachedVoice: SpeechSynthesisVoice | null | undefined;

function pickBrowserVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice !== undefined) return cachedVoice;
  const voices = window.speechSynthesis?.getVoices() ?? [];
  cachedVoice =
    voices.find((v) => v.lang?.toLowerCase().startsWith('pt-br')) ??
    voices.find((v) => v.lang?.toLowerCase().startsWith('pt')) ??
    null;
  return cachedVoice;
}

export function useStoryAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStudioAudio, setIsStudioAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsStudioAudio(false);
  }, []);

  const playSynthFallback = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsPlaying(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    const voice = pickBrowserVoice();
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      setIsPlaying(false);
      setIsStudioAudio(false);
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      setIsStudioAudio(false);
    };

    setIsPlaying(true);
    setIsStudioAudio(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const play = useCallback(
    (audioUrl: string, fallbackText: string) => {
      stop();

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setIsPlaying(true);
        setIsStudioAudio(true);
      };

      audio.onended = () => {
        setIsPlaying(false);
        setIsStudioAudio(false);
        audioRef.current = null;
      };

      audio.onerror = () => {
        // Áudio estático não encontrado ou erro de rede -> cai no sintetizador do navegador
        audioRef.current = null;
        playSynthFallback(fallbackText);
      };

      audio.play().catch(() => {
        // Autoplay bloqueado ou arquivo não encontrado -> fallback
        audioRef.current = null;
        playSynthFallback(fallbackText);
      });
    },
    [stop, playSynthFallback]
  );

  // Para ao desmontar o componente
  useEffect(() => stop, [stop]);

  return {
    play,
    stop,
    isPlaying,
    isStudioAudio,
  };
}
