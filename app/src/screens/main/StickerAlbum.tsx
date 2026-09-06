import { TopBar } from '../../components/ui/TopBar';
import { MotifIcon } from '../../components/illustrations/MotifIcon';
import { SpeechBubble } from '../../components/mascot/SpeechBubble';
import { BrandIcon } from '../../components/illustrations/BrandIcon';
import { useProgressStore } from '../../store/progressStore';
import type { Motif } from '../../content/types';

const ALBUM_MOTIFS: Motif[] = [
  'shepherd-boy', 'giant', 'sling', 'ark', 'dove', 'rainbow',
  'coat-colorful', 'well', 'grain', 'staff', 'sea-split', 'chariot',
  'boat', 'big-fish', 'plant', 'lion', 'den', 'angel',
  'crown', 'star', 'scroll', 'basket', 'mountain', 'palace',
];

export function StickerAlbum() {
  const stickersCollected = useProgressStore((s) => s.stickersCollected);
  const unlockedCount = stickersCollected.length;

  return (
    <div className="flex min-h-screen flex-col bg-cream pb-8">
      <TopBar title="Álbum de Adesivos" backTo="/app" />
      <div className="px-4">
        <SpeechBubble pose="comemorando" tone="info">
          Cada descoberta pode virar um adesivo para a sua coleção!
        </SpeechBubble>
        <p className="mb-4 text-center text-sm font-semibold text-navy/60">
          {Math.min(unlockedCount, ALBUM_MOTIFS.length)} de {ALBUM_MOTIFS.length} adesivos
        </p>
        <div className="grid grid-cols-4 gap-3">
          {ALBUM_MOTIFS.map((motif, i) => {
            const unlocked = i < unlockedCount;
            return (
              <div
                key={motif}
                className={`flex aspect-square items-center justify-center rounded-2xl border-2 ${
                  unlocked ? 'border-gold bg-white' : 'border-navy/10 bg-navy/5'
                }`}
              >
                {unlocked ? <MotifIcon motif={motif} size={44} /> : <BrandIcon name="protecao" size={22} className="opacity-30" />}
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-center text-sm text-navy/50">
          Adesivos aparecem quando você abre o baú de recompensas dos desafios diários.
        </p>
      </div>
    </div>
  );
}
