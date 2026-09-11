import { useLocation, useNavigate, useParams, Navigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { MascotOficial } from '../../components/mascot/MascotOficial';
import { getStory } from '../../content/stories';
import { useProgressStore } from '../../store/progressStore';

export function StoryResult() {
  const { storyId } = useParams<{ storyId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const progress = useProgressStore((s) => (storyId ? s.stories[storyId] : undefined));

  const story = storyId ? getStory(storyId) : undefined;
  if (!story) return <Navigate to="/app/historias" replace />;

  const state = location.state as { score: number; total: number } | null;
  const score = state?.score ?? progress?.quizBestScore ?? 0;
  const total = state?.total ?? story.quiz.length;
  const pct = total ? score / total : 0;

  const message = pct === 1 ? 'Gabaritou! Incrível!' : pct >= 0.7 ? 'Muito bem, você aprendeu bastante!' : 'Bom trabalho! Você pode revisar sempre que quiser.';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-navy px-8 text-center text-white">
      <MascotOficial size={130} />
      <h1 className="font-display text-2xl font-extrabold">{message}</h1>
      <p className="font-display text-4xl font-extrabold text-gold-light">
        {score}/{total}
      </p>
      <p className="text-white/70">Você concluiu "{story.title}"</p>

      <div className="mt-4 flex w-full flex-col gap-3 text-left">
        <section className="rounded-[var(--radius-card)] bg-white/10 p-4">
          <h2 className="font-display text-lg font-extrabold text-gold-light">O que você aprendeu</h2>
          <p className="mt-1 text-sm leading-relaxed text-white/90">{story.licao}</p>
        </section>
        <section className="rounded-[var(--radius-card)] bg-white/10 p-4">
          <h2 className="font-display text-lg font-extrabold text-gold-light">Guarde no coração</h2>
          <p className="mt-1 text-sm font-semibold leading-relaxed text-white/90">“{story.fraseMemoravel}”</p>
        </section>
        <section className="rounded-[var(--radius-card)] bg-white/10 p-4">
          <h2 className="font-display text-lg font-extrabold text-gold-light">Oração</h2>
          <p className="mt-1 text-sm leading-relaxed text-white/90">{story.oracao}</p>
        </section>
      </div>

      <div className="mt-2 flex w-full flex-col gap-3">
        <Button full size="lg" onClick={() => navigate('/app/historias')}>
          Ver outras histórias
        </Button>
        <Button full variant="secondary" onClick={() => navigate('/app')}>
          Voltar ao início
        </Button>
      </div>
    </div>
  );
}
