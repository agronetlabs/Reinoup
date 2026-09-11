import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { isParentAreaUnlocked } from '../../lib/parent-session';

export function ParentGuard() {
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isParentAreaUnlocked()) return <Navigate to="/pais/pin" state={{ returnTo: location.pathname + location.search }} replace />;
  return <Outlet />;
}
