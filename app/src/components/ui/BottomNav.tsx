import { NavLink } from 'react-router-dom';

interface TabDef {
  to: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
}

function IconWrap({ children, active }: { children: React.ReactNode; active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--color-orange)' : 'var(--color-navy)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity={active ? 1 : 0.55}>
      {children}
    </svg>
  );
}

const TABS: TabDef[] = [
  {
    to: '/app',
    label: 'Início',
    icon: (a) => (
      <IconWrap active={a}>
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
      </IconWrap>
    ),
  },
  {
    to: '/app/historias',
    label: 'Estudos',
    icon: (a) => (
      <IconWrap active={a}>
        <path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z" />
        <path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z" />
      </IconWrap>
    ),
  },
  {
    to: '/app/desafios',
    label: 'Desafios',
    icon: (a) => (
      <IconWrap active={a}>
        <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
      </IconWrap>
    ),
  },
  {
    to: '/app/jogos',
    label: 'Jogos',
    icon: (a) => (
      <IconWrap active={a}>
        <rect x="3" y="8" width="18" height="10" rx="4" />
        <path d="M8 11v4M6 13h4M16 12h.01M18.5 14h.01" />
      </IconWrap>
    ),
  },
  {
    to: '/app/perfil',
    label: 'Perfil',
    icon: (a) => (
      <IconWrap active={a}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
      </IconWrap>
    ),
  },
];

export function BottomNav() {
  return (
    <nav className="safe-bottom sticky bottom-0 z-30 border-t border-navy/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-stretch justify-between px-2 py-1.5">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/app'}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[11px] font-bold ${isActive ? 'text-orange' : 'text-navy/60'}`
            }
          >
            {({ isActive }) => (
              <>
                {tab.icon(isActive)}
                {tab.label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
