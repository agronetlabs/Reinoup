import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { MascotOficial, type MascotPose } from './MascotOficial';

interface SpeechBubbleProps {
  children: ReactNode;
  pose?: MascotPose;
  tone?: 'success' | 'neutral' | 'info';
  mascotSize?: number;
}

const TONE_BG: Record<NonNullable<SpeechBubbleProps['tone']>, string> = {
  success: 'bg-green-light text-green-dark',
  neutral: 'bg-cream-dark text-navy-deep',
  info: 'bg-orange-light/30 text-navy-deep',
};

export function SpeechBubble({ children, pose = 'feliz', tone = 'neutral', mascotSize = 64 }: SpeechBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-end gap-2"
    >
      <div className="shrink-0">
        <MascotOficial pose={pose} size={mascotSize} />
      </div>
      <div className={`relative rounded-3xl rounded-bl-md px-4 py-3 font-semibold leading-snug ${TONE_BG[tone]}`}>
        {children}
      </div>
    </motion.div>
  );
}
