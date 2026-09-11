import { useCallback, useEffect, useRef, useState } from 'react';
import { BRAZILIAN_VOICE_UNAVAILABLE, pickBrazilianVoice } from '../lib/brazilian-voice';

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supported] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    if (!supported) return;
    if (utteranceRef.current) {
      utteranceRef.current.onend = null;
      utteranceRef.current.onerror = null;
      utteranceRef.current = null;
    }
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  const speak = useCallback(
    (text: string, rate = 0.95) => {
      stop();
      setError(null);
      if (!supported) {
        setError('A narração não está disponível neste navegador. Você pode continuar lendo.');
        return;
      }
      const voice = pickBrazilianVoice(window.speechSynthesis.getVoices());
      if (!voice) {
        setError(BRAZILIAN_VOICE_UNAVAILABLE);
        return;
      }
      window.speechSynthesis.resume();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = rate;
      utterance.pitch = 1.05;
      utterance.voice = voice;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => {
        setSpeaking(false);
        setError('Não consegui narrar agora. Toque para tentar novamente ou continue lendo.');
      };
      utteranceRef.current = utterance;
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    },
    [supported, stop]
  );

  useEffect(() => stop, [stop]);

  return { speak, stop, speaking, supported, error };
}
