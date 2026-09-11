export interface QuizSessionState {
  queue: number[];
  pointer: number;
  firstAttempt: Record<number, boolean>;
  selected: number | null;
  revealed: boolean;
  finished: boolean;
}

export function createQuizSession(total: number): QuizSessionState {
  return {
    queue: Array.from({ length: total }, (_, i) => i),
    pointer: 0,
    firstAttempt: {},
    selected: null,
    revealed: false,
    finished: false,
  };
}

export type QuizSessionAction =
  | { type: 'answer'; selected: number; correct: boolean }
  | { type: 'next' };

export function quizSessionReducer(state: QuizSessionState, action: QuizSessionAction): QuizSessionState {
  if (state.finished || state.queue.length === 0) return state;
  if (action.type === 'answer') {
    if (state.revealed) return state;
    const question = state.queue[state.pointer];
    return {
      ...state,
      selected: action.selected,
      revealed: true,
      firstAttempt: question in state.firstAttempt
        ? state.firstAttempt
        : { ...state.firstAttempt, [question]: action.correct },
      queue: action.correct ? state.queue : [...state.queue, question],
    };
  }
  if (!state.revealed) return state;
  if (state.pointer + 1 === state.queue.length) return { ...state, finished: true };
  return { ...state, pointer: state.pointer + 1, selected: null, revealed: false };
}
