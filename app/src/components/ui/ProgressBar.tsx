import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number; // 0-1
  color?: string;
  trackColor?: string;
  height?: number;
  label?: string;
}

export function ProgressBar({
  value,
  color = 'var(--color-orange)',
  trackColor = 'rgba(20,33,61,0.12)',
  height = 10,
  label = 'Progresso',
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(1, value));
  return (
    <div
      className="w-full overflow-hidden rounded-full"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped * 100)}
      style={{ height, background: trackColor }}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${clamped * 100}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      />
    </div>
  );
}
