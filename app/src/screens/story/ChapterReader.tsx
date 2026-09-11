import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { TopBar } from '../../components/ui/TopBar';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { ChoiceCard } from '../../components/ui/ChoiceCard';
import { SpeechBubble } from '../../components/mascot/SpeechBubble';
import { Scene } from '../../components/illustrations/Scene';
import { getStory, pagesForAge } from '../../content/stories';
import { useProgressStore } from '../../store/progressStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useStoryAudio } from '../../hooks/useStoryAudio';
import { useAppLock } from '../../hooks/useAppLock';
import { getStoryAudioPath } from '../../lib/story-audio';

export function ChapterReader() {
  const { storyId, chapterIndex: chapterIndexParam } = useParams<{ storyId: string; chapterIndex: string }>();
  const navigate = useNavigate();
  const completeChapter = useProgressStore((s) => s.completeChapter);
  const recordChoice = useProgressStore((s) => s.recordChoice);
  const { locked } = useAppLock();
  const { play, stop, isPlaying, isStudioAudio, error: audioError } = useStoryAudio(!locked);
  const ageBand = useSettingsStore((s) => s.ageBand);

  const story = storyId ? getStory(storyId) : undefined;
  const chapterIndex = Number(chapterIndexParam ?? 0);
  const chapter = story?.chapters[chapterIndex];

  useEffect(() => stop(), [stop, chapter?.id, ageBand]);

  const [pageIndex, setPageIndex] = useState(0);
  const [choiceIndex, setChoiceIndex] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  /** A narração muda conforme a faixa etária definida na Área dos Pais. */
  const pages = useMemo(() => (chapter ? pagesForAge(chapter, ageBand) : []), [chapter, ageBand]);

  const totalSteps = useMemo(() => pages.length + (chapter?.choice ? 1 : 0), [pages, chapter]);
  const atChoiceStep = chapter ? pageIndex === pages.length : false;

  if (!story || !chapter) return <Navigate to="/app/historias" replace />;

  const overallProgress = (chapterIndex + (pageIndex + 1) / totalSteps) / story.chapters.length;

  function goToNextChapterOrQuiz() {
    if (!story) return;
    completeChapter(story.id, chapterIndex, story.chapters.length);
    if (chapter?.choice && choiceIndex !== null) recordChoice(story.id, choiceIndex);
    stop();
    if (chapterIndex + 1 < story.chapters.length) {
      navigate(`/app/historia/${story.id}/capitulo/${chapterIndex + 1}`, { replace: true });
    } else {
      navigate(`/app/historia/${story.id}/quiz`, { replace: true });
    }
  }

  function handleNext() {
    stop();
    if (pageIndex + 1 < totalSteps) {
      setPageIndex((p) => p + 1);
    } else {
      goToNextChapterOrQuiz();
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream pb-8">
      <TopBar title={story.title} backTo={`/app/historia/${story.id}`} right={<span className="text-lg">Aa</span>} />
      <div className="px-4">
        <ProgressBar value={overallProgress} color="var(--color-green)" />
      </div>

      <div className="flex flex-1 flex-col px-4 pt-4">
        <AnimatePresence mode="wait">
          {!atChoiceStep ? (
            <motion.div key={`page-${pageIndex}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
              <Scene scene={chapter.scene} artId={chapter.id} showGuide height={220} />
              <h2 className="font-display text-center text-lg font-bold text-navy">{chapter.title}</h2>
              <p className="text-center text-lg leading-relaxed text-navy-deep">{pages[pageIndex]}</p>
            </motion.div>
          ) : (
            <motion.div key="choice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
              <h2 className="font-display text-center text-lg font-bold text-navy">{chapter.choice!.question}</h2>
              <div className="flex flex-col gap-3">
                {chapter.choice!.options.map((opt, i) => (
                  <ChoiceCard
                    key={i}
                    selected={choiceIndex === i}
                    correct={opt.correct}
                    revealed={revealed && choiceIndex === i}
                    disabled={revealed}
                    onClick={() => {
                      setChoiceIndex(i);
                      setRevealed(true);
                    }}
                  >
                    {opt.text}
                  </ChoiceCard>
                ))}
              </div>
              {revealed && choiceIndex !== null && (
                <SpeechBubble pose={chapter.choice!.options[choiceIndex].correct ? 'comemorando' : 'pensando'} tone={chapter.choice!.options[choiceIndex].correct ? 'success' : 'neutral'}>
                  {chapter.choice!.options[choiceIndex].feedback}
                </SpeechBubble>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center gap-3 border-t border-navy/10 px-4 pt-4">
        {!atChoiceStep && (
          <button
            onClick={() => {
              if (isPlaying) {
                stop();
              } else {
                const audioUrl = getStoryAudioPath(story.id, chapter.id, pageIndex, ageBand);
                play(audioUrl, pages[pageIndex]);
              }
            }}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange text-white shadow-[0_6px_0_0_var(--color-orange-dark)] transition active:scale-95"
            aria-label={isPlaying ? 'Pausar narração' : 'Ouvir narração'}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        )}
        {!atChoiceStep && (
          <p role="status" className="flex-1 text-sm font-semibold text-navy">
            {audioError ?? (isPlaying
              ? isStudioAudio
                ? 'Ouvindo narração de estúdio...'
                : 'Narrando...'
              : 'Toque para ouvir')}
          </p>
        )}
        <Button
          onClick={handleNext}
          disabled={atChoiceStep && (choiceIndex === null || !revealed)}
          className={atChoiceStep ? 'flex-1' : ''}
          icon={atChoiceStep ? undefined : undefined}
        >
          {atChoiceStep ? 'Continuar' : pageIndex + 1 >= totalSteps ? 'Concluir' : '→'}
        </Button>
      </div>
    </div>
  );
}
