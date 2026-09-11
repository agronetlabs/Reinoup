import type { AgeBand, Chapter, QuizQuestion, Story } from '../src/content/types';
import type { VoiceRole } from './voice-policy';

export const AUDIO_PILOT_STORY_ID = 'gn-02-adao-eva';
export const QUIZ_POSITIVE_FEEDBACK = 'Muito bem!';
export interface AudioSegmentSource {
  storyId: string;
  segmentId: string;
  ageBand: AgeBand;
  role: VoiceRole;
  text: string;
  chapterId?: string;
  pageIndex?: number;
}

function segment(storyId: string, ageBand: AgeBand, segmentId: string, role: VoiceRole, text: string): AudioSegmentSource {
  return { storyId, ageBand, segmentId, role, text };
}

export function choiceAudioSegments(storyId: string, chapter: Chapter, age: AgeBand, selected: number | null = null): AudioSegmentSource[] {
  if (storyId !== AUDIO_PILOT_STORY_ID || !chapter.choice) return [];
  if (selected !== null) {
    const option = chapter.choice.options[selected];
    return option ? [segment(storyId, age, `${chapter.id}-choice-feedback-${selected + 1}`, 'explanation', option.feedback)] : [];
  }
  return [
    segment(storyId, age, `${chapter.id}-choice-question`, 'challenge', chapter.choice.question),
    ...chapter.choice.options.map((option, index) =>
      segment(storyId, age, `${chapter.id}-choice-option-${index + 1}`, 'challenge', option.text)),
  ];
}

export function quizAudioSegments(storyId: string, question: QuizQuestion, age: AgeBand, selected: number | null = null): AudioSegmentSource[] {
  if (storyId !== AUDIO_PILOT_STORY_ID) return [];
  if (selected !== null) {
    if (!Number.isInteger(selected) || selected < 0 || selected >= question.options.length) return [];
    const explanation = segment(storyId, age, `${question.id}-explanation`, 'explanation', question.explanation);
    return selected === question.correctIndex
      ? [segment(storyId, age, 'quiz-positive-feedback', 'mascot', QUIZ_POSITIVE_FEEDBACK), explanation]
      : [explanation];
  }
  return [
    segment(storyId, age, `${question.id}-question`, 'challenge', question.question),
    ...question.options.map((text, index) => segment(storyId, age, `${question.id}-option-${index + 1}`, 'challenge', text)),
  ];
}

export function summaryAudioSegments(story: Story, age: AgeBand): AudioSegmentSource[] {
  if (story.id !== AUDIO_PILOT_STORY_ID) return [];
  return [
    segment(story.id, age, 'summary-lesson', 'explanation', story.licao),
    segment(story.id, age, 'summary-phrase', 'narration', story.fraseMemoravel),
    segment(story.id, age, 'summary-prayer', 'mascot', story.oracao),
  ];
}

export function storyAudioInventory(story: Story, age: AgeBand): AudioSegmentSource[] {
  const pages = story.chapters.flatMap(chapter => chapter.pages[age].map((text, pageIndex) => ({
    ...segment(story.id, age, `${chapter.id}-p${pageIndex + 1}`, 'narration', text),
    chapterId: chapter.id, pageIndex,
  })));
  if (story.id !== AUDIO_PILOT_STORY_ID) return pages;
  const guide = [
    ...story.chapters.flatMap(chapter => [
      ...choiceAudioSegments(story.id, chapter, age),
      ...(chapter.choice?.options.flatMap((_, index) => choiceAudioSegments(story.id, chapter, age, index)) ?? []),
    ]),
    ...story.quiz.flatMap(question => [
      ...quizAudioSegments(story.id, question, age),
      ...quizAudioSegments(story.id, question, age, question.correctIndex),
    ]),
    ...summaryAudioSegments(story, age),
  ];
  return [...pages, ...new Map(guide.map(item => [item.segmentId, item])).values()];
}
