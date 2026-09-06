import { useMemo, useState } from 'react';
import { TopBar } from '../../components/ui/TopBar';
import { Card } from '../../components/ui/Card';
import { useProgressStore } from '../../store/progressStore';
import { currentWeekDates, addDays, weekdayLabel, minutesToLabel } from '../../lib/dates';

export function ActivityReport() {
  const activityLog = useProgressStore((s) => s.activityLog);
  const activityMinutes = useProgressStore((s) => s.activityMinutes);
  const [weekOffset, setWeekOffset] = useState(0);

  const weekDates = useMemo(() => currentWeekDates(addDays(new Date(), weekOffset * 7)), [weekOffset]);
  const weekSet = new Set(weekDates);

  const entriesThisWeek = activityLog.filter((e) => weekSet.has(e.date));
  const historias = entriesThisWeek.filter((e) => e.kind === 'historia').length;
  const quizzes = entriesThisWeek.filter((e) => e.kind === 'quiz').length;
  const versiculos = entriesThisWeek.filter((e) => e.kind === 'versiculo').length;

  const totalMinutes = weekDates.reduce((sum, d) => sum + (activityMinutes[d] ?? 0), 0);
  const maxMinutes = Math.max(1, ...weekDates.map((d) => activityMinutes[d] ?? 0));

  return (
    <div className="flex min-h-screen flex-col bg-cream pb-8">
      <TopBar title="Relatório de atividades" backTo="/pais" />
      <div className="flex flex-col gap-4 px-4">
        <div className="flex min-h-11 items-center justify-center gap-4 rounded-[var(--radius-lg)] border border-border-default bg-surface-default px-4 py-2 shadow-[var(--shadow-card)]">
          <button className="min-h-11 min-w-11 text-xl font-bold text-navy" onClick={() => setWeekOffset((w) => w - 1)} aria-label="Semana anterior">
            ‹
          </button>
          <span className="font-display text-sm font-bold text-navy">{weekOffset === 0 ? 'Esta semana' : weekOffset === -1 ? 'Semana passada' : `${weekOffset} semanas`}</span>
          <button className="min-h-11 min-w-11 text-xl font-bold text-navy disabled:opacity-30" onClick={() => setWeekOffset((w) => Math.min(0, w + 1))} aria-label="Próxima semana" disabled={weekOffset === 0}>
            ›
          </button>
        </div>

        <Card>
          <div className="grid grid-cols-3 divide-x divide-navy/10 text-center">
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
          </div>
        </Card>

        <Card>
          <p className="font-display font-bold text-navy">Tempo no app</p>
          <p className="font-display text-2xl font-extrabold text-navy">{minutesToLabel(totalMinutes)}</p>
          <div className="mt-4 flex items-end justify-between gap-2" style={{ height: 100 }}>
            {weekDates.map((d) => {
              const min = activityMinutes[d] ?? 0;
              const h = Math.max(4, (min / maxMinutes) * 90);
              return (
                <div key={d} className="flex flex-1 flex-col items-center gap-1">
                  <div className="w-full rounded-full bg-orange" style={{ height: h }} />
                  <span className="text-[10px] font-bold text-navy/50">{weekdayLabel(d)}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
