import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { isApproved3DImageSource } from '../../../shared/card-art-policy';
import type { Motif } from '../../content/types';
import { ThreeDArtPlaceholder } from '../illustrations/ThreeDArtPlaceholder';
import type { QuizCardImage } from '../../../shared/quiz-card-art';

interface ChoiceCardProps {
  children: React.ReactNode;
  selected?: boolean;
  correct?: boolean;
  revealed?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  /** Quando presente, o card vira ilustrado: figura em cima, rótulo embaixo. */
  icon?: Motif;
  image?: QuizCardImage;
}

export function ChoiceCard({ children, selected, correct, revealed, onClick, disabled, icon, image }: ChoiceCardProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();
  const showImage = image && isApproved3DImageSource(image.src) && failedSource !== image.src;
  const illustrated = Boolean(icon || image);
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
      whileTap={disabled || reducedMotion ? undefined : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`relative min-h-11 w-full rounded-2xl border-2 font-semibold text-navy-deep transition-colors ${
        image ? 'overflow-hidden p-0 text-center shadow-[var(--shadow-card)]' : icon ? 'p-3 text-center' : 'p-4 text-left'
      } ${stateClasses}`}
    >
      {illustrated ? (
        <div className={`flex flex-col items-center ${image ? '' : 'gap-2'}`}>
          <div className="absolute right-2 top-2 z-10">{selo}</div>
          {showImage ? (
            <img
              src={image.src}
              alt={image.alt}
              width={512}
              height={384}
              decoding="async"
              className="aspect-[4/3] w-full object-cover"
              onError={() => {
                console.warn(`Ilustração indisponível no card: ${image.src}`);
                setFailedSource(image.src);
              }}
            />
          ) : (
            <ThreeDArtPlaceholder
              label={image?.alt ?? (icon ? 'Figura da resposta' : 'Ilustração')}
              compact={Boolean(image)}
              className={image ? 'aspect-[4/3]' : 'min-h-24'}
            />
          )}
          <span className={image ? 'flex min-h-14 w-full items-center justify-center px-3 py-2 font-display text-base font-bold leading-tight' : 'text-sm leading-tight'}>{children}</span>
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
