import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { BottomNav } from '../../components/ui/BottomNav';
import { AppLockOverlay } from '../../components/ui/AppLockOverlay';
import { MascotLiveChatModal } from '../../components/mascot/MascotLiveChatModal';
import { useAuthStore } from '../../store/authStore';
import { useProgressStore } from '../../store/progressStore';
import { useMascotChatStore } from '../../store/mascotChatStore';
import { useAppLock } from '../../hooks/useAppLock';
import { useActivityTimer } from '../../hooks/useActivityTimer';
import { iniciarSync } from '../../lib/sync';
import { PageTransition } from '../../components/ui/PageTransition';

export function AppLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const audience = useAuthStore((s) => s.audience);
  const familyId = useAuthStore((s) => s.familyId);
  const childProfile = useAuthStore((s) => s.childProfile);
  const ensureFreshDaily = useProgressStore((s) => s.ensureFreshDaily);
  const isChatOpen = useMascotChatStore((s) => s.isOpen);
  const openChat = useMascotChatStore((s) => s.openChat);
  const closeChat = useMascotChatStore((s) => s.closeChat);
  const lock = useAppLock();
  const location = useLocation();

  useActivityTimer(isAuthenticated && Boolean(childProfile) && !lock.locked);

  useEffect(() => {
    closeChat();
  }, [location.pathname, lock.locked, closeChat]);

  useEffect(() => {
    ensureFreshDaily();
  }, [ensureFreshDaily]);

  // Sync do progresso: sobe quando há conta remota, e é inerte sem ela.
  useEffect(() => iniciarSync(), [familyId, childProfile]);

  if (!isAuthenticated) {
    return <Navigate to={audience === 'crianca' ? '/onboarding-crianca' : '/login'} replace />;
  }
  if (!childProfile && !isAdmin) return <Navigate to="/onboarding-crianca" replace />;

  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col bg-cream">
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </div>

      {/* Botão flutuante para falar ao vivo com o Cordeirinho */}
      {!lock.locked && <div className="pointer-events-none fixed inset-x-0 bottom-20 z-40 mx-auto flex max-w-md justify-end px-4">
        <button
          onClick={openChat}
          className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-action-primary-bg shadow-[0_4px_16px_rgba(20,33,61,0.25)] ring-4 ring-white transition-[transform,box-shadow] duration-150 active:scale-95"
          aria-label="Conversar ao vivo com o Cordeirinho"
          title="Falar com o Cordeirinho"
        >
          <span className="text-2xl" role="img" aria-label="Microfone">🎙️</span>
        </button>
      </div>}

      <BottomNav />
      {lock.locked && lock.reason && <AppLockOverlay reason={lock.reason} />}
      <MascotLiveChatModal open={isChatOpen && !lock.locked} onClose={closeChat} />
    </div>
  );
}
