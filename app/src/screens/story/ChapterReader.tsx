import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { choiceAudioSegments, AUDIO_PILOT_STORY_ID } from '../../../shared/story-audio-segments';
import { StorySegmentAudio } from '../../components/ui/StorySegmentAudio';
import { stopActiveStoryAudio } from '../../lib/story-audio-player';
import { TopBar } from '../../components/ui/TopBar';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { ChoiceCard } from '../../components/ui/ChoiceCard';
import { SpeechBubble } from '../../components/mascot/SpeechBubble';
import { Scene } from '../../components/illustrations/Scene';
import { getStory, pagesForAge } from '../../content/stories';
import type { AgeBand } from '../../content/types';
import { useProgressStore } from '../../store/progressStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useStoryAudio } from '../../hooks/useStoryAudio';
import { useAppLock } from '../../hooks/useAppLock';
import {
  getStoryAudioPageUrl,
  loadStoryAudioPage,
  type StoryAudioCue,
  type StoryAudioPage,
} from '../../lib/story-audio';

function NarratedText({ text, cue }: { text: string; cue: StoryAudioCue | null }) {
  if (!cue || cue.characterStart < 0 || cue.characterEnd > text.length) return <>{text}</>;
  return <>
    {text.slice(0, cue.characterStart)}
    <mark className="rounded bg-yellow/45 px-0.5 text-inherit">{text.slice(cue.characterStart, cue.characterEnd)}</mark>
    {text.slice(cue.characterEnd)}
  </>;
}

export function ChapterReader() {
  const { storyId, chapterIndex: chapterIndexParam } = useParams<{ storyId: string; chapterIndex: string }>();
  const ageBand = useSettingsStore((s) => s.ageBand);
  return <ChapterReaderSession
    key={`${storyId}:${chapterIndexParam}:${ageBand}`}
    storyId={storyId}
    chapterIndexParam={chapterIndexParam}
    ageBand={ageBand}
  />;
}

function ChapterReaderSession({ storyId, chapterIndexParam, ageBand }: {
  storyId: string | undefined;
  chapterIndexParam: string | undefined;
  ageBand: AgeBand;
}) {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const completeChapter = useProgressStore((s) => s.completeChapter);
  const recordChoice = useProgressStore((s) => s.recordChoice);
  const { locked } = useAppLock();
  const { play, stop, pause, resume, isPlaying, isPaused, isStudioAudio, error: audioError, progress, activeCue } = useStoryAudio(!locked);

  const story = storyId ? getStory(storyId) : undefined;
  const chapterIndex = Number(chapterIndexParam ?? 0);
  const chapter = story?.chapters[chapterIndex];

  const [pageIndex, setPageIndex] = useState(0);
  useEffect(() => stop(), [stop, chapter?.id, ageBand, pageIndex]);
  const [choiceIndex, setChoiceIndex] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [audioPage, setAudioPage] = useState<StoryAudioPage | null>(null);

  /** A narração muda conforme a faixa etária definida na Área dos Pais. */
  const pages = useMemo(() => (chapter ? pagesForAge(chapter, ageBand) : []), [chapter, ageBand]);

  const totalSteps = useMemo(() => pages.length + (chapter?.choice ? 1 : 0), [pages, chapter]);
  const atChoiceStep = chapter ? pageIndex === pages.length : false;

  useEffect(() => {
    let cancelled = false;
    setAudioPage(null);
    if (story && chapter && pages[pageIndex]) {
      void loadStoryAudioPage(story.id, chapter.id, pageIndex, ageBand, pages[pageIndex])
        .then(page => { if (!cancelled) setAudioPage(page); });
    }
    return () => { cancelled = true; };
  }, [story, chapter, pageIndex, ageBand, pages]);

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
    stopActiveStoryAudio();
    stop();
    if (pageIndex + 1 < totalSteps) {
      setPageIndex((p) => p + 1);
    } else {
      goToNextChapterOrQuiz();
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream pb-28">
      <TopBar title={story.title} backTo={`/app/historia/${story.id}`} right={<span className="text-lg">Aa</span>} />
      <div className="px-4">
        <ProgressBar value={overallProgress} color="var(--color-green)" />
      </div>

      <div className="flex flex-1 flex-col px-4 pt-4">
        <AnimatePresence mode="wait">
          {!atChoiceStep ? (
            <motion.div key={`page-${pageIndex}`} initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={reducedMotion ? { duration: 0 } : undefined} className="flex flex-col gap-4">
              <Scene scene={chapter.scene} artId={chapter.id} height={220} />
              <h2 className="font-display text-center text-lg font-bold text-navy">{chapter.title}</h2>
              <p className="text-center text-lg leading-relaxed text-navy-deep">
                <NarratedText text={pages[pageIndex]} cue={activeCue} />
              </p>
            </motion.div>
          ) : (
            <motion.div key="choice" initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={reducedMotion ? { duration: 0 } : undefined} className="flex flex-col gap-4">
              <h2 className="font-display text-center text-lg font-bold text-navy">{chapter.choice!.question}</h2>
              {story.id === AUDIO_PILOT_STORY_ID && !revealed && <StorySegmentAudio
                sources={choiceAudioSegments(story.id, chapter, ageBand)}
                labels={['pergunta', ...chapter.choice!.options.map((_, i) => `opção ${i + 1}`)]}
              />}
              <div className="flex flex-col gap-3">
                {chapter.choice!.options.map((opt, i) => (
                  <ChoiceCard
                    key={i}
                    selected={choiceIndex === i}
                    correct={opt.correct}
                    revealed={revealed && choiceIndex === i}
                    disabled={revealed}
                    onClick={() => {
                      stopActiveStoryAudio();
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
              {story.id === AUDIO_PILOT_STORY_ID && revealed && choiceIndex !== null && <StorySegmentAudio
                sources={choiceAudioSegments(story.id, chapter, ageBand, choiceIndex)}
                labels={['explicação']}
              />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center gap-3 border-t border-navy/10 px-4 pt-4">
        {!atChoiceStep && (
          <button
            onClick={() => {
              if (isPlaying) {
                pause();
              } else if (isPaused) {
                resume();
              } else {
                const text = pages[pageIndex];
                const currentAudioPage = audioPage?.chapterId === chapter.id
                  && audioPage.pageIndex === pageIndex
                  && audioPage.ageBand === ageBand
                  ? audioPage
                  : null;
                play({
                  url: currentAudioPage
                    ? getStoryAudioPageUrl(currentAudioPage)
                    : undefined,
                  text,
                  durationMs: currentAudioPage?.durationMs,
                  cues: currentAudioPage?.cues,
                });
              }
            }}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange text-white shadow-[0_6px_0_0_var(--color-orange-dark)] transition active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100"
            aria-label={isPlaying ? 'Pausar narração' : isPaused ? 'Retomar narração' : 'Ouvir narração'}
            disabled={locked}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        )}
        {!atChoiceStep && (
          <div className="flex flex-1 flex-col gap-1">
            <p role="status" className="text-sm font-semibold text-navy">
              {audioError ?? (isPaused ? 'Narração pausada. Toque para continuar.' : isPlaying
                ? isStudioAudio
                  ? 'Ouvindo narração de estúdio...'
                  : 'Narrando...'
                : audioPage ? 'Toque para ouvir' : 'Voz de estúdio em revisão. Toque para ouvir com a voz brasileira do aparelho.')}
            </p>
            {(isPlaying || isPaused) && (
              <div
                className="h-1.5 overflow-hidden rounded-full bg-sand"
                role="progressbar"
                aria-label="Progresso da narração"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress * 100)}
              >
                <div className="h-full rounded-full bg-navy transition-[width] duration-150 motion-reduce:transition-none" style={{ width: `${progress * 100}%` }} />
              </div>
            )}
          </div>
        )}
        <Button
          onClick={handleNext}
          disabled={atChoiceStep && (choiceIndex === null || !revealed)}
          className={atChoiceStep ? 'flex-1' : ''}
          aria-label={atChoiceStep ? 'Continuar' : pageIndex + 1 >= totalSteps ? 'Concluir capítulo' : 'Próxima página'}
        >
          {atChoiceStep ? 'Continuar' : pageIndex + 1 >= totalSteps ? 'Concluir' : '→'}
        </Button>
      </div>
    </div>
  );
}
