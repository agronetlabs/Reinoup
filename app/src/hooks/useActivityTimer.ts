import { useEffect, useRef } from 'react';
import { useProgressStore } from '../store/progressStore';

const FLUSH_INTERVAL_MS = 30_000;

/** Accumulates real foreground time and periodically flushes minutes into progressStore for the parent report. */
export function useActivityTimer(active = true) {
  const addActivityMinutes = useProgressStore((s) => s.addActivityMinutes);
  const secondsRef = useRef(0);

  useEffect(() => {
    let lastTick = Date.now();
    let visible = document.visibilityState === 'visible';

    const tick = () => {
      const now = Date.now();
      if (active && visible) {
        secondsRef.current += (now - lastTick) / 1000;
      }
      lastTick = now;
    };

    const flush = () => {
      const minutes = Math.floor(secondsRef.current / 60);
      if (minutes > 0) {
        addActivityMinutes(minutes);
        secondsRef.current -= minutes * 60;
      }
    };

    const interval = setInterval(() => {
      tick();
      flush();
    }, FLUSH_INTERVAL_MS);

    const onVisibility = () => {
      tick();
      flush();
      visible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(interval);
      tick();
      flush();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [active, addActivityMinutes]);
}
