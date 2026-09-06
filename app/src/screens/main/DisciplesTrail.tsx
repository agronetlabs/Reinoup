import { useState } from 'react';
import { TopBar } from '../../components/ui/TopBar';
import { Card } from '../../components/ui/Card';
import { DISCIPLES } from '../../content/disciples';
import { useProgressStore } from '../../store/progressStore';
import { BrandIcon } from '../../components/illustrations/BrandIcon';

export function DisciplesTrail() {
  const disciplesLearned = useProgressStore((s) => s.disciplesLearned);
  const learnDisciple = useProgressStore((s) => s.learnDisciple);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-cream pb-8">
      <TopBar title="Os 12 discípulos" backTo="/app/missoes" />
      <div className="px-4">
        <p className="mb-4 text-center text-sm font-semibold text-navy/60">
          {disciplesLearned.length} de {DISCIPLES.length} descobertos
        </p>
        <div className="flex flex-col gap-3">
          {DISCIPLES.map((d) => {
            const learned = disciplesLearned.includes(d.id);
            const open = openId === d.id;
            return (
              <Card
                key={d.id}
                className="cursor-pointer"
                onClick={() => {
                  setOpenId(open ? null : d.id);
                  if (!learned) learnDisciple(d.id);
                }}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${learned ? 'bg-green-light' : 'bg-navy/5'}`}>
                    <BrandIcon name={learned ? 'fe' : 'protecao'} size={20} className={learned ? '' : 'opacity-40'} />
                  </span>
                  <p className="font-display flex-1 font-bold text-navy">{d.name}</p>
                </div>
                {open && <p className="mt-2 text-sm text-navy/70">{d.fact}</p>}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
