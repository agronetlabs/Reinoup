import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TopBar } from '../../components/ui/TopBar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SpeechBubble } from '../../components/mascot/SpeechBubble';
import { getVerseOfDay } from '../../content/verses';
import { useSettingsStore } from '../../store/settingsStore';
import { useProgressStore } from '../../store/progressStore';
import { useSpeech } from '../../hooks/useSpeech';
import { useRecorder } from '../../hooks/useRecorder';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function VerseOfDay() {
  const navigate = useNavigate();
  const ageBand = useSettingsStore((s) => s.ageBand);
  const versesCollected = useProgressStore((s) => s.versesCollected);
  const dailyVerseDone = useProgressStore((s) => s.dailyChallenge.tasks.some((task) => task.id === 'decorar-versiculo' && task.done));
  const ensureFreshDaily = useProgressStore((s) => s.ensureFreshDaily);
  const collectVerse = useProgressStore((s) => s.collectVerse);
  const { speak, stop, speaking, error: speechError } = useSpeech();
  const recorder = useRecorder();

  const verse = useMemo(() => getVerseOfDay(), []);
  const text = verse.text[ageBand];
  const targetWords = useMemo(() => text.replace(/[.,!]/g, '').split(' '), [text]);
  const [pool, setPool] = useState(() => shuffle(targetWords).map((w, i) => ({ w, id: i })));
  const [placed, setPlaced] = useState<{ w: string; id: number }[]>([]);

  const alreadyCollected = versesCollected.includes(verse.id);
  const isCorrectOrder = placed.map((p) => p.w).join(' ') === targetWords.join(' ');

  useEffect(() => {
    ensureFreshDaily();
  }, [ensureFreshDaily]);

  function placeWord(item: { w: string; id: number }) {
    setPool((p) => p.filter((x) => x.id !== item.id));
    setPlaced((p) => [...p, item]);
  }
  function removeWord(item: { w: string; id: number }) {
    setPlaced((p) => p.filter((x) => x.id !== item.id));
    setPool((p) => [...p, item]);
  }

  function handleComplete() {
    collectVerse(verse.id);
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream pb-8">
      <TopBar title="Versículo do dia" backTo="/app" />
      <div className="flex flex-col gap-5 px-4">
        <SpeechBubble pose="feliz" tone="info">
          Guarde a Palavra no coração, uma palavra de cada vez.
        </SpeechBubble>
        <Card>
          <p className="font-display text-xl font-bold leading-snug text-navy">"{text}"</p>
          <p className="mt-1 text-sm font-semibold text-navy/60">{verse.reference}</p>
          <button
            onClick={() => (speaking ? stop() : speak(text))}
            className="mt-3 flex items-center gap-2 text-sm font-bold text-orange-dark"
          >
            {speaking ? '⏸️ Parar' : '▶️ Ouvir'}
          </button>
          {speechError && <p role="alert" className="mt-3 text-sm text-navy">{speechError}</p>}
        </Card>

        {!dailyVerseDone ? (
          <Card>
            <p className="font-display mb-3 font-bold text-navy">Monte o versículo na ordem certa</p>
            {alreadyCollected && (
              <p className="mb-3 text-sm font-semibold text-navy">
                Este versículo já está na sua estante. Vamos relembrá-lo para completar o desafio de hoje.
              </p>
            )}
            <div className="mb-4 flex min-h-14 flex-wrap gap-2 rounded-2xl border-2 border-dashed border-navy/15 p-3">
              {placed.map((item) => (
                <motion.button
                  layout
                  key={item.id}
                  onClick={() => removeWord(item)}
                  className="rounded-xl bg-navy px-3 py-1.5 text-sm font-bold text-white"
                >
                  {item.w}
                </motion.button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {pool.map((item) => (
                <motion.button
                  layout
                  key={item.id}
                  onClick={() => placeWord(item)}
                  className="rounded-xl bg-orange-light/30 px-3 py-1.5 text-sm font-bold text-navy"
                >
                  {item.w}
                </motion.button>
              ))}
            </div>
            {placed.length === targetWords.length && (
              <Button full className="mt-4" onClick={handleComplete} disabled={!isCorrectOrder}>
                {isCorrectOrder ? 'Decorei! ✓' : 'Ordem incorreta, tente de novo'}
              </Button>
            )}
            {placed.length === targetWords.length && !isCorrectOrder && (
              <button
                className="mt-2 w-full text-center text-sm font-bold text-navy/60"
                onClick={() => {
                  setPool(shuffle(targetWords).map((w, i) => ({ w, id: i })));
                  setPlaced([]);
                }}
              >
                Recomeçar
              </button>
            )}
          </Card>
        ) : (
          <SpeechBubble pose="comemorando" tone="success">
            Isso mesmo! Você decorou o versículo de hoje. Ele foi para a sua estante de versículos!
          </SpeechBubble>
        )}

        <Card>
          <p className="font-display mb-2 font-bold text-navy">Grave sua voz dizendo o versículo</p>
          <p className="mb-3 text-sm text-navy/60">Fica só no seu aparelho, é só para você ouvir depois.</p>
          {recorder.supported ? (
            <div className="flex items-center gap-3">
              {recorder.status !== 'recording' ? (
                <Button variant="secondary" onClick={recorder.start}>
                  🎙️ Gravar
                </Button>
              ) : (
                <Button variant="danger" onClick={recorder.stop}>
                  ⏹️ Parar
                </Button>
              )}
              {recorder.audioUrl && <audio controls src={recorder.audioUrl} className="h-10 flex-1" />}
            </div>
          ) : (
            <p className="text-sm text-navy/50">Gravação de voz não é compatível com este navegador.</p>
          )}
        </Card>

        {dailyVerseDone && (
          <div className="flex gap-3">
            <Button variant="secondary" full onClick={() => navigate('/app/estante-versiculos')}>
              Ver estante
            </Button>
            <Button full onClick={() => navigate('/app')}>
              Concluir
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
