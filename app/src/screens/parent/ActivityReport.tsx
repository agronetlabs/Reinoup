import { useMemo, useState } from 'react';
import { TopBar } from '../../components/ui/TopBar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BrandIcon } from '../../components/illustrations/BrandIcon';
import { useProgressStore } from '../../store/progressStore';
import { useAuthStore } from '../../store/authStore';
import { currentWeekDates, addDays, weekdayLabel, minutesToLabel } from '../../lib/dates';
import { VALORES, type Valor } from '../../content/valores';
import { STORIES } from '../../content/stories';

export function ActivityReport() {
  const childProfile = useAuthStore((s) => s.childProfile);
  const activityLog = useProgressStore((s) => s.activityLog);
  const activityMinutes = useProgressStore((s) => s.activityMinutes);
  const storiesProgress = useProgressStore((s) => s.stories);
  const [weekOffset, setWeekOffset] = useState(0);
  const [copied, setCopied] = useState(false);

  const childName = childProfile?.name ?? 'Seu filho';

  const weekDates = useMemo(() => currentWeekDates(addDays(new Date(), weekOffset * 7)), [weekOffset]);
  const weekSet = new Set(weekDates);

  const entriesThisWeek = activityLog.filter((e) => weekSet.has(e.date));
  const historias = entriesThisWeek.filter((e) => e.kind === 'historia').length;
  const quizzes = entriesThisWeek.filter((e) => e.kind === 'quiz').length;
  const versiculos = entriesThisWeek.filter((e) => e.kind === 'versiculo').length;
  const missoes = entriesThisWeek.filter((e) => e.kind === 'missao').length;

  const totalMinutes = weekDates.reduce((sum, d) => sum + (activityMinutes[d] ?? 0), 0);
  const maxMinutes = Math.max(1, ...weekDates.map((d) => activityMinutes[d] ?? 0));

  // Identifica quais virtudes / valores foram trabalhados
  const valoresDaSemana = useMemo(() => {
    const counts: Partial<Record<Valor, number>> = {};

    STORIES.forEach((s) => {
      const p = storiesProgress[s.id];
      if (p && (p.completed || p.chaptersCompleted > 0)) {
        counts[s.valor] = (counts[s.valor] ?? 0) + 1;
        s.valoresSecundarios?.forEach((v) => {
          counts[v] = (counts[v] ?? 0) + 1;
        });
      }
    });

    if (Object.keys(counts).length === 0) {
      counts['identidade'] = 1;
      counts['confianca'] = 1;
      counts['obediencia'] = 1;
    }

    return Object.entries(counts).map(([v, count]) => ({
      info: VALORES[v as Valor],
      count,
    }));
  }, [storiesProgress]);

  async function handleShareSummary() {
    const text = `📖 *Relatório ReinoUp de ${childName}*\n\n` +
      `⏱️ Tempo no app: ${minutesToLabel(totalMinutes)}\n` +
      `📚 Histórias exploradas: ${historias}\n` +
      `🎯 Quizzes bíblicos: ${quizzes}\n` +
      `✨ Valores aprendidos: ${valoresDaSemana.slice(0, 3).map((v) => v.info.label).join(', ')}\n\n` +
      `_A Palavra de Deus plantada no coração!_`;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Silencioso
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream pb-8">
      <TopBar title="Relatório de atividades" backTo="/pais" />
      <div className="flex flex-col gap-4 px-4">
        {/* Seletor de Semana */}
        <div className="flex min-h-11 items-center justify-between rounded-[var(--radius-lg)] border border-border-default bg-surface-default px-4 py-2 shadow-[var(--shadow-card)]">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl font-bold text-navy hover:bg-navy/5"
            onClick={() => setWeekOffset((w) => w - 1)}
            aria-label="Semana anterior"
          >
            ‹
          </button>
          <span className="font-display text-sm font-bold text-navy">
            {weekOffset === 0 ? 'Esta semana' : weekOffset === -1 ? 'Semana passada' : `${weekOffset} semanas`}
          </span>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl font-bold text-navy hover:bg-navy/5 disabled:opacity-30"
            onClick={() => setWeekOffset((w) => Math.min(0, w + 1))}
            aria-label="Próxima semana"
            disabled={weekOffset === 0}
          >
            ›
          </button>
        </div>

        {/* Resumo Numérico das Atividades */}
        <Card>
          <div className="grid grid-cols-4 divide-x divide-navy/10 text-center">
            <div>
              <p className="font-display text-2xl font-extrabold text-navy">{historias}</p>
              <p className="text-xs font-semibold text-navy/50">Histórias</p>
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold text-navy">{quizzes}</p>
              <p className="text-xs font-semibold text-navy/50">Quizzes</p>
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold text-navy">{versiculos}</p>
              <p className="text-xs font-semibold text-navy/50">Versículos</p>
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold text-navy">{missoes}</p>
              <p className="text-xs font-semibold text-navy/50">Missões</p>
            </div>
          </div>
        </Card>

        {/* Gráfico Semanal de Tempo de Tela */}
        <Card>
          <div className="flex items-center justify-between">
            <p className="font-display font-bold text-navy">Tempo no app</p>
            <span className="font-display text-sm font-extrabold text-orange">
              {minutesToLabel(totalMinutes)}
            </span>
          </div>
          <div className="mt-4 flex items-end justify-between gap-2" style={{ height: 110 }}>
            {weekDates.map((d) => {
              const min = activityMinutes[d] ?? 0;
              const h = Math.max(6, (min / maxMinutes) * 85);
              const isToday = d === new Date().toISOString().slice(0, 10);
              return (
                <div key={d} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="text-[9px] font-bold tabular-nums text-navy/40">
                    {min > 0 ? `${min}m` : ''}
                  </span>
                  <div
                    className={`w-full rounded-full transition-all duration-300 ${
                      isToday ? 'bg-orange' : 'bg-navy/20'
                    }`}
                    style={{ height: h }}
                  />
                  <span className="text-[10px] font-bold text-navy/60">{weekdayLabel(d)}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Virtudes e Valores de Caráter Desenvolvidos */}
        <Card>
          <div className="flex items-center gap-2">
            <BrandIcon name="fe" size={22} />
            <p className="font-display text-base font-extrabold text-navy">
              Valores trabalhados no coração
            </p>
          </div>
          <p className="mt-1 text-xs text-navy/60">
            Acompanhe as virtudes cristãs que {childName} tem aprendido nas histórias:
          </p>

          <div className="mt-3 flex flex-col gap-2.5">
            {valoresDaSemana.slice(0, 4).map(({ info, count }) => (
              <div
                key={info.id}
                className="flex items-start gap-3 rounded-2xl border border-navy/5 bg-cream/50 p-3"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base shadow-sm"
                  style={{ backgroundColor: `${info.cor}25` }}
                >
                  {info.icone}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-sm font-bold text-navy">{info.label}</p>
                    <span className="text-[11px] font-extrabold text-navy/50">
                      {count} {count === 1 ? 'estudo' : 'estudos'}
                    </span>
                  </div>
                  <p className="text-xs text-navy/70 leading-snug mt-0.5">
                    {info.descricaoPai}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Dica para Conversa em Família */}
        <Card className="border-2 border-orange/20 bg-gradient-to-br from-white to-orange-light/10">
          <div className="flex items-center gap-2">
            <span className="text-xl">💬</span>
            <p className="font-display text-sm font-extrabold text-navy">
              Ponto de Conexão em Família
            </p>
          </div>
          <p className="mt-2 text-xs font-semibold leading-relaxed text-navy-deep">
            Ao jantar ou antes de dormir, pergunte a {childName}:{' '}
            <span className="italic text-orange font-bold">
              “Qual foi a história mais legal que você ouviu no ReinoUp essa semana? O que você aprendeu com ela?”
            </span>
          </p>
        </Card>

        {/* Botão de Compartilhar Resumo */}
        <Button
          variant="secondary"
          size="md"
          full
          onClick={handleShareSummary}
          className="gap-2"
        >
          {copied ? '✓ Resumo copiado para o WhatsApp!' : '📋 Compartilhar resumo da semana'}
        </Button>
      </div>
    </div>
  );
}
