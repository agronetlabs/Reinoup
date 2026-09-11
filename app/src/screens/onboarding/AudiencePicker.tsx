import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TopBar } from '../../components/ui/TopBar';
import { MascotOficial } from '../../components/mascot/MascotOficial';
import { useAuthStore } from '../../store/authStore';

export function AudiencePicker() {
  const navigate = useNavigate();
  const setAudience = useAuthStore((s) => s.setAudience);

  function choose(a: 'crianca' | 'pai') {
    setAudience(a);
    navigate('/login');
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <TopBar backTo="/" />
      <div className="flex flex-1 flex-col px-6 pb-8">
        <h1 className="font-display mb-8 text-3xl font-extrabold text-navy">Para quem é o ReinoUp?</h1>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => choose('crianca')}
          className="mb-5 flex items-center gap-4 rounded-[var(--radius-card)] bg-blue-sky/25 p-5 text-left"
        >
          <MascotOficial size={80} recorte="busto" />
          <div>
            <p className="font-display text-xl font-bold text-navy">Sou criança</p>
            <p className="text-sm text-navy/70">Quero aprender e me divertir!</p>
          </div>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => choose('pai')}
          className="flex items-center gap-4 rounded-[var(--radius-card)] bg-orange-light/25 p-5 text-left"
        >
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white text-3xl">👨‍👩‍👧</div>
          <div>
            <p className="font-display text-xl font-bold text-navy">Sou pai ou mãe</p>
            <p className="text-sm text-navy/70">Quero acompanhar o aprendizado.</p>
          </div>
        </motion.button>
      </div>
    </div>
  );
}

