import { useState } from 'react';
import { TopBar } from '../../components/ui/TopBar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useSettingsStore, ALL_WEEKDAYS, type WeekdayCode } from '../../store/settingsStore';

const DAY_LABEL: Record<WeekdayCode, string> = { seg: 'Seg', ter: 'Ter', qua: 'Qua', qui: 'Qui', sex: 'Sex', sab: 'Sáb', dom: 'Dom' };

export function ScreenTime() {
  const screenTimeEnabled = useSettingsStore((s) => s.screenTimeEnabled);
  const setScreenTimeEnabled = useSettingsStore((s) => s.setScreenTimeEnabled);
  const dailyTimeLimitMin = useSettingsStore((s) => s.dailyTimeLimitMin);
  const setDailyTimeLimit = useSettingsStore((s) => s.setDailyTimeLimit);
  const allowedFrom = useSettingsStore((s) => s.allowedFrom);
  const allowedTo = useSettingsStore((s) => s.allowedTo);
  const setAllowedHours = useSettingsStore((s) => s.setAllowedHours);
  const allowedDays = useSettingsStore((s) => s.allowedDays);
  const toggleWeekday = useSettingsStore((s) => s.toggleWeekday);
  const pausedManually = useSettingsStore((s) => s.pausedManually);
  const setPaused = useSettingsStore((s) => s.setPaused);

  const [saved, setSaved] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-cream pb-8">
      <TopBar title="Tempo de uso" backTo="/pais" />
      <div className="flex flex-col gap-4 px-4">
        <Card className="flex items-center justify-between">
          <div>
            <span className="font-display font-bold text-navy">Controle de tempo</span>
            <p className="text-xs text-navy/50">Ative para aplicar limite diário, horários e dias permitidos.</p>
          </div>
          <button
            onClick={() => setScreenTimeEnabled(!screenTimeEnabled)}
            aria-pressed={screenTimeEnabled}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${screenTimeEnabled ? 'bg-green' : 'bg-navy/15'}`}
          >
            <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${screenTimeEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </Card>

        <div className={`flex flex-col gap-4 transition-opacity ${screenTimeEnabled ? '' : 'pointer-events-none opacity-40'}`}>
        <Card>
          <p className="font-display mb-3 font-bold text-navy">Tempo diário permitido</p>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setDailyTimeLimit(dailyTimeLimitMin - 10)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-navy/5 text-xl font-bold text-navy"
            >
              −
            </button>
            <span className="font-display text-2xl font-extrabold text-navy">{dailyTimeLimitMin}min</span>
            <button
              onClick={() => setDailyTimeLimit(dailyTimeLimitMin + 10)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-navy/5 text-xl font-bold text-navy"
            >
              +
            </button>
          </div>
        </Card>

        <Card>
          <p className="font-display mb-3 font-bold text-navy">Horário permitido</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-sm font-semibold text-navy/60">Das</span>
            <input
              type="time"
              value={allowedFrom}
              onChange={(e) => setAllowedHours(e.target.value, allowedTo)}
              className="rounded-xl border border-navy/15 px-2 py-1.5 font-display font-bold text-navy"
            />
            <span className="text-sm font-semibold text-navy/60">às</span>
            <input
              type="time"
              value={allowedTo}
              onChange={(e) => setAllowedHours(allowedFrom, e.target.value)}
              className="rounded-xl border border-navy/15 px-2 py-1.5 font-display font-bold text-navy"
            />
          </div>
        </Card>

        <Card>
          <p className="font-display mb-3 font-bold text-navy">Dias da semana</p>
          <div className="flex justify-between gap-1">
            {ALL_WEEKDAYS.map((d) => (
              <button
                key={d}
                onClick={() => toggleWeekday(d)}
                className={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-bold ${
                  allowedDays.includes(d) ? 'bg-action-primary-bg text-action-primary-fg' : 'bg-navy/10 text-navy/50'
                }`}
              >
                {DAY_LABEL[d]}
              </button>
            ))}
          </div>
        </Card>
        </div>

        <Card className="flex items-center justify-between">
          <span className="font-display font-bold text-navy">Pausar o app agora</span>
          <button
            onClick={() => setPaused(!pausedManually)}
            aria-pressed={pausedManually}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${pausedManually ? 'bg-green' : 'bg-navy/15'}`}
          >
            <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${pausedManually ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </Card>

        <Button
          full
          size="lg"
          onClick={() => {
            setSaved(true);
            setTimeout(() => setSaved(false), 1800);
          }}
        >
          {saved ? 'Salvo! ✓' : 'Salvar alterações'}
        </Button>
      </div>
    </div>
  );
}
