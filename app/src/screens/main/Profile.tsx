import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Mascot } from '../../components/mascot/Mascot';
import { useAuthStore } from '../../store/authStore';
import { useProgressStore } from '../../store/progressStore';
import { getLevelProgress } from '../../content/levels';
import { ConquistasVitrine } from '../../components/ui/ConquistasVitrine';
import { BrandIcon, type BrandIconName } from '../../components/illustrations/BrandIcon';
import { getAvatarItem } from '../../content/avatar-items';
import { STORIES } from '../../content/stories';

export function Profile() {
  const navigate = useNavigate();
  const childProfile = useAuthStore((s) => s.childProfile);
  const logout = useAuthStore((s) => s.logout);
  const xp = useProgressStore((s) => s.xp);
  const avatar = useProgressStore((s) => s.avatar);
  const badgesUnlocked = useProgressStore((s) => s.badgesUnlocked);
  const versesCollected = useProgressStore((s) => s.versesCollected);
  const quizHistory = useProgressStore((s) => s.quizHistory);
  const stories = useProgressStore((s) => s.stories);

  const level = getLevelProgress(xp);
  const outfitItem = getAvatarItem(avatar.outfit);
  const accessoryItem = getAvatarItem(avatar.accessory ?? '');
  const backgroundItem = getAvatarItem(avatar.background);
  const storiesCompleted = STORIES.filter((s) => stories[s.id]?.completed).length;

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="flex flex-col gap-5 px-4 pb-8 pt-4 safe-top">
      <h1 className="font-display text-center text-xl font-extrabold text-navy">Meu Perfil</h1>

      <Link to="/app/avatar" className="flex items-center gap-4">
        <Mascot size={80} outfitColor={outfitItem?.value} accessory={accessoryItem?.value} background={backgroundItem?.value} animated={false} />
        <div className="flex-1">
          <p className="font-display text-xl font-bold text-navy">{childProfile?.name}</p>
          <p className="text-sm font-semibold text-navy/60">Nível {level.level}</p>
          <ProgressBar value={level.xpForNextLevel ? level.xpIntoLevel / level.xpForNextLevel : 0} />
        </div>
        <span className="text-navy/40">›</span>
      </Link>
      <p className="-mt-3 text-center text-xs font-semibold text-navy/50">
        XP {level.xpIntoLevel} / {level.xpForNextLevel}
      </p>

      <Card>
        <div className="grid grid-cols-3 divide-x divide-navy/10 text-center">
          <div>
            <p className="font-display text-2xl font-extrabold text-navy">{storiesCompleted}</p>
            <p className="text-xs font-semibold text-navy/50">Histórias</p>
          </div>
          <div>
            <p className="font-display text-2xl font-extrabold text-navy">{versesCollected.length}</p>
            <p className="text-xs font-semibold text-navy/50">Versículos</p>
          </div>
          <div>
            <p className="font-display text-2xl font-extrabold text-navy">{quizHistory.length}</p>
            <p className="text-xs font-semibold text-navy/50">Quizzes</p>
          </div>
        </div>
      </Card>

      <ConquistasVitrine badgesUnlocked={badgesUnlocked} />

      <div className="flex flex-col gap-3">
        <LinhaDoPerfil to="/app/ranking" icone="ranking" titulo="Ranking de amigos" />
        <LinhaDoPerfil to="/app/album-adesivos" icone="recompensas" titulo="Álbum de adesivos" />
        <LinhaDoPerfil to="/app/planos" icone="desafios" titulo="Planos" />
        <LinhaDoPerfil to="/pais/pin" icone="protecao" titulo="Área dos Pais" destaque />
      </div>

      <Button variant="secondary" full onClick={handleLogout}>
        Sair da conta
      </Button>
    </div>
  );
}

function LinhaDoPerfil({ to, icone, titulo, destaque }: { to: string; icone: BrandIconName; titulo: string; destaque?: boolean }) {
  return (
    <Link
      to={to}
      className={`flex min-h-12 items-center gap-3 rounded-[var(--radius-md)] border p-4 shadow-[var(--shadow-card)] ${
        destaque ? 'border-navy bg-navy text-white' : 'border-border-default bg-surface-default'
      }`}
    >
      <BrandIcon name={icone} size={26} />
      <span className={`font-display flex-1 font-bold ${destaque ? '' : 'text-navy'}`}>{titulo}</span>
      <span className={destaque ? 'text-white/50' : 'text-navy/40'}>›</span>
    </Link>
  );
}
