import type { CSSProperties } from 'react';

interface ThreeDArtPlaceholderProps {
  label?: string;
  compact?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function ThreeDArtPlaceholder({ label = 'Ilustração', compact = false, className = '', style }: ThreeDArtPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={`${label}: arte 3D em produção`}
      style={style}
      className={`flex h-full min-h-20 w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_25%_20%,rgba(255,201,60,0.42),transparent_34%),linear-gradient(145deg,var(--color-navy),var(--color-blue))] text-white ${className}`}
    >
      <div className={`flex items-center gap-2 text-center ${compact ? 'flex-col gap-1' : 'px-4'}`}>
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-white/15 font-display text-xs font-extrabold tracking-wide">
          3D
        </span>
        <span className="font-display text-xs font-bold leading-tight text-white/90">
          Arte 3D em produção
        </span>
      </div>
    </div>
  );
}
