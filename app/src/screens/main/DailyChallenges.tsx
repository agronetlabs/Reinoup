import { useNavigate } from 'react-router-dom';
import { TopBar } from '../../components/ui/TopBar';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { BrandIcon, type BrandIconName } from '../../components/illustrations/BrandIcon';
import { SpeechBubble } from '../../components/mascot/SpeechBubble';
import { useProgressStore } from '../../store/progressStore';
import { SHIELD_COST_COINS } from '../../lib/economy';
import { sfx } from '../../lib/sfx';

/**
 * Desafios diários — construída a partir da tela 10 do mockup.
 *
 * Referência: cada tarefa numa linha alta, com disco colorido à esquerda
 * (verde e com ✓ quando feita, laranja em andamento, cinza intocada) e selo
 * de concluída à direita. Embaixo, ofensiva e escudo lado a lado, e o botão
 * laranja do baú fechando a tela.
 */
const TASK_ICONS: Record<string, BrandIconName> = {
  'ouvir-historia': 'licoes',
  'acertar-quiz': 'amor',
  'decorar-versiculo': 'fe',
};

export function DailyChallenges() {
  const navigate = useNavigate();
  const dailyChallenge = useProgressStore((s) => s.dailyChallenge);
  const streakDays = useProgressStore((s) => s.streakDays);
  const shieldsAvailable = useProgressStore((s) => s.shieldsAvailable);
  const coins = useProgressStore((s) => s.coins);
  const buyShield = useProgressStore((s) => s.buyShield);

  const allDone = dailyChallenge.tasks.every((t) => t.done);
  const feitas = dailyChallenge.tasks.filter((t) => t.done).length;

  return (
    <div className="flex min-h-screen flex-col bg-cream pb-8">
      <TopBar title="Desafios diários" backTo="/app" />

      <div className="flex flex-col gap-4 px-4">
        <SpeechBubble pose="feliz" tone="info">
          Cada desafio é um passo na sua jornada. Vamos juntos?
        </SpeechBubble>
        <p className="text-center text-base font-semibold leading-snug text-navy/70">
          Complete os desafios e ganhe moedas e XP!
        </p>

        <div className="flex flex-col gap-3">
          {dailyChallenge.tasks.map((task) => {
            const comecou = task.progress > 0;
            const disco = task.done ? 'bg-green' : comecou ? 'bg-orange' : 'bg-gray';

            return (
              <div
                key={task.id}
                className={`flex items-center gap-4 rounded-[var(--radius-md)] border border-border-default p-4 shadow-[var(--shadow-card)] ${
                  task.done ? 'bg-green-light/60' : 'bg-white'
                }`}
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${disco}`}>
                  <BrandIcon name={TASK_ICONS[task.id] ?? 'progresso'} size={26} className="brightness-0 invert" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-display text-base font-bold leading-tight text-navy">{task.label}</p>
                  {!task.done && (
                    <div className="mt-2 flex items-center gap-2">
                      <ProgressBar
                        value={task.target ? task.progress / task.target : 0}
                        height={10}
                        color="var(--color-orange)"
                      />
                      <span className="shrink-0 text-xs font-bold tabular-nums text-navy/50">
                        {task.progress}/{task.target}
                      </span>
                    </div>
                  )}
                </div>

                {task.done && (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green text-lg font-bold text-white">
                    ✓
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* ---- ofensiva e escudo ---- */}
        <div className="rounded-[var(--radius-md)] border border-border-default bg-surface-default p-4 shadow-[var(--shadow-card)]">
          <div className="grid grid-cols-2 divide-x divide-navy/10 text-center">
            <div className="px-2">
              <p className="font-display text-sm font-bold text-navy/60">Sua ofensiva</p>
              <p className="font-display mt-2 text-2xl font-extrabold text-navy">
                <span className="mr-1 text-2xl">🔥</span>
                {streakDays} {streakDays === 1 ? 'dia' : 'dias'}
              </p>
            </div>
            <div className="px-2">
              <p className="font-display text-sm font-bold text-navy/60">Escudo</p>
              <p className="font-display mt-2 flex items-center justify-center gap-1.5 text-2xl font-extrabold text-navy">
                <BrandIcon name="protecao" size={26} />
                {shieldsAvailable}
              </p>
            </div>
          </div>

          {shieldsAvailable < 2 && (
            <button
              disabled={coins < SHIELD_COST_COINS}
              onClick={() => {
                buyShield();
                sfx.coin();
              }}
              className="mt-4 min-h-11 w-full rounded-[var(--radius-lg)] border border-navy/10 px-4 py-2.5 text-sm font-bold text-navy disabled:opacity-40"
            >
              Comprar escudo extra ({SHIELD_COST_COINS} moedas)
            </button>
          )}
        </div>

        <p className="text-center text-xs font-semibold text-navy/45">
          {feitas} de {dailyChallenge.tasks.length} concluídos hoje
        </p>

        <button
          disabled={!allDone || dailyChallenge.chestOpened}
          onClick={() => navigate('/app/bau')}
          className="min-h-[52px] w-full rounded-[var(--radius-lg)] bg-action-primary-bg py-4 font-display text-lg font-bold text-action-primary-fg shadow-[0_4px_0_0_var(--color-orange-dark)] transition-[transform,box-shadow] duration-150 active:translate-y-[3px] active:shadow-[0_1px_0_0_var(--color-orange-dark)] disabled:bg-gray-dark disabled:shadow-none disabled:opacity-70"
        >
          {dailyChallenge.chestOpened ? 'Baú de hoje já aberto' : allDone ? 'Ver baú' : 'Complete para abrir o baú'}
        </button>
      </div>
    </div>
  );
}
