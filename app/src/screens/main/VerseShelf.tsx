import { TopBar } from '../../components/ui/TopBar';
import { Card } from '../../components/ui/Card';
import { SpeechBubble } from '../../components/mascot/SpeechBubble';
import { BrandIcon } from '../../components/illustrations/BrandIcon';
import { useProgressStore } from '../../store/progressStore';
import { useSettingsStore } from '../../store/settingsStore';
import { VERSES } from '../../content/verses';

const CATEGORY_LABEL: Record<string, string> = {
  amor: 'Amor',
  coragem: 'Coragem',
  fe: 'Fé',
  obediencia: 'Obediência',
  gratidao: 'Gratidão',
  perdao: 'Perdão',
};

export function VerseShelf() {
  const versesCollected = useProgressStore((s) => s.versesCollected);
  const ageBand = useSettingsStore((s) => s.ageBand);
  const collected = VERSES.filter((v) => versesCollected.includes(v.id));

  return (
    <div className="flex min-h-screen flex-col bg-cream pb-8">
      <TopBar title="Estante de Versículos" backTo="/app" />
      <div className="px-4">
        <p className="mb-4 text-center text-sm font-semibold text-navy/60">
          {collected.length} de {VERSES.length} versículos decorados
        </p>
        {collected.length === 0 ? (
          <SpeechBubble pose="pensando" tone="info">
            Você ainda não decorou nenhum versículo. Comece pelo Versículo do Dia!
          </SpeechBubble>
        ) : (
          <div className="flex flex-col gap-3">
            {collected.map((v) => (
              <Card key={v.id} className="flex items-start gap-3">
                <BrandIcon name="fe" size={26} />
                <div>
                  <p className="font-display font-bold text-navy">"{v.text[ageBand]}"</p>
                  <p className="mt-1 text-xs font-bold text-orange-dark">
                    {v.reference} · {CATEGORY_LABEL[v.category] ?? v.category}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
