import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TopBar } from '../../components/ui/TopBar';
import { Button } from '../../components/ui/Button';
import { MotifIcon } from '../../components/illustrations/MotifIcon';
import { SpeechBubble } from '../../components/mascot/SpeechBubble';
import { UnlockedStoryPicker } from '../../components/games/UnlockedStoryPicker';
import { getStory } from '../../content/stories';
import { useProgressStore } from '../../store/progressStore';
import type { Motif } from '../../content/types';

interface CardData {
  key: string;
  motif: Motif;
  label: string;
  pairId: number;
}

function buildDeck(pairs: { icon: Motif; label: string }[]): CardData[] {
  const deck: CardData[] = pairs.flatMap((p, i) => [
    { key: `${i}-a`, motif: p.icon, label: p.label, pairId: i },
    { key: `${i}-b`, motif: p.icon, label: p.label, pairId: i },
  ]);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function MemoryGame() {
  const [storyId, setStoryId] = useState<string | null>(null);
  const story = storyId ? getStory(storyId) : undefined;
  const recordGameWin = useProgressStore((s) => s.recordGameWin);

  const deck = useMemo(() => (story ? buildDeck(story.memoryPairs) : []), [story]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [won, setWon] = useState(false);
  const rewarded = useRef(false);

  useEffect(() => {
    if (flipped.length !== 2) return;
    const [a, b] = flipped;
    if (!deck[a] || !deck[b]) return;
    const isMatch = deck[a].pairId === deck[b].pairId;
    const id = setTimeout(() => {
      if (isMatch) setMatched((prev) => new Set(prev).add(deck[a].pairId));
      setFlipped([]);
    }, isMatch ? 400 : 900);
    return () => clearTimeout(id);
  }, [flipped, deck]);

  useEffect(() => {
    if (story && matched.size > 0 && matched.size === story.memoryPairs.length && !rewarded.current) {
      rewarded.current = true;
      setWon(true);
      recordGameWin(`Memória Bíblica — ${story.title}`);
    }
  }, [matched, story, won, recordGameWin]);

  function handleFlip(i: number) {
    if (won || !deck[i] || matched.has(deck[i].pairId)) return;
    setFlipped((prev) => prev.length >= 2 || prev.includes(i) ? prev : [...prev, i]);
  }

  function reset() {
    setStoryId(null);
    setFlipped([]);
    setMatched(new Set());
    setWon(false);
    rewarded.current = false;
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream pb-8">
      <TopBar title="Memória Bíblica" backTo={story ? undefined : '/app/jogos'} onBack={story ? reset : undefined} />
      {!story ? (
        <UnlockedStoryPicker onPick={setStoryId} />
      ) : (
        <div className="flex flex-col gap-4 px-4">
          <p className="text-center text-sm font-semibold text-navy/60">{story.title}</p>
          <div className="grid grid-cols-4 gap-2.5">
            {deck.map((card, i) => {
              const isFlipped = flipped.includes(i) || matched.has(card.pairId);
              return (
                <button
                  key={card.key}
                  onClick={() => handleFlip(i)}
                  className="aspect-square [perspective:600px]"
                  aria-label={card.label}
                >
                  <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.35 }}
                    className="relative h-full w-full [transform-style:preserve-3d]"
                  >
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-navy text-xl text-white [backface-visibility:hidden]">
                      ?
                    </div>
                    <div
                      className="absolute inset-0 flex items-center justify-center rounded-xl bg-white p-1 [backface-visibility:hidden]"
                      style={{ transform: 'rotateY(180deg)' }}
                    >
                      <MotifIcon motif={card.motif} size={36} />
                    </div>
                  </motion.div>
                </button>
              );
            })}
          </div>

          {won && (
            <>
              <SpeechBubble pose="comemorando" tone="success">
                Você encontrou todos os pares! +12 moedas, +18 XP
              </SpeechBubble>
              <Button full onClick={reset}>
                Jogar outra história
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
