import { describe, expect, test } from 'bun:test';
import { activityReportPeriod, activityReportSummary, copyActivityReport, weeklyActivityReport } from '../src/lib/activity-report';
import type { ProgressState } from '../src/lib/progress-types';

const date = new Date(2026, 8, 10, 12);
const stories = [
  { id: 'story-a', valor: 'identidade', valoresSecundarios: ['amor', 'identidade'] },
  { id: 'story-b', valor: 'amor' },
] as const;
const catalog = stories.map((story) => ({
  ...story,
  valoresSecundarios: 'valoresSecundarios' in story ? [...story.valoresSecundarios] : [],
}));
type Data = Pick<ProgressState, 'activityLog' | 'quizHistory' | 'activityMinutes'>;
const empty = (): Data => ({ activityLog: [], quizHistory: [], activityMinutes: {} });
const quiz = (storyId: string, day = '2026-09-10') => ({ storyId, date: day, score: 0, total: 8 });

describe('weekly activity report', () => {
  test('empty history has zero totals and no invented values', () => {
    const report = weeklyActivityReport(empty(), catalog, date);
    expect(report.readings).toBe(0);
    expect(report.quizzes).toBe(0);
    expect(report.verses).toBe(0);
    expect(report.missions).toBe(0);
    expect(report.totalMinutes).toBe(0);
    expect(report.minutes).toEqual([0, 0, 0, 0, 0, 0, 0]);
    expect(report.values).toEqual([]);
    expect(report.hasActivity).toBe(false);
  });

  test('all-time completion cannot populate a weekly report', () => {
    const progress = {
      ...empty(),
      stories: { 'story-a': { completed: true, chaptersCompleted: 4, quizAttempts: 1 } },
    };
    expect(weeklyActivityReport(progress, catalog, date).values).toEqual([]);
  });

  test('excludes previous/next weeks and undated or malformed records', () => {
    const data = empty();
    for (const day of ['2026-09-06', '2026-09-14', '', 'invalid', '2026-09-10T12:00:00Z']) {
      data.quizHistory.push(quiz('story-a', day));
      data.activityLog.push({ date: day, kind: 'historia', label: 'story-a' });
      data.activityMinutes[day] = 12;
    }
    const report = weeklyActivityReport(data, catalog, date);
    expect(report.hasActivity).toBe(false);
    expect(report.values).toEqual([]);
    expect(report.quizzes).toBe(0);
    expect(report.readings).toBe(0);
    expect(report.totalMinutes).toBe(0);
  });

  test('uses Monday–Sunday local dates including local Sunday late at night', () => {
    const data = empty();
    data.quizHistory = [quiz('story-a', '2026-09-07'), quiz('story-b', '2026-09-13')];
    const report = weeklyActivityReport(data, catalog, new Date(2026, 8, 13, 23, 59));
    expect(report.weekDates).toEqual([
      '2026-09-07', '2026-09-08', '2026-09-09', '2026-09-10',
      '2026-09-11', '2026-09-12', '2026-09-13',
    ]);
    expect(report.quizzes).toBe(2);
    expect(activityReportPeriod(report.weekDates)).toBe('07/09/2026 a 13/09/2026');
    expect(weeklyActivityReport(data, catalog, new Date(2026, 8, 14, 0, 1)).quizzes).toBe(0);
  });

  test('counts quiz attempts once per history entry, values once per distinct story', () => {
    const data = empty();
    data.quizHistory = [quiz('story-a'), quiz('story-a'), quiz('story-b')];
    data.activityLog = [
      { date: '2026-09-10', kind: 'quiz', label: 'Quiz — story-a' },
      { date: '2026-09-10', kind: 'quiz', label: 'Quiz — story-a' },
      { date: '2026-09-10', kind: 'quiz', label: 'Quiz — story-b' },
    ];
    const report = weeklyActivityReport(data, catalog, date);
    expect(report.quizzes).toBe(3);
    expect(report.values.map(({ info, count }) => [info.id, count])).toEqual([
      ['identidade', 1], ['amor', 2],
    ]);
  });

  test('does not guess story IDs from labels or unknown quiz IDs', () => {
    const data = empty();
    data.activityLog = [
      { date: '2026-09-10', kind: 'historia', label: 'story-a' },
      { date: '2026-09-10', kind: 'quiz', label: 'Quiz — story-b' },
    ];
    data.quizHistory = [quiz('removed-story')];
    const report = weeklyActivityReport(data, catalog, date);
    expect(report.values).toEqual([]);
    expect(report.quizzes).toBe(1);
    expect(report.readings).toBe(1);
  });

  test('retains repeated chapter readings without claiming unique stories', () => {
    const data = empty();
    data.activityLog = [
      { date: '2026-09-10', kind: 'historia', label: 'Same story' },
      { date: '2026-09-10', kind: 'historia', label: 'Same story' },
      { date: '2026-09-10', kind: 'versiculo', label: 'Verse' },
      { date: '2026-09-10', kind: 'missao', label: 'Mission' },
      { date: '2026-09-10', kind: 'jogo', label: 'Game' },
    ];
    const report = weeklyActivityReport(data, catalog, date);
    expect([report.readings, report.verses, report.missions]).toEqual([2, 1, 1]);
    expect(report.hasActivity).toBe(true);
    expect(report.values).toEqual([]);
  });

  test('uses only finite positive minutes from the selected week', () => {
    const data = empty();
    data.activityMinutes = {
      '2026-09-06': 100, '2026-09-07': 12, '2026-09-08': -5,
      '2026-09-09': NaN, '2026-09-10': Infinity, '2026-09-13': 3,
    };
    const report = weeklyActivityReport(data, catalog, date);
    expect(report.minutes).toEqual([12, 0, 0, 0, 0, 0, 3]);
    expect(report.totalMinutes).toBe(15);
    expect(report.maxMinutes).toBe(12);
    expect(report.hasActivity).toBe(true);
  });

  test('weekly navigation changes value evidence and copied period together', () => {
    const data = empty();
    data.quizHistory = [quiz('story-a', '2026-09-03'), quiz('story-b')];
    const current = weeklyActivityReport(data, catalog, date);
    const previous = weeklyActivityReport(data, catalog, new Date(2026, 8, 3, 12));
    expect(current.values.map(({ info }) => info.id)).toEqual(['amor']);
    expect(previous.values.map(({ info }) => info.id)).toEqual(['identidade', 'amor']);
    const text = activityReportSummary('Ana', previous);
    expect(text).toContain('31/08/2026 a 06/09/2026');
    expect(text).toContain('Quizzes bíblicos: 1');
    expect(text).toContain('Identidade, Amor');
    expect(text).not.toContain('Valores aprendidos');
    expect(activityReportSummary('Ana', weeklyActivityReport(empty(), catalog, date)))
      .toContain('Sem registros nesta semana');
  });
});

describe('copying an activity report', () => {
  test('reports success only after clipboard write completes', async () => {
    let copied = '';
    expect(await copyActivityReport('weekly summary', {
      writeText: async (text) => { copied = text; },
    })).toBe(true);
    expect(copied).toBe('weekly summary');
  });

  test('handles missing, denied, and synchronously failing clipboards', async () => {
    expect(await copyActivityReport('summary')).toBe(false);
    expect(await copyActivityReport('summary', {
      writeText: async () => { throw new Error('Permission denied'); },
    })).toBe(false);
    expect(await copyActivityReport('summary', {
      writeText: () => { throw new Error('Unavailable'); },
    })).toBe(false);
  });
});
