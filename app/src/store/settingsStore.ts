import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AgeBand } from '../content/types';

export interface ContentToggles {
  historias: boolean;
  jogos: boolean;
  desafiosDiarios: boolean;
  versiculoDoDia: boolean;
  missoesVidaReal: boolean;
}

export interface NotificationToggles {
  desafiosDiarios: boolean;
  versiculoDoDia: boolean;
  relatorioSemanal: boolean;
  novosConteudos: boolean;
}

export type WeekdayCode = 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom';
export const ALL_WEEKDAYS: WeekdayCode[] = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];

interface SettingsState {
  ageBand: AgeBand;
  contentToggles: ContentToggles;
  screenTimeEnabled: boolean;
  dailyTimeLimitMin: number;
  allowedFrom: string;
  allowedTo: string;
  allowedDays: WeekdayCode[];
  pausedManually: boolean;
  notifications: NotificationToggles;
  soundEffectsEnabled: boolean;

  setAgeBand: (b: AgeBand) => void;
  toggleContent: (key: keyof ContentToggles) => void;
  toggleSoundEffects: () => void;
  setScreenTimeEnabled: (enabled: boolean) => void;
  setDailyTimeLimit: (min: number) => void;
  setAllowedHours: (from: string, to: string) => void;
  toggleWeekday: (day: WeekdayCode) => void;
  setPaused: (paused: boolean) => void;
  toggleNotification: (key: keyof NotificationToggles) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ageBand: '8-10',
      contentToggles: {
        historias: true,
        jogos: true,
        desafiosDiarios: true,
        versiculoDoDia: true,
        missoesVidaReal: true,
      },
      screenTimeEnabled: false,
      dailyTimeLimitMin: 60,
      allowedFrom: '08:00',
      allowedTo: '20:00',
      allowedDays: [...ALL_WEEKDAYS],
      pausedManually: false,
      notifications: {
        desafiosDiarios: true,
        versiculoDoDia: true,
        relatorioSemanal: true,
        novosConteudos: true,
      },
      soundEffectsEnabled: true,

      setAgeBand: (b) => set({ ageBand: b }),
      toggleContent: (key) => set((s) => ({ contentToggles: { ...s.contentToggles, [key]: !s.contentToggles[key] } })),
      toggleSoundEffects: () => set((s) => ({ soundEffectsEnabled: !(s.soundEffectsEnabled ?? true) })),
      setScreenTimeEnabled: (enabled) => set({ screenTimeEnabled: enabled }),
      setDailyTimeLimit: (min) => set({ dailyTimeLimitMin: Math.max(10, Math.min(240, min)) }),
      setAllowedHours: (from, to) => set({ allowedFrom: from, allowedTo: to }),
      toggleWeekday: (day) =>
        set((s) => ({
          allowedDays: s.allowedDays.includes(day) ? s.allowedDays.filter((d) => d !== day) : [...s.allowedDays, day],
        })),
      setPaused: (paused) => set({ pausedManually: paused }),
      toggleNotification: (key) => set((s) => ({ notifications: { ...s.notifications, [key]: !s.notifications[key] } })),
    }),
    {
      name: 'reinoup-settings',
      version: 1,
      migrate: (persisted) => {
        const settings = { ...(persisted as Record<string, unknown>) };
        delete settings.plan;
        delete settings.billingCycle;
        return settings as unknown as SettingsState;
      },
    }
  )
);
