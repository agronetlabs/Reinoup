import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TopBar } from '../../components/ui/TopBar';
import { Button } from '../../components/ui/Button';
import { MascotOficial } from '../../components/mascot/MascotOficial';
import { BrandIcon } from '../../components/illustrations/BrandIcon';
import { useProgressStore } from '../../store/progressStore';
import { sfx } from '../../lib/sfx';
import { scheduleChestOpening } from '../../lib/chest-opening';

export function RewardChest() {
  const navigate = useNavigate();
  const openDailyChest = useProgressStore((s) => s.openDailyChest);
  const dailyChallenge = useProgressStore((s) => s.dailyChallenge);
  const [reward, setReward] = useState<{ coins: number; xp: number; sticker: boolean } | null>(null);
  const [opening, setOpening] = useState(true);

  useEffect(() => {
    return scheduleChestOpening(openDailyChest, (r) => {
      setReward(r);
      setOpening(false);
    }, () => sfx.chestOpen(), () => sfx.coin());
  }, [openDailyChest]);

  return (
    <div className="flex min-h-screen flex-col bg-navy text-white">
      <TopBar dark title="Baú de Recompensas" backTo="/app/desafios" />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
        <MascotOficial size={96} recorte="busto" />
        <motion.div
          animate={opening ? { rotate: [0, -4, 4, -4, 0] } : { scale: [1, 1.15, 1] }}
          transition={{ duration: opening ? 0.6 : 0.5, repeat: opening ? Infinity : 0 }}
          className="text-8xl"
        >
          <BrandIcon name="recompensas" size={112} className="text-gold" />
        </motion.div>

        {!opening && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4">
            <p className="font-display text-xl font-bold">
              {reward ? 'Parabéns! Você ganhou:' : dailyChallenge.chestOpened ? 'Você já abriu o baú de hoje!' : 'Complete os 3 desafios de hoje primeiro.'}
            </p>
            {reward && (
              <div className="flex gap-4">
                <div className="rounded-2xl bg-white/10 px-5 py-3">
                  <p className="text-2xl font-extrabold">+{reward.coins}</p>
                  <p className="text-xs text-white/70">moedas</p>
                </div>
                <div className="rounded-2xl bg-white/10 px-5 py-3">
                  <p className="text-2xl font-extrabold">+{reward.xp}</p>
                  <p className="text-xs text-white/70">XP</p>
                </div>
                {reward.sticker && (
                  <div className="rounded-2xl bg-white/10 px-5 py-3">
                    <p className="text-2xl font-extrabold">🏅</p>
                    <p className="text-xs text-white/70">adesivo raro</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
      {!opening && (
        <div className="flex flex-col gap-3 px-8 pb-10">
          <Button full size="lg" disabled className="opacity-50">
            Novo baú amanhã
          </Button>
          <button onClick={() => navigate(reward ? '/app/final' : '/app')} className="text-center font-semibold text-white/70">
            Voltar
          </button>
        </div>
      )}
    </div>
  );
}
