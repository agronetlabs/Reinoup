import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TopBar } from '../../components/ui/TopBar';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { unlockParentArea } from '../../lib/parent-session';
import { BrandIcon } from '../../components/illustrations/BrandIcon';

export function ParentPinGate() {
  const navigate = useNavigate();
  const hasParentPin = useAuthStore((s) => s.hasParentPin());
  const verifyParentPin = useAuthStore((s) => s.verifyParentPin);
  const setParentPin = useAuthStore((s) => s.setParentPin);

  const [step, setStep] = useState<'create' | 'confirm' | 'enter'>(hasParentPin ? 'enter' : 'create');
  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [error, setError] = useState(false);

  function handleDigits(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    setPin(digits);
    setError(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pin.length !== 4) return;

    if (step === 'create') {
      setFirstPin(pin);
      setPin('');
      setStep('confirm');
      return;
    }
    if (step === 'confirm') {
      if (pin !== firstPin) {
        setError(true);
        setPin('');
        setStep('create');
        setFirstPin('');
        return;
      }
      setParentPin(pin);
      unlockParentArea();
      navigate('/pais', { replace: true });
      return;
    }
    // enter
    if (verifyParentPin(pin)) {
      unlockParentArea();
      navigate('/pais', { replace: true });
    } else {
      setError(true);
      setPin('');
    }
  }

  const title = step === 'create' ? 'Crie um PIN dos pais' : step === 'confirm' ? 'Confirme o PIN' : 'Digite o PIN dos pais';

  return (
    <div className="flex min-h-screen flex-col bg-navy text-white">
      <TopBar dark backTo="/app/perfil" />
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
        <BrandIcon name="protecao" size={40} className="brightness-0 invert" />
        <h1 className="font-display text-2xl font-extrabold">{title}</h1>
        <p className="max-w-xs text-white/70">
          {step === 'enter' ? 'Use uma combinação que a criança não sabe.' : 'Escolha 4 números que só você lembra.'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          <motion.input
            animate={error ? { x: [0, -8, 8, -8, 0] } : {}}
            type="password"
            inputMode="numeric"
            autoFocus
            value={pin}
            onChange={(e) => handleDigits(e.target.value)}
            className="w-40 rounded-2xl border-2 border-white/30 bg-white/10 px-4 py-3 text-center text-3xl tracking-[0.5em] text-white outline-none focus:border-orange"
            maxLength={4}
          />
          {error && <p className="text-sm font-bold text-red-soft">PIN incorreto, tente novamente.</p>}
          <Button type="submit" disabled={pin.length !== 4} size="lg">
            Confirmar
          </Button>
        </form>
      </div>
    </div>
  );
}
