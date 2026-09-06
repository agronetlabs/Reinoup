import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MascotOficial } from '../../components/mascot/MascotOficial';
import { useAuthStore } from '../../store/authStore';
import { useProgressStore } from '../../store/progressStore';
import { MISSIONS } from '../../content/missions';
import { lockParentArea } from '../../lib/parent-session';
import { BrandIcon, type BrandIconName } from '../../components/illustrations/BrandIcon';

const MENU = [
  { to: '/pais/relatorio', label: 'Relatório de atividades', icon: 'progresso' },
  { to: '/pais/conteudo', label: 'Gerenciar conteúdo', icon: 'licoes' },
  { to: '/pais/tempo-de-uso', label: 'Tempo de uso', icon: 'progresso' },
  { to: '/pais/notificacoes', label: 'Notificações', icon: 'desafios' },
  { to: '/pais/configuracoes', label: 'Configurações', icon: 'protecao' },
] satisfies { to: string; label: string; icon: BrandIconName }[];

export function ParentHome() {
  const navigate = useNavigate();
  const childProfile = useAuthStore((s) => s.childProfile);
  const missions = useProgressStore((s) => s.missions);
  const parentDecideMission = useProgressStore((s) => s.parentDecideMission);

  const pending = MISSIONS.filter((m) => m.kind === 'vida-real' && missions[m.id]?.pendingParentConfirm);

  return (
    <div className="flex min-h-screen flex-col bg-cream pb-8">
      <div className="flex items-center justify-between px-4 pb-2 pt-4 safe-top">
        <h1 className="font-display text-xl font-extrabold text-navy">Área dos Pais</h1>
        <button
          onClick={() => {
            lockParentArea();
            navigate('/app');
          }}
          className="text-sm font-bold text-orange-dark"
        >
          Sair
        </button>
      </div>

      <div className="flex flex-col gap-4 px-4">
        <Card className="flex items-center gap-3">
          <MascotOficial size={56} />
          <div className="flex-1">
            <p className="font-display font-bold text-navy">{childProfile?.name}</p>
            <p className="text-sm text-navy/60">{childProfile?.age} anos</p>
          </div>
          <Link to="/app/perfil">
            <Button size="sm" variant="secondary">
              Ver perfil
            </Button>
          </Link>
        </Card>

        {pending.length > 0 && (
          <Card>
            <p className="font-display mb-2 font-bold text-navy">Missões da vida real para confirmar</p>
            <div className="flex flex-col gap-2">
              {pending.map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-2 rounded-xl bg-orange-light/15 p-3">
                  <div>
                    <p className="text-sm font-bold text-navy">{m.title}</p>
                    <p className="text-xs text-navy/60">{m.subtitle}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => parentDecideMission(m.id, true)} className="rounded-full bg-green px-3 py-1.5 text-xs font-bold text-white">
                      Confirmar
                    </button>
                    <button onClick={() => parentDecideMission(m.id, false)} className="rounded-full bg-navy/10 px-3 py-1.5 text-xs font-bold text-navy">
                      Não foi
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="overflow-hidden rounded-[var(--radius-md)] border border-border-default bg-surface-default shadow-[var(--shadow-card)]">
          {MENU.map((item, i) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex min-h-12 items-center gap-3 px-4 py-4 ${i !== MENU.length - 1 ? 'border-b border-navy/10' : ''}`}
            >
              <BrandIcon name={item.icon} size={22} />
              <span className="flex-1 font-semibold text-navy">{item.label}</span>
              <span className="text-navy/40">›</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
