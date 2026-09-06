import { TopBar } from '../../components/ui/TopBar';
import { Card } from '../../components/ui/Card';
import { useSettingsStore, type NotificationToggles } from '../../store/settingsStore';
import { BrandIcon, type BrandIconName } from '../../components/illustrations/BrandIcon';

const ITEMS: { key: keyof NotificationToggles; title: string; subtitle: string; icon: BrandIconName }[] = [
  { key: 'desafiosDiarios', title: 'Desafios diários', subtitle: 'Lembrar do desafio do dia', icon: 'desafios' },
  { key: 'versiculoDoDia', title: 'Versículo do dia', subtitle: 'Notificação diária', icon: 'fe' },
  { key: 'relatorioSemanal', title: 'Relatório semanal', subtitle: 'Resumo das atividades', icon: 'progresso' },
  { key: 'novosConteudos', title: 'Novos conteúdos', subtitle: 'Histórias e jogos novos', icon: 'licoes' },
];

export function Notifications() {
  const notifications = useSettingsStore((s) => s.notifications);
  const toggleNotification = useSettingsStore((s) => s.toggleNotification);

  function handleToggle(key: keyof NotificationToggles) {
    toggleNotification(key);
    if (!notifications[key] && typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream pb-8">
      <TopBar title="Notificações" backTo="/pais" />
      <div className="flex flex-col gap-3 px-4">
        {ITEMS.map((item) => (
          <Card key={item.key} className="flex items-center gap-3">
            <BrandIcon name={item.icon} size={22} />
            <div className="flex-1">
              <p className="font-display font-bold text-navy">{item.title}</p>
              <p className="text-sm text-navy/60">{item.subtitle}</p>
            </div>
            <button
              onClick={() => handleToggle(item.key)}
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${notifications[item.key] ? 'bg-green' : 'bg-navy/15'}`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  notifications[item.key] ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
