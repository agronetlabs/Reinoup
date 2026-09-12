import { useState } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { TopBar } from '../../components/ui/TopBar';
import { Button } from '../../components/ui/Button';
import { BrandIcon } from '../../components/illustrations/BrandIcon';
import { Scene } from '../../components/illustrations/Scene';
import { getStory, motivoDeBloqueio } from '../../content/stories';
import { useAssinatura } from '../../lib/assinatura';
import { useProgressStore } from '../../store/progressStore';
import { useAuthStore } from '../../store/authStore';

export function StoryCover() {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(false);
  const progress = useProgressStore((s) => (storyId ? s.stories[storyId] : undefined));
  const stories = useProgressStore((s) => s.stories);
  const { plano, carregando } = useAssinatura();
  const isAdmin = useAuthStore((s) => s.isAdmin);

  const story = storyId ? getStory(storyId) : undefined;
  if (!story) return <Navigate to="/app/historias" replace />;

  // A trava também vive aqui, não só na lista: sem isso, digitar a URL da fase
  // pularia o paywall e a sequência inteira.
  const completedIds = new Set(Object.keys(stories).filter((id) => stories[id]?.completed));
  const bloqueio = motivoDeBloqueio(story, completedIds, Boolean(plano), isAdmin);
  if (!carregando && bloqueio === 'assinatura') return <Navigate to="/app/planos" replace />;
  if (bloqueio === 'sequencia') return <Navigate to="/app/historias" replace />;

  const nextChapterIndex = Math.min(progress?.chaptersCompleted ?? 0, story.chapters.length - 1);
  const nextChapter = story.chapters[nextChapterIndex];
  const isRereading = (progress?.chaptersCompleted ?? 0) >= story.chapters.length;

  return (
    <div className="flex min-h-screen flex-col bg-navy">
      <div className="relative">
        <Scene scene={story.cover} artId={story.id} height={260} className="rounded-none" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-navy-deep/85 to-transparent" />
        <div className="absolute inset-x-0 top-0">
          <TopBar
            dark
            title="História"
            backTo="/app/historias"
            right={
              <button onClick={() => setFavorite((v) => !v)} className="text-2xl" aria-label="Favoritar">
                <BrandIcon name="amor" size={24} className={favorite ? '' : 'opacity-50'} />
              </button>
            }
          />
        </div>
        <div className="absolute inset-x-0 bottom-3 px-5 text-white">
          <h1 className="font-display text-2xl font-extrabold drop-shadow">{story.title}</h1>
          <p className="text-white/90">{story.reference}</p>
        </div>
      </div>

      <div className="flex-1 rounded-t-[2rem] bg-cream px-5 pb-8 pt-6">
        <p className="text-center text-sm font-bold text-navy/60">
          Capítulo {nextChapterIndex + 1} de {story.chapters.length}
        </p>
        <p className="text-center font-display text-lg font-bold text-navy">{isRereading ? 'História concluída' : nextChapter.title}</p>
        <p className="mt-3 text-center text-navy/70">{story.summary}</p>
        <Button
          full
          size="lg"
          className="mt-6"
          onClick={() => navigate(`/app/historia/${story.id}/capitulo/${isRereading ? 0 : nextChapterIndex}`)}
        >
          {isRereading ? 'Ler novamente' : 'Ler história'}
        </Button>
      </div>
    </div>
  );
}
