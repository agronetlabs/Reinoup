import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { TopBar } from '../../components/ui/TopBar';
import { Button } from '../../components/ui/Button';
import { SpeechBubble } from '../../components/mascot/SpeechBubble';
import { Scene } from '../../components/illustrations/Scene';
import { UnlockedStoryPicker } from '../../components/games/UnlockedStoryPicker';
import { getStory } from '../../content/stories';
import { useProgressStore } from '../../store/progressStore';
import { sfx } from '../../lib/sfx';

const GRID = 3;
const BOARD_SIZE = 300;
const TILE = BOARD_SIZE / GRID;

function shuffledIdentity(): number[] {
  const arr = Array.from({ length: GRID * GRID }, (_, i) => i);
  let ok = false;
  while (!ok) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    ok = arr.some((v, i) => v !== i);
  }
  return arr;
}

export function PuzzleGame() {
  const [storyId, setStoryId] = useState<string | null>(null);
  const story = storyId ? getStory(storyId) : undefined;
  const recordGameWin = useProgressStore((s) => s.recordGameWin);

  const [pieces, setPieces] = useState<number[]>(() => shuffledIdentity());
  const [selected, setSelected] = useState<number | null>(null);
  const [won, setWon] = useState(false);

  useEffect(() => {
    setPieces(shuffledIdentity());
    setSelected(null);
    setWon(false);
  }, [storyId]);

  const solved = useMemo(() => pieces.every((v, i) => v === i), [pieces]);

  useEffect(() => {
    if (solved && story && !won) {
      setWon(true);
      sfx.success();
      setTimeout(() => sfx.coin(), 350);
      recordGameWin(`Quebra-Cabeça — ${story.title}`);
    }
  }, [solved, story, won, recordGameWin]);

  function handleTap(cell: number) {
    if (won) return;
    sfx.tap();
    if (selected === null) {
      setSelected(cell);
      return;
    }
    if (selected === cell) {
      setSelected(null);
      return;
    }
    setPieces((prev) => {
      const next = [...prev];
      [next[selected], next[cell]] = [next[cell], next[selected]];
      return next;
    });
    setSelected(null);
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream pb-8">
      <TopBar title="Quebra-Cabeça" backTo={story ? undefined : '/app/jogos'} onBack={story ? () => setStoryId(null) : undefined} />
      {!story ? (
        <UnlockedStoryPicker onPick={setStoryId} />
      ) : (
        <div className="flex flex-col items-center gap-4 px-4">
          <p className="text-center text-sm font-semibold text-navy/60">Toque em duas peças para trocar de lugar</p>
          <div
            className="relative overflow-hidden rounded-2xl border-4 border-navy/20"
            style={{ width: BOARD_SIZE, height: BOARD_SIZE }}
          >
            {pieces.map((pieceIndex, cell) => {
              const targetRow = Math.floor(pieceIndex / GRID);
              const targetCol = pieceIndex % GRID;
              const cellRow = Math.floor(cell / GRID);
              const cellCol = cell % GRID;
              return (
                <motion.button
                  key={cell}
                  layout
                  onClick={() => handleTap(cell)}
                  className="absolute overflow-hidden"
                  style={{
                    width: TILE,
                    height: TILE,
                    top: cellRow * TILE,
                    left: cellCol * TILE,
                    outline: selected === cell ? '3px solid var(--color-orange)' : '1px solid rgba(27,58,107,0.15)',
                  }}
                >
                  <div style={{ width: BOARD_SIZE, height: BOARD_SIZE, marginTop: -targetRow * TILE, marginLeft: -targetCol * TILE }}>
                    <Scene scene={story.cover} artId={story.id} height={BOARD_SIZE} className="rounded-none" />
                  </div>
                </motion.button>
              );
            })}
          </div>

          {won && (
            <>
              <SpeechBubble pose="comemorando" tone="success">
                Você montou a cena de {story.title}! +12 moedas, +18 XP
              </SpeechBubble>
              <Button full onClick={() => setStoryId(null)}>
                Jogar outra história
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
