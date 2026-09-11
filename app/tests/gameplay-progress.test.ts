import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'bun:test';
import { STORIES } from '../src/content/stories';
import { todayKey } from '../src/lib/dates';
import { CHAPTER_COINS, CHAPTER_XP } from '../src/lib/economy';

let store: typeof import('../src/store/progressStore').useProgressStore;
const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');

beforeAll(async () => {
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { localStorage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    } },
  });
  store = (await import('../src/store/progressStore')).useProgressStore;
});

afterAll(() => {
  if (previousWindow) Object.defineProperty(globalThis, 'window', previousWindow);
  else Reflect.deleteProperty(globalThis, 'window');
});

beforeEach(() => {
  store.getState().resetAllProgress();
  store.getState().ensureFreshDaily();
  store.setState({ lastActiveDate: todayKey(), usedBeforeSevenAm: true });
});

describe('daily rewards', () => {
  function readyChest(date = todayKey()) {
    const daily = store.getState().dailyChallenge;
    store.setState({ dailyChallenge: {
      ...daily, date, chestOpened: false,
      tasks: daily.tasks.map((task) => ({ ...task, progress: task.target, done: true })),
    } });
  }

  test('yesterday completed tasks cannot redeem a chest today', () => {
    readyChest('2000-01-01');
    const coins = store.getState().coins;
    expect(store.getState().openDailyChest()).toBeNull();
    expect(store.getState().coins).toBe(coins);
    expect(store.getState().dailyChallenge.date).toBe(todayKey());
    expect(store.getState().dailyChallenge.tasks.every((task) => !task.done)).toBe(true);
  });

  test('marks the chest claimed before notifying reward subscribers', () => {
    readyChest();
    const coins = store.getState().coins;
    let nestedReward: unknown = 'not called';
    const unsubscribe = store.subscribe((state, previous) => {
      if (state.coins !== previous.coins) nestedReward = state.openDailyChest();
    });
    const reward = store.getState().openDailyChest();
    unsubscribe();
    expect(reward).not.toBeNull();
    expect(nestedReward).toBeNull();
    expect(store.getState().coins).toBe(coins + reward!.coins);
    expect(store.getState().openDailyChest()).toBeNull();
  });

  test('gameplay after midnight progresses today rather than yesterday', () => {
    readyChest('2000-01-01');
    const story = STORIES[0];
    store.getState().completeChapter(story.id, 0, story.chapters.length);
    const daily = store.getState().dailyChallenge;
    expect(daily.date).toBe(todayKey());
    expect(daily.tasks.find((task) => task.id === 'ouvir-historia')?.done).toBe(true);
    expect(daily.tasks.find((task) => task.id === 'acertar-quiz')?.progress).toBe(0);
  });
});

describe('gameplay inputs', () => {
  test('chapter indices cannot skip unread content or forge completion', () => {
    const story = STORIES[0];
    for (const index of [-1, 0.5, NaN, story.chapters.length, 1]) {
      store.getState().completeChapter(story.id, index, story.chapters.length);
    }
    store.getState().completeChapter(story.id, 0, 1);
    expect(store.getState().stories[story.id]).toBeUndefined();
    expect(store.getState().coins).toBe(60);
  });

  test('ordered chapter completion and legitimate rereading keep existing rewards', () => {
    const story = STORIES[0];
    store.getState().completeChapter(story.id, 0, story.chapters.length);
    store.getState().completeChapter(story.id, 0, story.chapters.length);
    expect(store.getState().stories[story.id].chaptersCompleted).toBe(1);
    expect(store.getState().coins).toBe(60 + CHAPTER_COINS * 2);
    expect(store.getState().xp).toBe(CHAPTER_XP * 2);
  });

  test('invalid quiz scores cannot award coins or record bogus attempts', () => {
    const story = STORIES[0];
    for (const score of [-1, 0.5, NaN, Infinity, story.quiz.length + 1]) {
      store.getState().submitQuiz(story.id, score, story.quiz.length);
    }
    store.getState().submitQuiz(story.id, 0, 0);
    store.getState().submitQuiz('missing-story', 1, 1);
    expect(store.getState().quizHistory).toEqual([]);
    expect(store.getState().coins).toBe(60);
  });
});
