import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useProgressStore } from '../../store/progressStore';

const AUTO_DISMISS_MS = 3400;

export function ToastHost() {
  const toasts = useProgressStore((s) => s.toasts);
  const dismissToast = useProgressStore((s) => s.dismissToast);

  useEffect(() => {
    if (toasts.length === 0) return;
    const id = setTimeout(() => dismissToast(toasts[0].id), AUTO_DISMISS_MS);
    return () => clearTimeout(id);
  }, [toasts, dismissToast]);

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex flex-col items-center gap-2 px-4 safe-top">
      <AnimatePresence>
        {toasts.slice(0, 2).map((t) => (
          <motion.div
            key={t.id}
            initial={{ y: -40, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.95 }}
            role="status"
            aria-live="polite"
            className="pointer-events-auto flex max-w-sm items-center gap-3 rounded-2xl bg-navy px-4 py-3 text-white shadow-[var(--shadow-soft)]"
          >
            {t.icon && <span className="text-2xl leading-none">{t.icon}</span>}
            <div>
              <p className="font-display text-sm font-bold leading-tight">{t.title}</p>
              {t.message && <p className="text-xs text-white/80 leading-tight">{t.message}</p>}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}
