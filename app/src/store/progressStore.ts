import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProgressState, DailyTaskId, ToastItem } from '../lib/progress-types';
import { todayKey, weekKey } from '../lib/dates';
import { uid } from '../lib/id';
import { touchStreak } from '../lib/streak';
import { newlyUnlockedBadges } from '../lib/badges-engine';
import { isMissionComplete } from '../lib/missions-engine';
import { getBadge } from '../content/badges';
import { getMission } from '../content/missions';
import { getStory } from '../content/stories';
import { getVerse } from '../content/verses';
import { getLevelProgress } from '../content/levels';
import {
  CHAPTER_COINS,
  CHAPTER_XP,
  QUIZ_CORRECT_COINS,
  QUIZ_CORRECT_XP,
  QUIZ_PERFECT_BONUS_COINS,
  VERSE_MEMORIZED_COINS,
  VERSE_MEMORIZED_XP,
  GAME_WIN_COINS,
  GAME_WIN_XP,
  SHIELD_COST_COINS,
  STREAK_MILESTONE_BONUS,
  rollChestReward,
} from '../lib/economy';
import { badgeGrantedItems } from '../content/avatar-items';

const DAILY_TASK_DEFS: { id: DailyTaskId; label: string; target: number }[] = [
  { id: 'ouvir-historia', label: 'Ouça a história de hoje', target: 1 },
  { id: 'acertar-quiz', label: 'Acerte 4 do quiz', target: 4 },
  { id: 'decorar-versiculo', label: 'Decore o versículo', target: 1 },
];

function freshDailyChallenge(date: string): ProgressState['dailyChallenge'] {
  return {
    date,
    chestOpened: false,
    tasks: DAILY_TASK_DEFS.map((d) => ({ ...d, done: false, progress: 0 })),
  };
}

interface ProgressActions {
  ensureFreshDaily: () => void;
  pushToast: (t: Omit<ToastItem, 'id'>) => void;
  dismissToast: (id: string) => void;

  addCoins: (amount: number) => void;
  addXp: (amount: number) => void;

  completeChapter: (storyId: string, chapterIndex: number, totalChapters: number) => void;
  recordChoice: (storyId: string, optionIndex: number) => void;
  submitQuiz: (storyId: string, score: number, total: number) => void;
  collectVerse: (verseId: string) => void;
  learnDisciple: (discipleId: string) => void;

  startVidaRealMission: (missionId: string) => void;
  parentDecideMission: (missionId: string, approve: boolean) => void;

  openDailyChest: () => { coins: number; xp: number; sticker: boolean } | null;
  buyShield: () => boolean;

  recordGameWin: (label: string) => void;
  addActivityMinutes: (minutes: number) => void;

  purchaseAvatarItem: (itemId: string, cost: number) => boolean;
  equipAvatarItem: (kind: 'outfit' | 'accessory' | 'background', itemId: string) => void;

  resetAllProgress: () => void;
}

type Store = ProgressState & ProgressActions;

const initialState: ProgressState = {
  coins: 60,
  xp: 0,
  streakDays: 0,
  lastActiveDate: null,
  shieldsAvailable: 1,
  stories: {},
  versesCollected: [],
  stickersCollected: [],
  badgesUnlocked: [],
  quizHistory: [],
  dailyChallenge: freshDailyChallenge(todayKey()),
  missions: {},
  disciplesLearned: [],
  activityLog: [],
  activityMinutes: {},
  avatar: {
    outfit: 'outfit-azul',
    accessory: 'acc-nenhum',
    background: 'bg-campo',
    unlockedOutfits: ['outfit-azul'],
    unlockedAccessories: ['acc-nenhum'],
    unlockedBackgrounds: ['bg-campo'],
  },
  weeklyXp: { weekKey: weekKey(), xp: 0 },
  usedBeforeSevenAm: false,
  toasts: [],
};

export const useProgressStore = create<Store>()(
  persist(
    (set, get) => {
      function checkBadges() {
        const newly = newlyUnlockedBadges(get());
        if (newly.length === 0) return;
        const toasts: ToastItem[] = [];
        const grantedOutfits: string[] = [];
        const grantedAccessories: string[] = [];
        const grantedBackgrounds: string[] = [];
        for (const id of newly) {
          const badge = getBadge(id);
          toasts.push({ id: uid('toast'), kind: 'badge', title: 'Medalha desbloqueada!', message: badge?.name, icon: badge?.icon });
          for (const item of badgeGrantedItems(id)) {
            if (item.kind === 'outfit') grantedOutfits.push(item.id);
            if (item.kind === 'accessory') grantedAccessories.push(item.id);
            if (item.kind === 'background') grantedBackgrounds.push(item.id);
          }
        }
        set((s) => ({
          badgesUnlocked: [...s.badgesUnlocked, ...newly],
          toasts: [...s.toasts, ...toasts],
          avatar: {
            ...s.avatar,
            unlockedOutfits: Array.from(new Set([...s.avatar.unlockedOutfits, ...grantedOutfits])),
            unlockedAccessories: Array.from(new Set([...s.avatar.unlockedAccessories, ...grantedAccessories])),
            unlockedBackgrounds: Array.from(new Set([...s.avatar.unlockedBackgrounds, ...grantedBackgrounds])),
          },
        }));
      }

      function applyStreak(now = new Date()) {
        const before = get();
        if (!before.usedBeforeSevenAm && now.getHours() < 7) {
          set({ usedBeforeSevenAm: true });
        }
        const result = touchStreak(
          { streakDays: before.streakDays, lastActiveDate: before.lastActiveDate, shieldsAvailable: before.shieldsAvailable },
          now
        );
        if (!result.changed) return;
        set({ streakDays: result.streakDays, lastActiveDate: result.lastActiveDate, shieldsAvailable: result.shieldsAvailable });
        if (result.usedShield) {
          get().pushToast({ kind: 'info', title: 'Escudo usado!', message: 'Seu escudo protegeu sua ofensiva por um dia perdido.', icon: '🛡️' });
        }
        if (result.milestoneHit) {
          const bonus = STREAK_MILESTONE_BONUS[result.milestoneHit];
          if (bonus) {
            get().addCoins(bonus.coins);
            get().addXp(bonus.xp);
          }
          get().pushToast({ kind: 'info', title: `${result.milestoneHit} dias de ofensiva!`, message: 'Continue firme na sua jornada.', icon: '🔥' });
        }
        checkBadges();
      }

      function logActivity(kind: ProgressState['activityLog'][number]['kind'], label: string) {
        set((s) => ({ activityLog: [...s.activityLog, { date: todayKey(), kind, label }].slice(-500) }));
      }

      function bumpDailyTask(taskId: DailyTaskId, incrementBy: number) {
        get().ensureFreshDaily();
        set((s) => {
          const daily = s.dailyChallenge;
          const tasks = daily.tasks.map((t) => {
            if (t.id !== taskId || t.done) return t;
            const progress = Math.min(t.target, t.progress + incrementBy);
            return { ...t, progress, done: progress >= t.target };
          });
          return { dailyChallenge: { ...daily, tasks } };
        });
      }

      function checkAndClaimDerivedMissions() {
        // Trilha / temática / coleção rewards are claimed the moment they first reach target.
        const state = get();
        for (const kind of ['trilha-discipulos', 'tematica-coragem', 'colecao-amor']) {
          if (isMissionComplete(kind, state) && !state.missions[kind]?.completed) {
            const mission = getMission(kind);
            if (!mission) continue;
            set((s) => ({ missions: { ...s.missions, [kind]: { completed: true, pendingParentConfirm: false } } }));
            get().addCoins(mission.reward.coins);
            get().addXp(mission.reward.xp);
            get().pushToast({ kind: 'mission', title: 'Missão concluída!', message: mission.title, icon: '🗺️' });
          }
        }
      }

      return {
        ...initialState,

        ensureFreshDaily: () => {
          const today = todayKey();
          if (get().dailyChallenge.date !== today) {
            set({ dailyChallenge: freshDailyChallenge(today) });
          }
          const wk = weekKey();
          if (get().weeklyXp.weekKey !== wk) {
            set({ weeklyXp: { weekKey: wk, xp: 0 } });
          }
        },

        pushToast: (t) => set((s) => ({ toasts: [...s.toasts, { ...t, id: uid('toast') }] })),
        dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

        addCoins: (amount) => set((s) => ({ coins: Math.max(0, s.coins + amount) })),

        addXp: (amount) => {
          const before = get().xp;
          const beforeLevel = getLevelProgress(before).level;
          const wk = weekKey();
          set((s) => ({
            xp: s.xp + amount,
            weeklyXp: s.weeklyXp.weekKey === wk ? { weekKey: wk, xp: s.weeklyXp.xp + amount } : { weekKey: wk, xp: amount },
          }));
          const afterLevel = getLevelProgress(get().xp).level;
          if (afterLevel > beforeLevel) {
            get().pushToast({ kind: 'levelup', title: `Nível ${afterLevel}!`, message: 'Você subiu de nível!', icon: '🎉' });
          }
        },

        completeChapter: (storyId, chapterIndex, totalChapters) => {
          const story = getStory(storyId);
          if (!story || totalChapters !== story.chapters.length || !Number.isInteger(chapterIndex)
            || chapterIndex < 0 || chapterIndex >= totalChapters
            || chapterIndex > (get().stories[storyId]?.chaptersCompleted ?? 0)) return;
          set((s) => {
            const prev = s.stories[storyId] ?? { chaptersCompleted: 0, completed: false, quizAttempts: 0 };
            const chaptersCompleted = Math.max(prev.chaptersCompleted, chapterIndex + 1);
            return {
              stories: {
                ...s.stories,
                [storyId]: { ...prev, chaptersCompleted, completed: chaptersCompleted >= totalChapters },
              },
            };
          });
          get().addCoins(CHAPTER_COINS);
          get().addXp(CHAPTER_XP);
          bumpDailyTask('ouvir-historia', 1);
          logActivity('historia', getStory(storyId)?.title ?? storyId);
          applyStreak();
          checkAndClaimDerivedMissions();
        },

        recordChoice: (storyId, optionIndex) => {
          set((s) => {
            const prev = s.stories[storyId] ?? { chaptersCompleted: 0, completed: false, quizAttempts: 0 };
            return { stories: { ...s.stories, [storyId]: { ...prev, choiceIndex: optionIndex } } };
          });
        },

        submitQuiz: (storyId, score, total) => {
          const story = getStory(storyId);
          if (!story || total !== story.quiz.length || total <= 0
            || !Number.isInteger(score) || score < 0 || score > total) return;
          set((s) => {
            const prev = s.stories[storyId] ?? { chaptersCompleted: 0, completed: false, quizAttempts: 0 };
            const quizBestScore = Math.max(prev.quizBestScore ?? 0, score);
            return {
              stories: { ...s.stories, [storyId]: { ...prev, quizBestScore, quizAttempts: prev.quizAttempts + 1 } },
              quizHistory: [...s.quizHistory, { storyId, score, total, date: todayKey() }],
            };
          });
          get().addCoins(score * QUIZ_CORRECT_COINS);
          get().addXp(score * QUIZ_CORRECT_XP);
          if (score === total) get().addCoins(QUIZ_PERFECT_BONUS_COINS);
          bumpDailyTask('acertar-quiz', score);
          logActivity('quiz', `Quiz — ${getStory(storyId)?.title ?? storyId}`);
          applyStreak();
          checkBadges();
        },

        collectVerse: (verseId) => {
          if (!getVerse(verseId)) return;
          get().ensureFreshDaily();
          bumpDailyTask('decorar-versiculo', 1);
          if (get().versesCollected.includes(verseId)) return;
          set((s) => ({ versesCollected: [...s.versesCollected, verseId] }));
          get().addCoins(VERSE_MEMORIZED_COINS);
          get().addXp(VERSE_MEMORIZED_XP);
          logActivity('versiculo', getVerse(verseId)?.reference ?? verseId);
          applyStreak();
          checkBadges();
          checkAndClaimDerivedMissions();
        },

        learnDisciple: (discipleId) => {
          if (get().disciplesLearned.includes(discipleId)) return;
          set((s) => ({ disciplesLearned: [...s.disciplesLearned, discipleId] }));
          get().addCoins(6);
          get().addXp(10);
          checkAndClaimDerivedMissions();
        },

        startVidaRealMission: (missionId) => {
          set((s) => ({ missions: { ...s.missions, [missionId]: { completed: false, pendingParentConfirm: true, completedDate: todayKey() } } }));
          get().pushToast({ kind: 'mission', title: 'Enviado para os pais!', message: 'Peça para seu pai ou mãe confirmar na Área dos Pais.', icon: '📨' });
        },

        parentDecideMission: (missionId, approve) => {
          if (!approve) {
            set((s) => {
              const next = { ...s.missions };
              delete next[missionId];
              return { missions: next };
            });
            return;
          }
          const mission = getMission(missionId);
          set((s) => ({ missions: { ...s.missions, [missionId]: { completed: true, pendingParentConfirm: false, completedDate: todayKey() } } }));
          if (mission) {
            get().addCoins(mission.reward.coins);
            get().addXp(mission.reward.xp);
          }
          logActivity('missao', mission?.title ?? missionId);
          checkBadges();
        },

        openDailyChest: () => {
          get().ensureFreshDaily();
          const daily = get().dailyChallenge;
          const allDone = daily.tasks.every((t) => t.done);
          if (!allDone || daily.chestOpened) return null;
          const reward = rollChestReward();
          set((s) => ({ dailyChallenge: { ...s.dailyChallenge, chestOpened: true } }));
          get().addCoins(reward.coins);
          get().addXp(reward.xp);
          if (reward.sticker) {
            const stickerId = uid('sticker');
            set((s) => ({ stickersCollected: [...s.stickersCollected, stickerId] }));
          }
          return reward;
        },

        buyShield: () => {
          if (get().coins < SHIELD_COST_COINS) return false;
          set((s) => ({ coins: s.coins - SHIELD_COST_COINS, shieldsAvailable: s.shieldsAvailable + 1 }));
          return true;
        },

        recordGameWin: (label) => {
          get().addCoins(GAME_WIN_COINS);
          get().addXp(GAME_WIN_XP);
          logActivity('jogo', label);
          applyStreak();
        },

        addActivityMinutes: (minutes) => {
          const today = todayKey();
          set((s) => ({ activityMinutes: { ...s.activityMinutes, [today]: (s.activityMinutes[today] ?? 0) + minutes } }));
        },

        purchaseAvatarItem: (_itemId, cost) => {
          if (get().coins < cost) return false;
          get().addCoins(-cost);
          return true;
        },

        equipAvatarItem: (kind, itemId) => {
          set((s) => ({
            avatar: {
              ...s.avatar,
              outfit: kind === 'outfit' ? itemId : s.avatar.outfit,
              accessory: kind === 'accessory' ? itemId : s.avatar.accessory,
              background: kind === 'background' ? itemId : s.avatar.background,
              unlockedOutfits: kind === 'outfit' ? Array.from(new Set([...s.avatar.unlockedOutfits, itemId])) : s.avatar.unlockedOutfits,
              unlockedAccessories: kind === 'accessory' ? Array.from(new Set([...s.avatar.unlockedAccessories, itemId])) : s.avatar.unlockedAccessories,
              unlockedBackgrounds: kind === 'background' ? Array.from(new Set([...s.avatar.unlockedBackgrounds, itemId])) : s.avatar.unlockedBackgrounds,
            },
          }));
        },

        resetAllProgress: () => set(initialState),
      };
    },
    { name: 'reinoup-progress' }
  )
);
