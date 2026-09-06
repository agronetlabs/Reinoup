import { motion } from 'framer-motion';
import type { Motif } from '../../content/types';
import { MotifIcon } from '../illustrations/MotifIcon';

interface ChoiceCardProps {
  children: React.ReactNode;
  selected?: boolean;
  correct?: boolean;
  revealed?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  /** Quando presente, o card vira ilustrado: figura em cima, rótulo embaixo. */
  icon?: Motif;
}

export function ChoiceCard({ children, selected, correct, revealed, onClick, disabled, icon }: ChoiceCardProps) {
  let stateClasses = 'border-navy/10 bg-white';
  if (revealed && selected && correct) stateClasses = 'border-green bg-green-light';
  // Errar não pune: sem vermelho, sem alarme. Azul da marca = "vamos de novo".
  else if (revealed && selected && !correct) stateClasses = 'border-retry bg-retry-soft';
  else if (selected) stateClasses = 'border-orange bg-orange-light/20';

  /* Só o acerto ganha selo. O erro é explicado pelo cordeirinho, não carimbado. */
  const selo = revealed && selected && correct && (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green text-white">✓</span>
  );

  return (
    <motion.button
      type="button"
      whileTap={disabled ? undefined : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`relative min-h-11 w-full rounded-2xl border-2 font-semibold text-navy-deep transition-colors ${
        icon ? 'p-3 text-center' : 'p-4 text-left'
      } ${stateClasses}`}
    >
      {icon ? (
        <div className="flex flex-col items-center gap-2">
          <div className="absolute right-2 top-2">{selo}</div>
          <MotifIcon motif={icon} size={72} />
          <span className="text-sm leading-tight">{children}</span>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <span>{children}</span>
          {selo}
        </div>
      )}
    </motion.button>
  );
}
