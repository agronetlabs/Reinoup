import { useState } from 'react';
import { TopBar } from '../../components/ui/TopBar';
import { CoinBadge } from '../../components/ui/CoinBadge';
import { MascotOficial } from '../../components/mascot/MascotOficial';
import { useProgressStore } from '../../store/progressStore';
import { AVATAR_ITEMS, itemsByKind, getAvatarItem, type AvatarItemKind } from '../../content/avatar-items';
import { getBadge } from '../../content/badges';
import { BrandIcon } from '../../components/illustrations/BrandIcon';

const TABS: { kind: AvatarItemKind; label: string }[] = [
  { kind: 'outfit', label: 'Roupas' },
  { kind: 'accessory', label: 'Acessórios' },
  { kind: 'background', label: 'Fundos' },
];

export function Avatar() {
  const coins = useProgressStore((s) => s.coins);
  const avatar = useProgressStore((s) => s.avatar);
  const purchaseAvatarItem = useProgressStore((s) => s.purchaseAvatarItem);
  const equipAvatarItem = useProgressStore((s) => s.equipAvatarItem);
  const [tab, setTab] = useState<AvatarItemKind>('background');

  const backgroundItem = getAvatarItem(avatar.background);

  const unlockedListFor = (kind: AvatarItemKind) =>
    kind === 'outfit' ? avatar.unlockedOutfits : kind === 'accessory' ? avatar.unlockedAccessories : avatar.unlockedBackgrounds;

  function selectItem(itemId: string) {
    const item = AVATAR_ITEMS.find((i) => i.id === itemId);
    if (!item) return;
    const owned = unlockedListFor(item.kind).includes(itemId);
    if (owned) {
      equipAvatarItem(item.kind, itemId);
      return;
    }
    if (item.unlock.type === 'coins') {
      const ok = purchaseAvatarItem(itemId, item.unlock.cost);
      if (ok) equipAvatarItem(item.kind, itemId);
    }
    // badge-locked items unlock automatically when the badge is earned (handled in the store)
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream pb-8">
      <TopBar title="Meu Avatar" backTo="/app/perfil" right={<CoinBadge coins={coins} />} />

      <div className="flex flex-col items-center px-4">
        <div className="flex w-full justify-center rounded-3xl py-3" style={{ backgroundColor: backgroundItem?.value }}>
          <MascotOficial size={180} recorte="inteiro" />
        </div>
      </div>

      <div className="mt-4 flex gap-2 px-4">
        {TABS.map((t) => (
          <button
            key={t.kind}
            onClick={() => setTab(t.kind)}
            className={`flex-1 rounded-full py-2.5 text-sm font-bold ${tab === t.kind ? 'bg-navy text-white' : 'bg-white text-navy/60'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab !== 'background' && (
        <p role="status" className="mt-4 px-4 text-center text-sm text-navy">
          As roupas e os acessórios estão aguardando a arte oficial. Seus itens continuam guardados e nenhuma moeda será gasta aqui.
        </p>
      )}

      <div className="mt-4 grid grid-cols-4 gap-3 px-4">
        {itemsByKind(tab).map((item) => {
          const owned = unlockedListFor(tab).includes(item.id);
          const equipped =
            (tab === 'outfit' && avatar.outfit === item.id) ||
            (tab === 'accessory' && avatar.accessory === item.id) ||
            (tab === 'background' && avatar.background === item.id);
          const badgeLocked = item.unlock.type === 'badge' && !owned;
          const awaitingOfficialArt = item.kind !== 'background';

          return (
            <button
              key={item.id}
              onClick={() => selectItem(item.id)}
              disabled={badgeLocked || awaitingOfficialArt}
              className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-2 ${
                equipped ? 'border-orange bg-orange-light/20' : 'border-navy/10 bg-white'
              } disabled:opacity-50`}
            >
              <span
                className="h-8 w-8 rounded-full border border-navy/10"
                style={{ background: item.kind === 'accessory' ? '#EFE6D2' : item.value }}
              />
              <span className="text-center text-[10px] font-bold leading-tight text-navy">{item.label}</span>
              {awaitingOfficialArt && <span className="text-xs font-semibold text-navy">Em preparação</span>}
              {!awaitingOfficialArt && !owned && item.unlock.type === 'coins' && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-orange-dark">
                  {item.unlock.cost} <BrandIcon name="recompensas" size={12} />
                </span>
              )}
              {item.unlock.type === 'badge' && !owned && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-navy/40">
                  <BrandIcon name="protecao" size={12} /> {getBadge(item.unlock.badgeId)?.name}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
