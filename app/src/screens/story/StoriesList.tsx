import { Link } from 'react-router-dom';
import { TopBar } from '../../components/ui/TopBar';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Scene } from '../../components/illustrations/Scene';
import { STORIES_POR_TEMPORADA, motivoDeBloqueio, FASES_GRATUITAS } from '../../content/stories';
import { BrandIcon } from '../../components/illustrations/BrandIcon';
import { useAssinatura } from '../../lib/assinatura';
import { SEASONS, SEASON_ORDER } from '../../content/seasons';
import { VALORES } from '../../content/valores';
import { useProgressStore } from '../../store/progressStore';

export function StoriesList() {
  const stories = useProgressStore((s) => s.stories);
  const completedIds = new Set(Object.keys(stories).filter((id) => stories[id]?.completed));
  const { plano } = useAssinatura();

  return (
    <div className="flex min-h-screen flex-col bg-cream pb-6">
      <TopBar title="Histórias" backTo="/app" />

      <div className="flex flex-col gap-8 px-4">
        {SEASON_ORDER.map((seasonId) => {
          const season = SEASONS[seasonId];
          const daTemporada = STORIES_POR_TEMPORADA[seasonId];
          if (daTemporada.length === 0) return null;

          return (
            <section key={seasonId} className="flex flex-col gap-4">
              <header>
                <h2 className="font-display text-xl font-bold text-navy">{season.title}</h2>
                <p className="text-sm font-semibold text-orange">{season.subtitle}</p>
              </header>

              {season.blocos.map((bloco) => {
                const doBloco = daTemporada.filter((s) => s.blocoId === bloco.id);
                if (doBloco.length === 0) return null;

                return (
                  <div key={bloco.id} className="flex flex-col gap-3">
                    {season.sequencial && (
                      <p className="font-display text-sm font-bold text-navy/60">
                        {bloco.title}
                        <span className="ml-2 font-sans text-xs font-semibold text-navy/40">
                          {doBloco.filter((s) => completedIds.has(s.id)).length}/{doBloco.length}
                        </span>
                      </p>
                    )}

                    {doBloco.map((story) => {
                      const progress = stories[story.id];
                      const pct = (progress?.chaptersCompleted ?? 0) / story.chapters.length;
                      const bloqueio = motivoDeBloqueio(story, completedIds, Boolean(plano));
                      const unlocked = bloqueio === null;
                      const valor = VALORES[story.valor];

                      const card = (
                        <Card padded={false} className="overflow-hidden">
                          <div className="relative">
                            <Scene scene={story.cover} artId={story.id} height={150} className="rounded-none" />

                            {season.sequencial && (
                              <span className="font-display absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-base font-extrabold text-navy shadow-[var(--shadow-card)]">
                                {story.order}
                              </span>
                            )}

                            <span
                              className="font-display absolute right-3 top-3 rounded-pill px-3 py-1 text-[11px] font-bold text-white shadow-[var(--shadow-card)]"
                              style={{ backgroundColor: valor.cor }}
                            >
                              {valor.icone} {valor.label}
                            </span>

                            {progress?.completed && (
                              <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-green text-base font-bold text-white shadow-[var(--shadow-card)]">
                                ✓
                              </span>
                            )}

                            {bloqueio === 'sequencia' && (
                              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-navy-deep/70 backdrop-blur-[2px]">
                                <BrandIcon name="protecao" size={30} className="brightness-0 invert" />
                                <span className="font-display text-xs font-bold text-white/90">
                                  Conclua a fase anterior
                                </span>
                              </div>
                            )}

                            {bloqueio === 'assinatura' && (
                              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-navy-deep/75 px-4 text-center backdrop-blur-[2px]">
                                <BrandIcon name="ranking" size={30} />
                                <span className="font-display text-sm font-bold leading-tight text-white">
                                  Continue a jornada
                                </span>
                                <span className="text-[11px] font-semibold leading-snug text-white/70">
                                  As {FASES_GRATUITAS} primeiras são livres. Assine para abrir o resto.
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="p-4">
                            <p className="font-display text-lg font-bold leading-tight text-navy">{story.title}</p>
                            <p className="mt-0.5 text-xs font-semibold text-navy/45">{story.reference}</p>
                            {unlocked && (
                              <>
                                <p className="mt-2 text-sm leading-snug text-navy/70">{story.summary}</p>
                                <div className="mt-3 flex items-center gap-2">
                                  <ProgressBar value={pct} height={10} color="var(--color-green)" />
                                  <span className="shrink-0 text-xs font-bold tabular-nums text-navy/60">
                                    {Math.round(pct * 100)}%
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </Card>
                      );

                      if (unlocked) {
                        return (
                          <Link key={story.id} to={`/app/historia/${story.id}`}>
                            {card}
                          </Link>
                        );
                      }

                      // Bloqueio por assinatura leva aos Planos: cadeado mudo
                      // não converte, e o pai precisa saber o que fazer.
                      if (bloqueio === 'assinatura') {
                        return (
                          <Link key={story.id} to="/app/planos">
                            {card}
                          </Link>
                        );
                      }

                      return (
                        <div key={story.id} aria-disabled className="opacity-70">
                          {card}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </section>
          );
        })}
      </div>
    </div>
  );
}

