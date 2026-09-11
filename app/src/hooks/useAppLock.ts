import { useState, useEffect } from 'react';
import { useSettingsStore, type WeekdayCode } from '../store/settingsStore';
import { useProgressStore } from '../store/progressStore';
import { isWithinAllowedHours, todayKey } from '../lib/dates';

export interface AppLockState {
  locked: boolean;
  reason: 'paused' | 'outside-hours' | 'time-limit' | null;
}

function todayCode(): WeekdayCode {
  const jsDay = new Date().getDay(); // 0=Sun..6=Sat
  const map = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'] as const;
  return map[jsDay];
}

/** Recomputed every 30s so a limit reached mid-session locks the child UI in place (no data loss, just an overlay). */
export function useAppLock(): AppLockState {
  const settings = useSettingsStore();
  const activityMinutes = useProgressStore((s) => s.activityMinutes);
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  if (settings.pausedManually) return { locked: true, reason: 'paused' };

  // Parental screen-time control is opt-in: no schedule lock until a parent enables it.
  if (!settings.screenTimeEnabled) return { locked: false, reason: null };

  const dayCode = todayCode();
  if (!settings.allowedDays.includes(dayCode)) return { locked: true, reason: 'outside-hours' };

  if (!isWithinAllowedHours(new Date(), settings.allowedFrom, settings.allowedTo)) {
    return { locked: true, reason: 'outside-hours' };
  }

  const minutesToday = activityMinutes[todayKey()] ?? 0;
  if (minutesToday >= settings.dailyTimeLimitMin) return { locked: true, reason: 'time-limit' };

  return { locked: false, reason: null };
}
