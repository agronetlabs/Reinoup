import { Link } from 'react-router-dom';
import { CoinBadge } from '../../components/ui/CoinBadge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { MascotOficial } from '../../components/mascot/MascotOficial';
import { Scene } from '../../components/illustrations/Scene';
import { BrandIcon } from '../../components/illustrations/BrandIcon';
import { useAuthStore } from '../../store/authStore';
import { useProgressStore } from '../../store/progressStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useMascotChatStore } from '../../store/mascotChatStore';
import { proximaHistoria } from '../../content/stories';
import { getVerseOfDay } from '../../content/verses';
import { getAvatarItem } from '../../content/avatar-items';
import { getLevelProgress, levelTitle } from '../../content/levels';

/**
 * Início — construída a partir da tela 04_Home do mockup.
 *
 * Hierarquia da referência: cabeçalho com avatar e moedas, barra de nível,
 * card grande do versículo com botão laranja, e "Continue sua jornada" com
 * cards altos de retomada. Respiro generoso, cantos largos, barras grossas.
 */
export function Home() {
  const childProfile = useAuthStore((s) => s.childProfile);
  const coins = useProgressStore((s) => s.coins);
  const xp = useProgressStore((s) => s.xp);
  const stories = useProgressStore((s) => s.stories);
  const avatar = useProgressStore((s) => s.avatar);
  const dailyChallenge = useProgressStore((s) => s.dailyChallenge);
  const contentToggles = useSettingsStore((s) => s.contentToggles);
  const ageBand = useSettingsStore((s) => s.ageBand);

  const level = getLevelProgress(xp);
  const verse = getVerseOfDay();
  const openChat = useMascotChatStore((s) => s.openChat);

  const currentStory = proximaHistoria(new Set(Object.keys(stories).filter((id) => stories[id]?.completed)));
  const chaptersDone = stories[currentStory.id]?.chaptersCompleted ?? 0;
  const storyPct = chaptersDone / currentStory.chapters.length;
  const tasksDone = dailyChallenge.tasks.filter((t) => t.done).length;
  const xpPct = level.xpForNextLevel ? level.xpIntoLevel / level.xpForNextLevel : 0;

  return (
    <div className="flex flex-col gap-6 px-4 pb-8 pt-5 safe-top">
      {/* ---- cabeçalho ---- */}
      <header className="flex items-start gap-3">
        <Link to="/app/avatar" aria-label="Meu avatar" className="shrink-0 overflow-hidden rounded-full bg-white p-1 shadow-[var(--shadow-card)]" style={{ backgroundColor: getAvatarItem(avatar.background)?.value }}>
          <MascotOficial size={56} recorte="busto" />
        </Link>

        <div className="min-w-0 flex-1 pt-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h1 className="font-display truncate text-2xl font-extrabold leading-tight text-navy">
                Olá, {childProfile?.name}!
              </h1>
              <p className="text-sm font-semibold text-navy/60">
                Nível {level.level} · {levelTitle(level.level)}
              </p>
            </div>
            <CoinBadge coins={coins} />
          </div>

          <div className="mt-2 flex items-center gap-2">
            <ProgressBar value={xpPct} height={12} color="var(--color-orange)" />
            <span className="shrink-0 text-[11px] font-bold tabular-nums text-navy/50">
              {level.xpIntoLevel}/{level.xpForNextLevel}
            </span>
          </div>
        </div>
      </header>

      {/* ---- boas-vindas ilustrada ---- */}
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-white to-cream-dark px-4 pb-3 pt-2 shadow-[var(--shadow-soft)]">
        <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-yellow/25" />
        <div className="relative flex items-end gap-2">
          <MascotOficial pose="acenando" size={112} className="shrink-0" />
          <div className="mb-3 flex flex-col items-start gap-2">
            <div className="rounded-3xl rounded-bl-md bg-white px-4 py-3 text-sm font-extrabold leading-snug text-navy-deep shadow-[var(--shadow-card)]">
              Vamos aprender a Palavra de Deus hoje!
            </div>
            <button
              onClick={openChat}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-action-primary-bg px-4 py-2 font-display text-xs font-bold text-action-primary-fg shadow-[0_3px_0_0_var(--color-orange-dark)] transition-[transform,box-shadow] duration-150 active:translate-y-[2px] active:shadow-none"
            >
              🎙️ Falar com o Cordeirinho
            </button>
          </div>
        </div>
      </section>

      {/* ---- versículo do dia ---- */}
      {contentToggles.versiculoDoDia && (
        <section className="relative overflow-hidden rounded-[28px] bg-white p-6 shadow-[var(--shadow-soft)]">
          {/* Enfeite do canto, no lugar da borboleta do mockup. */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-yellow/25" />
          <div className="pointer-events-none absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/70">
            <BrandIcon name="fe" size={24} />
          </div>

          <p className="font-display text-sm font-extrabold uppercase tracking-wider text-orange">
            Versículo do dia
          </p>
          <p className="font-display mt-3 max-w-[85%] text-[22px] font-bold leading-snug text-navy">
            “{verse.text[ageBand]}”
          </p>
          <p className="mt-2 text-sm font-semibold text-navy/50">{verse.reference}</p>

          <Link
            to="/app/versiculo"
            className="mt-5 inline-flex min-h-12 items-center justify-center rounded-[var(--radius-lg)] bg-action-primary-bg px-7 py-3 font-display text-base font-bold text-action-primary-fg shadow-[0_4px_0_0_var(--color-orange-dark)] transition-[transform,box-shadow] duration-150 active:translate-y-[3px] active:shadow-[0_1px_0_0_var(--color-orange-dark)]"
          >
            Ver desafio
          </Link>
        </section>
      )}

      {/* ---- continue sua jornada ---- */}
      <section>
        <h2 className="font-display mb-3 text-xl font-bold text-navy">Continue sua jornada</h2>
        <div className="flex flex-col gap-3">
          {contentToggles.historias && (
            <CardDeRetomada
              to={`/app/historia/${currentStory.id}`}
              titulo={`História: ${currentStory.title}`}
              legenda={currentStory.reference}
              progresso={storyPct}
              indicador={`${Math.round(storyPct * 100)}%`}
              corDaBarra="var(--color-green)"
              miniatura={<Scene scene={currentStory.cover} artId={currentStory.id} height={72} width={72} className="rounded-2xl" />}
            />
          )}

          {contentToggles.desafiosDiarios && (
            <CardDeRetomada
              to="/app/desafios"
              titulo="Desafios diários"
              legenda="Complete e ganhe o baú"
              progresso={dailyChallenge.tasks.length ? tasksDone / dailyChallenge.tasks.length : 0}
              indicador={`${tasksDone}/${dailyChallenge.tasks.length}`}
              corDaBarra="var(--color-orange)"
              miniatura={
                <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-orange-light/25">
                  <BrandIcon name="desafios" size={40} />
                </div>
              }
              enfeite={<BrandIcon name="ranking" size={24} />}
            />
          )}
        </div>
      </section>
    </div>
  );
}

interface CardDeRetomadaProps {
  to: string;
  titulo: string;
  legenda: string;
  progresso: number;
  indicador: string;
  corDaBarra: string;
  miniatura: React.ReactNode;
  enfeite?: React.ReactNode;
}

function CardDeRetomada({ to, titulo, legenda, progresso, indicador, corDaBarra, miniatura, enfeite }: CardDeRetomadaProps) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 rounded-[24px] bg-white p-4 shadow-[var(--shadow-card)] active:scale-[0.99]"
    >
      <div className="shrink-0">{miniatura}</div>
      <div className="min-w-0 flex-1">
        <p className="font-display truncate text-base font-bold text-navy">{titulo}</p>
        <p className="truncate text-xs font-semibold text-navy/45">{legenda}</p>
        <div className="mt-2 flex items-center gap-2">
          <ProgressBar value={progresso} height={10} color={corDaBarra} />
          <span className="shrink-0 text-xs font-bold tabular-nums text-navy/60">{indicador}</span>
        </div>
      </div>
      {enfeite && <div className="shrink-0">{enfeite}</div>}
    </Link>
  );
}
