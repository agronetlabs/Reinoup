import { afterEach, beforeEach, describe, expect, jest, mock, test } from 'bun:test';
import { createQuizSession, quizSessionReducer } from '../src/lib/quiz-session';
import { scheduleChestOpening } from '../src/lib/chest-opening';

describe('quiz session', () => {
  test('ignores duplicate answers and next clicks instead of skipping questions', () => {
    const initial = createQuizSession(2);
    expect(quizSessionReducer(initial, { type: 'next' })).toBe(initial);
    const answered = quizSessionReducer(initial, { type: 'answer', selected: 1, correct: false });
    expect(quizSessionReducer(answered, { type: 'answer', selected: 0, correct: true })).toBe(answered);
    expect(answered.queue).toEqual([0, 1, 0]);
    const next = quizSessionReducer(answered, { type: 'next' });
    expect(quizSessionReducer(next, { type: 'next' })).toBe(next);
    expect(next.pointer).toBe(1);
  });

  test('each retry goes to the end without changing the first-attempt score', () => {
    let state = createQuizSession(1);
    for (let i = 0; i < 3; i++) {
      state = quizSessionReducer(state, { type: 'answer', selected: 1, correct: false });
      state = quizSessionReducer(state, { type: 'next' });
      expect(state.finished).toBe(false);
      expect(state.pointer).toBe(i + 1);
    }
    state = quizSessionReducer(state, { type: 'answer', selected: 0, correct: true });
    state = quizSessionReducer(state, { type: 'next' });
    expect(state.finished).toBe(true);
    expect(state.firstAttempt).toEqual({ 0: false });
  });

  test('completion is terminal and a new round starts clean', () => {
    let state = createQuizSession(1);
    state = quizSessionReducer(state, { type: 'answer', selected: 0, correct: true });
    state = quizSessionReducer(state, { type: 'next' });
    expect(quizSessionReducer(state, { type: 'next' })).toBe(state);
    expect(quizSessionReducer(state, { type: 'answer', selected: 1, correct: false })).toBe(state);
    expect(createQuizSession(3)).toEqual({
      queue: [0, 1, 2], pointer: 0, firstAttempt: {}, selected: null, revealed: false, finished: false,
    });
  });
});

describe('chest reveal lifecycle', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  test('StrictMode setup / cleanup / setup reveals and claims exactly once', () => {
    const reward = { coins: 30, xp: 15, sticker: false };
    const open = mock(() => reward);
    const reveal = mock();
    const celebrate = mock();
    const coin = mock();
    const firstCleanup = scheduleChestOpening(open, reveal, celebrate, coin);
    firstCleanup();
    const cleanup = scheduleChestOpening(open, reveal, celebrate, coin);
    jest.advanceTimersByTime(899);
    expect(open).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(open).toHaveBeenCalledTimes(1);
    expect(reveal).toHaveBeenCalledWith(reward);
    expect(celebrate).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(350);
    expect(coin).toHaveBeenCalledTimes(1);
    cleanup();
  });

  test('leaving before opening cancels both the claim and reveal', () => {
    const open = mock(() => null);
    const reveal = mock();
    const cleanup = scheduleChestOpening(open, reveal, mock(), mock());
    cleanup();
    jest.advanceTimersByTime(2000);
    expect(open).not.toHaveBeenCalled();
    expect(reveal).not.toHaveBeenCalled();
  });

  test('leaving after reveal cancels the delayed sound', () => {
    const coin = mock();
    const cleanup = scheduleChestOpening(() => ({ coins: 30, xp: 15, sticker: false }), mock(), mock(), coin);
    jest.advanceTimersByTime(900);
    cleanup();
    jest.advanceTimersByTime(350);
    expect(coin).not.toHaveBeenCalled();
  });

  test('unavailable chest still ends the opening state without reward sounds', () => {
    const reveal = mock();
    const celebrate = mock();
    const coin = mock();
    const cleanup = scheduleChestOpening(() => null, reveal, celebrate, coin);
    jest.advanceTimersByTime(2000);
    expect(reveal).toHaveBeenCalledWith(null);
    expect(celebrate).not.toHaveBeenCalled();
    expect(coin).not.toHaveBeenCalled();
    cleanup();
  });
});
