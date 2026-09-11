import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MascotOficial, LogoOficial } from '../../components/mascot/MascotOficial';
import { useAuthStore } from '../../store/authStore';

export function Splash() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const childProfile = useAuthStore((s) => s.childProfile);

  useEffect(() => {
    const id = setTimeout(() => {
      if (isAuthenticated && childProfile) navigate('/app', { replace: true });
      else navigate('/publico', { replace: true });
    }, 1700);
    return () => clearTimeout(id);
  }, [isAuthenticated, childProfile, navigate]);

  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-b from-navy-deep to-navy px-8 text-center text-white">
      <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 140 }}>
        <MascotOficial pose="acenando" size={170} />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-display text-4xl font-extrabold"
      >
        <LogoOficial height={52} className="mx-auto" />
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="max-w-xs text-white/80">
        Aprender a Bíblia brincando. Fé, progresso e descobertas.
      </motion.p>
      <div className="mt-4 h-2 w-56 overflow-hidden rounded-full bg-white/20">
        <motion.div
          className="h-full rounded-full bg-orange"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      </div>
      <p className="text-sm text-white/60">Carregando...</p>
    </div>
  );
}

