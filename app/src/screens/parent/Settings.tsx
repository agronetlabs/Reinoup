import { useState } from 'react';
import { TopBar } from '../../components/ui/TopBar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { exportAllData, eraseAllData } from '../../lib/data-export';
import { useAuthStore } from '../../store/authStore';
import { sairDaConta } from '../../lib/auth-supabase';

export function Settings() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="flex min-h-screen flex-col bg-cream pb-8">
      <TopBar title="Configurações" backTo="/pais" />
      <div className="flex flex-col gap-4 px-4">
        <Card>
          <p className="font-display font-bold text-navy">Idioma</p>
          <p className="text-sm text-navy/60">Português (Brasil)</p>
        </Card>

        <Card>
          <p className="font-display mb-2 font-bold text-navy">Privacidade e dados (LGPD)</p>
          <p className="mb-3 text-sm text-navy/60">Todos os dados ficam salvos apenas neste aparelho.</p>
          <div className="flex flex-col gap-2">
            <Button variant="secondary" onClick={exportAllData}>
              Exportar meus dados
            </Button>
            <Button variant="danger" onClick={() => setConfirmDelete(true)}>
              Excluir meus dados
            </Button>
          </div>
        </Card>

        <Button variant="secondary" full onClick={() => { void sairDaConta(); logout(); }}>
          Sair da conta
        </Button>
      </div>

      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-4xl">⚠️</span>
          <h2 className="font-display text-lg font-extrabold text-navy">Excluir todos os dados?</h2>
          <p className="text-sm text-navy/70">Essa ação apaga todo o progresso, conquistas e configurações deste aparelho. Não pode ser desfeita.</p>
          <div className="flex w-full gap-3">
            <Button full variant="secondary" onClick={() => setConfirmDelete(false)}>
              Cancelar
            </Button>
            <Button full variant="danger" onClick={eraseAllData}>
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
