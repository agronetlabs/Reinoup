import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  title?: ReactNode;
  onBack?: () => void;
  backTo?: string;
  right?: ReactNode;
  transparent?: boolean;
  dark?: boolean;
}

export function TopBar({ title, onBack, backTo, right, transparent, dark }: TopBarProps) {
  const navigate = useNavigate();

  function handleBack() {
    if (onBack) return onBack();
    if (backTo) return navigate(backTo);
    navigate(-1);
  }

  return (
    <div className={`flex items-center gap-3 px-4 py-3 safe-top ${transparent ? '' : dark ? '' : 'bg-cream'}`}>
      <button
        onClick={handleBack}
        aria-label="Voltar"
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${dark ? 'bg-white/10 text-white' : 'bg-white text-orange shadow-[var(--shadow-card)]'}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {title && <h1 className={`font-display min-w-0 flex-1 text-center text-lg font-bold ${dark ? 'text-white' : 'text-navy'}`}>{title}</h1>}
      <div className="flex min-h-11 min-w-11 shrink-0 items-center justify-end">{right}</div>
    </div>
  );
}
