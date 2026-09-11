import type { Story } from '../content/types';
import { VALORES, type Valor } from '../content/valores';
import { currentWeekDates, minutesToLabel } from './dates';
import type { ProgressState } from './progress-types';

type ReportProgress = Pick<ProgressState, 'activityLog' | 'quizHistory' | 'activityMinutes'>;
type ReportStory = Pick<Story, 'id' | 'valor' | 'valoresSecundarios'>;

export function weeklyActivityReport(progress: ReportProgress, stories: readonly ReportStory[], date: Date) {
  const weekDates = currentWeekDates(date);
  const weekSet = new Set(weekDates);
  const entries = progress.activityLog.filter((entry) => weekSet.has(entry.date));
  const quizzes = progress.quizHistory.filter((quiz) => weekSet.has(quiz.date));
  const quizStoryIds = new Set(quizzes.map((quiz) => quiz.storyId));
  const counts = new Map<Valor, number>();

  // Only quizHistory carries a story ID. Labels cannot prove a story association.
  for (const story of stories) {
    if (!quizStoryIds.has(story.id)) continue;
    for (const value of new Set([story.valor, ...(story.valoresSecundarios ?? [])])) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }

  const minutes = weekDates.map((day) => {
    const value = progress.activityMinutes[day] ?? 0;
    return Number.isFinite(value) && value > 0 ? value : 0;
  });
  return {
    weekDates,
    readings: entries.filter((entry) => entry.kind === 'historia').length,
    quizzes: quizzes.length,
    verses: entries.filter((entry) => entry.kind === 'versiculo').length,
    missions: entries.filter((entry) => entry.kind === 'missao').length,
    minutes,
    totalMinutes: minutes.reduce((sum, value) => sum + value, 0),
    maxMinutes: Math.max(1, ...minutes),
    values: [...counts].map(([value, count]) => ({ info: VALORES[value], count })),
    hasActivity: entries.length > 0 || quizzes.length > 0 || minutes.some((value) => value > 0),
  };
}

export function activityReportPeriod(weekDates: string[]) {
  const format = (key: string) => new Date(`${key}T00:00:00`).toLocaleDateString('pt-BR');
  return `${format(weekDates[0])} a ${format(weekDates[6])}`;
}

export function activityReportSummary(childName: string, report: ReturnType<typeof weeklyActivityReport>) {
  return `📖 *Relatório ReinoUp de ${childName}*\n` +
    `${activityReportPeriod(report.weekDates)}\n\n` +
    `⏱️ Tempo no app: ${minutesToLabel(report.totalMinutes)}\n` +
    `📚 Leituras de capítulos: ${report.readings}\n` +
    `🎯 Quizzes bíblicos: ${report.quizzes}\n` +
    `📜 Versículos: ${report.verses}\n` +
    `🗺️ Missões: ${report.missions}\n` +
    `✨ Temas das histórias com quiz: ${report.values.map((value) => value.info.label).join(', ') || 'Sem registros nesta semana'}\n\n` +
    `Dados disponíveis no histórico; leituras incluem repetições.`;
}

export async function copyActivityReport(text: string, clipboard?: Pick<Clipboard, 'writeText'>) {
  try {
    if (!clipboard) return false;
    await clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
