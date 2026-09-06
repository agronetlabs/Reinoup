import { TopBar } from '../../components/ui/TopBar';
import { Card } from '../../components/ui/Card';
import { useSettingsStore, type ContentToggles } from '../../store/settingsStore';
import type { AgeBand } from '../../content/types';

const TOGGLE_LABELS: Record<keyof ContentToggles, string> = {
  historias: 'Histórias Bíblicas',
  jogos: 'Jogos',
  desafiosDiarios: 'Desafios Diários',
  versiculoDoDia: 'Versículo do Dia',
  missoesVidaReal: 'Missões da Vida Real',
};

function Switch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? 'bg-green' : 'bg-navy/15'}`}
      aria-pressed={on}
    >
      <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

export function ManageContent() {
  const ageBand = useSettingsStore((s) => s.ageBand);
  const setAgeBand = useSettingsStore((s) => s.setAgeBand);
  const contentToggles = useSettingsStore((s) => s.contentToggles);
  const toggleContent = useSettingsStore((s) => s.toggleContent);

  const bands: AgeBand[] = ['5-7', '8-10'];

  return (
    <div className="flex min-h-screen flex-col bg-cream pb-8">
      <TopBar title="Gerenciar conteúdo" backTo="/pais" />
      <div className="flex flex-col gap-4 px-4">
        <Card>
          <p className="font-display mb-3 font-bold text-navy">Idade da criança</p>
          <div className="flex gap-2">
            {bands.map((b) => (
              <button
                key={b}
                onClick={() => setAgeBand(b)}
                className={`min-h-11 flex-1 rounded-[var(--radius-lg)] py-2.5 text-sm font-bold ${ageBand === b ? 'bg-action-primary-bg text-action-primary-fg' : 'bg-navy/5 text-navy/60'}`}
              >
                {b} anos
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <p className="font-display mb-3 font-bold text-navy">Conteúdo disponível</p>
          <div className="flex flex-col gap-4">
            {(Object.keys(TOGGLE_LABELS) as (keyof ContentToggles)[]).map((key) => (
              <div key={key} className="flex items-center justify-between">
                <span className="font-semibold text-navy">{TOGGLE_LABELS[key]}</span>
                <Switch on={contentToggles[key]} onToggle={() => toggleContent(key)} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
