import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Motif } from '../../content/types';
import { MotifIcon } from '../illustrations/MotifIcon';
import { isApprovedQuizCardImage, type QuizCardImage } from '../../../shared/quiz-card-art';

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
  const approvedImage = isApprovedQuizCardImage(image, import.meta.env?.BASE_URL || '/') ? image : undefined;
  const showImage = approvedImage && failedSource !== approvedImage.src;
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
      data-art-status={illustrated ? showImage ? 'approved-3d' : 'legacy-fallback' : undefined}
      className={`relative min-h-11 w-full rounded-2xl border-2 font-semibold text-navy-deep transition-colors ${
        image ? 'overflow-hidden p-0 text-center shadow-[var(--shadow-card)]' : icon ? 'p-3 text-center' : 'p-4 text-left'
      } ${stateClasses}`}
    >
      {illustrated ? (
        <div className={`flex flex-col items-center ${image ? '' : 'gap-2'}`}>
          <div className="absolute right-2 top-2 z-10">{selo}</div>
          {showImage ? (
            <img
              src={approvedImage.src}
              alt={approvedImage.alt}
              width={512}
              height={384}
              decoding="async"
              className="aspect-[4/3] w-full object-cover"
              onError={() => {
                console.warn(`Ilustração indisponível no card: ${approvedImage.src}`);
                setFailedSource(approvedImage.src);
              }}
            />
          ) : (
            <div className={image ? 'flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 bg-cream' : undefined}>
              {icon && <MotifIcon motif={icon} size={72} />}
              {image && <span className="text-xs text-navy">Ilustração indisponível</span>}
            </div>
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
