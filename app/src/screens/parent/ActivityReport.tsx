import { useEffect, useMemo, useRef, useState } from 'react';
import { TopBar } from '../../components/ui/TopBar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BrandIcon } from '../../components/illustrations/BrandIcon';
import { useProgressStore } from '../../store/progressStore';
import { useAuthStore } from '../../store/authStore';
import { addDays, weekdayLabel, minutesToLabel, todayKey } from '../../lib/dates';
import { activityReportPeriod, activityReportSummary, copyActivityReport, weeklyActivityReport } from '../../lib/activity-report';
import { STORIES } from '../../content/stories';

export function ActivityReport() {
  const childProfile = useAuthStore((s) => s.childProfile);
  const activityLog = useProgressStore((s) => s.activityLog);
  const activityMinutes = useProgressStore((s) => s.activityMinutes);
  const quizHistory = useProgressStore((s) => s.quizHistory);
  const [weekOffset, setWeekOffset] = useState(0);
  const [share, setShare] = useState<{ text: string; status: 'copying' | 'copied' | 'error' } | null>(null);
  const copyRequest = useRef(0);

  const childName = childProfile?.name ?? 'Seu filho';

  const today = todayKey();
  const report = useMemo(() => weeklyActivityReport(
    { activityLog, activityMinutes, quizHistory }, STORIES,
    addDays(new Date(`${today}T12:00:00`), weekOffset * 7),
  ), [activityLog, activityMinutes, quizHistory, today, weekOffset]);
  const { weekDates, readings: historias, quizzes, verses: versiculos, missions: missoes,
    totalMinutes, maxMinutes, values: valoresDaSemana } = report;
  const summary = activityReportSummary(childName, report);
  const shareStatus = share?.text === summary ? share.status : null;

  useEffect(() => () => { copyRequest.current += 1; }, [summary]);

  async function handleShareSummary() {
    const request = ++copyRequest.current;
    setShare({ text: summary, status: 'copying' });
    const copied = await copyActivityReport(summary, navigator.clipboard);
    if (request === copyRequest.current) {
      setShare({ text: summary, status: copied ? 'copied' : 'error' });
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
            {weekOffset === 0 ? 'Esta semana' : weekOffset === -1 ? 'Semana passada' : `${Math.abs(weekOffset)} semanas atrás`}
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
        <p className="text-center text-sm text-navy">{activityReportPeriod(weekDates)}</p>

        {/* Resumo Numérico das Atividades */}
        <Card>
          <div className="grid grid-cols-4 divide-x divide-navy/10 text-center">
            <div>
              <p className="font-display text-2xl font-extrabold text-navy">{historias}</p>
              <p className="text-xs font-semibold text-navy/50">Leituras</p>
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
          <p className="mt-3 text-sm text-navy">
            {report.hasActivity ? 'Leituras de capítulos incluem repetições.' : 'Nenhuma atividade registrada nesta semana.'}
            {' '}O relatório usa o histórico disponível; registros antigos podem estar incompletos.
          </p>
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
            {weekDates.map((d, index) => {
              const min = report.minutes[index];
              const h = (min / maxMinutes) * 85;
              const isToday = d === today;
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
              Temas das histórias com quiz
            </p>
          </div>
          <p className="mt-1 text-sm text-navy">
            Valores presentes nas histórias cujos quizzes {childName} respondeu nesta semana.
            Cada história conta uma vez, mesmo com quizzes repetidos. Isso não mede domínio dos valores.
          </p>

          <div className="mt-3 flex flex-col gap-2.5">
            {valoresDaSemana.length === 0 && (
              <p className="text-sm text-navy">
                Ainda não há quizzes associados a histórias nesta semana. Leituras sem identificação da história não permitem listar seus valores.
              </p>
            )}
            {valoresDaSemana.map(({ info, count }) => (
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
                      {count} {count === 1 ? 'história' : 'histórias'}
                    </span>
                  </div>
                  <p className="text-xs text-navy/70 leading-snug mt-0.5">
                    Tema: {info.frase}
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
              “Qual história você gostaria de ler comigo? O que podemos aprender com ela?”
            </span>
          </p>
        </Card>

        {/* Botão de Compartilhar Resumo */}
        <Button
          variant="secondary"
          size="md"
          full
          onClick={handleShareSummary}
          disabled={shareStatus === 'copying'}
          className="gap-2"
        >
          {shareStatus === 'copying' ? 'Copiando resumo…' : '📋 Copiar resumo da semana'}
        </Button>
        <p role="status" className="text-sm text-navy">
          {shareStatus === 'copied' && 'Resumo copiado! Cole no aplicativo em que deseja compartilhar.'}
          {shareStatus === 'error' && 'Não foi possível copiar. Tente novamente ou selecione e copie o resumo abaixo.'}
        </p>
        {shareStatus === 'error' && (
          <textarea
            aria-label="Resumo da semana para copiar"
            readOnly
            value={summary}
            rows={10}
            className="w-full rounded-2xl border border-border-default bg-surface-default p-3 text-base text-navy"
            onFocus={(event) => event.currentTarget.select()}
          />
        )}
      </div>
    </div>
  );
}
