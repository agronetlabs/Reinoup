import { useEffect, useReducer, useRef } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { TopBar } from '../../components/ui/TopBar';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { ChoiceCard } from '../../components/ui/ChoiceCard';
import { SpeechBubble } from '../../components/mascot/SpeechBubble';
import { getStory } from '../../content/stories';
import { useProgressStore } from '../../store/progressStore';
import { sfx } from '../../lib/sfx';
import type { Story } from '../../content/types';
import { createQuizSession, quizSessionReducer } from '../../lib/quiz-session';

export function Quiz() {
  const { storyId } = useParams<{ storyId: string }>();
  const progress = useProgressStore((s) => storyId ? s.stories[storyId] : undefined);
  const story = storyId ? getStory(storyId) : undefined;
  if (!story) return <Navigate to="/app/historias" replace />;
  if (!progress?.completed) return <Navigate to={`/app/historia/${story.id}`} replace />;
  return <QuizRound key={story.id} story={story} />;
}

function QuizRound({ story }: { story: Story }) {
  const navigate = useNavigate();
  const submitQuiz = useProgressStore((s) => s.submitQuiz);
  const total = story.quiz.length;
  const [{ queue, pointer, firstAttempt, selected, revealed, finished }, dispatch] = useReducer(quizSessionReducer, total, createQuizSession);
  const submitted = useRef(false);

  useEffect(() => {
    if (!finished || submitted.current) return;
    submitted.current = true;
    const score = Object.values(firstAttempt).filter(Boolean).length;
    submitQuiz(story.id, score, total);
    navigate(`/app/historia/${story.id}/resultado`, { replace: true, state: { score, total } });
  }, [finished, firstAttempt, navigate, story.id, submitQuiz, total]);

  const currentQIndex = queue[pointer];
  const question = story.quiz[currentQIndex];

  const displayNumber = Math.min(pointer + 1, total);

  function selectOption(optIndex: number) {
    if (revealed || !question) return;
    const isCorrect = optIndex === question.correctIndex;
    dispatch({ type: 'answer', selected: optIndex, correct: isCorrect });

    if (isCorrect) {
      sfx.success();
    } else {
      sfx.retry();
    }
  }

  function handleNext() {
    dispatch({ type: 'next' });
  }

  if (!question) return null;

  return (
    <div className="flex min-h-screen flex-col bg-cream pb-8">
      <TopBar title="Quiz" backTo={`/app/historia/${story.id}`} right={<span className="text-sm font-bold text-navy/60">{displayNumber}/{total}</span>} />
      <div className="px-4">
        <ProgressBar value={displayNumber / total} color="var(--color-green)" />
      </div>

      <div className="flex flex-1 flex-col gap-5 px-4 pt-6">
        <AnimatePresence mode="wait">
          <motion.div key={`${currentQIndex}-${pointer}`} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="flex flex-col gap-4">
            <h2 className="font-display text-center text-xl font-bold text-navy">{question.question}</h2>
            {/* Com figuras vira grade 2×2 — a criança que ainda não lê responde pela imagem. */}
            <div className={question.optionIcons ? 'grid grid-cols-2 gap-3' : 'grid grid-cols-1 gap-3'}>
              {question.options.map((opt, i) => (
                <ChoiceCard
                  key={i}
                  selected={selected === i}
                  correct={i === question.correctIndex}
                  revealed={revealed && (selected === i || i === question.correctIndex)}
                  disabled={revealed}
                  onClick={() => selectOption(i)}
                  icon={question.optionIcons?.[i]}
                >
                  {opt}
                </ChoiceCard>
              ))}
            </div>
            {revealed && (
              <SpeechBubble pose={selected === question.correctIndex ? 'comemorando' : 'pensando'} tone={selected === question.correctIndex ? 'success' : 'info'}>
                {selected === question.correctIndex ? 'Muito bem!' : question.explanation}
              </SpeechBubble>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-4 pt-4">
        <Button full size="lg" disabled={!revealed || finished} onClick={handleNext}>
          {pointer + 1 < queue.length ? 'Próxima' : 'Ver resultado'}
        </Button>
      </div>
    </div>
  );
}
