import { useMemo, useState } from 'react';
import { TopBar } from '../../components/ui/TopBar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SpeechBubble } from '../../components/mascot/SpeechBubble';
import { BrandIcon } from '../../components/illustrations/BrandIcon';
import { ORDER_SEQUENCES, type OrderSequence } from '../../content/order-sequences';
import { useProgressStore } from '../../store/progressStore';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function Picker({ onPick }: { onPick: (seq: OrderSequence) => void }) {
  const stories = useProgressStore((s) => s.stories);
  return (
    <div className="flex flex-col gap-3 px-4">
      <p className="text-center text-sm font-semibold text-navy/60">Escolha uma sequência</p>
      {ORDER_SEQUENCES.map((seq) => {
        const locked = seq.requiresStoryId ? !stories[seq.requiresStoryId]?.completed : false;
        return (
          <button key={seq.id} disabled={locked} onClick={() => onPick(seq)} className="text-left disabled:opacity-40">
            <Card className="flex items-center justify-between">
              <p className="font-display font-bold text-navy">{seq.title}</p>
              {locked && <BrandIcon name="protecao" size={22} className="opacity-50" />}
            </Card>
          </button>
        );
      })}
    </div>
  );
}

export function OrderGame() {
  const [seq, setSeq] = useState<OrderSequence | null>(null);
  const recordGameWin = useProgressStore((s) => s.recordGameWin);

  const [pool, setPool] = useState<{ step: string; id: number }[]>([]);
  const [placed, setPlaced] = useState<{ step: string; id: number }[]>([]);
  const [wrong, setWrong] = useState(false);
  const [won, setWon] = useState(false);

  function pick(s: OrderSequence) {
    setSeq(s);
    setPool(shuffle(s.steps.map((step, id) => ({ step, id }))));
    setPlaced([]);
    setWrong(false);
    setWon(false);
  }

  const isComplete = useMemo(() => seq && placed.length === seq.steps.length, [seq, placed]);

  function place(item: { step: string; id: number }) {
    setPool((p) => p.filter((x) => x.id !== item.id));
    setPlaced((p) => [...p, item]);
  }

  function checkOrRestart() {
    if (!seq) return;
    const correct = placed.every((p, i) => p.id === i);
    if (correct) {
      setWon(true);
      recordGameWin(`Ordem Correta — ${seq.title}`);
    } else {
      setWrong(true);
    }
  }

  function restart() {
    if (!seq) return;
    pick(seq);
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream pb-8">
      <TopBar title="Ordem Correta" backTo={seq ? undefined : '/app/jogos'} onBack={seq ? () => setSeq(null) : undefined} />
      {!seq ? (
        <Picker onPick={pick} />
      ) : (
        <div className="flex flex-col gap-4 px-4">
          <p className="text-center text-sm font-semibold text-navy/60">Toque na ordem certa dos acontecimentos</p>

          <div className="flex flex-col gap-2">
            {placed.map((item, i) => (
              <div key={item.id} className="flex items-center gap-2 rounded-xl bg-navy px-3 py-2 text-sm font-bold text-white">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">{i + 1}</span>
                {item.step}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {pool.map((item) => (
              <button key={item.id} onClick={() => place(item)} className="rounded-xl bg-orange-light/30 px-3 py-2 text-sm font-bold text-navy">
                {item.step}
              </button>
            ))}
          </div>

          {isComplete && !won && (
            <Button full onClick={checkOrRestart}>
              Conferir ordem
            </Button>
          )}

          {wrong && !won && (
            <>
              <SpeechBubble pose="pensando" tone="info">
                Quase lá! Vamos tentar de novo.
              </SpeechBubble>
              <Button full variant="secondary" onClick={restart}>
                Tentar novamente
              </Button>
            </>
          )}

          {won && (
            <>
              <SpeechBubble pose="comemorando" tone="success">
                Isso mesmo, essa é a ordem certa! +12 moedas, +18 XP
              </SpeechBubble>
              <Button full onClick={() => setSeq(null)}>
                Jogar outra sequência
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
