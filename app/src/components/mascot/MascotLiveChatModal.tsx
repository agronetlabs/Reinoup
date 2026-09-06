import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ConversationProvider, useConversation } from '@elevenlabs/react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { MascotOficial } from './MascotOficial';
import { BrandIcon } from '../illustrations/BrandIcon';

const DEFAULT_AGENT_ID = 'agent_9001k156nw8yfhq827h291a9d2qp';

interface MascotLiveChatModalProps {
  open: boolean;
  onClose: () => void;
  agentId?: string;
}

function LiveChatSession({ onClose, agentId = DEFAULT_AGENT_ID }: { onClose: () => void; agentId?: string }) {
  const [lastMessage, setLastMessage] = useState<string>(
    'Olá, amiguinho! Toque no botão para conversar comigo sobre a Bíblia!'
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      setErrorMsg(null);
      setLastMessage('Oi! Estou te ouvindo, pode falar!');
    },
    onDisconnect: () => {
      // Sessão finalizada
    },
    onMessage: (payload) => {
      if (payload && payload.message) {
        setLastMessage(payload.message);
      }
    },
    onError: (err) => {
      console.error('ElevenLabs conversation error:', err);
      const text = typeof err === 'string' ? err : (err as Error)?.message || 'Erro de conexão';
      if (text.toLowerCase().includes('permission') || text.toLowerCase().includes('notallowed')) {
        setErrorMsg('Preciso que você libere o microfone no navegador para podermos conversar!');
      } else {
        setErrorMsg('Não consegui me conectar agora. Verifique a internet e tente de novo!');
      }
    },
  });

  const isConnected = conversation.status === 'connected';
  const isConnecting = conversation.status === 'connecting';
  const isSpeaking = conversation.isSpeaking;
  const isListening = conversation.isListening || (isConnected && !isSpeaking);

  const handleStart = useCallback(async () => {
    setErrorMsg(null);
    try {
      // Solicita permissão prévia do microfone no navegador
      if (navigator.mediaDevices?.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      await conversation.startSession({
        agentId: agentId || DEFAULT_AGENT_ID,
      });
    } catch (err: unknown) {
      console.error('Falha ao iniciar áudio:', err);
      setErrorMsg('Por favor, autorize o microfone para conversar com o Cordeirinho!');
    }
  }, [conversation, agentId]);

  const handleEnd = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch {
      // Silencioso
    }
  }, [conversation]);

  const handleClose = useCallback(async () => {
    if (isConnected || isConnecting) {
      await handleEnd();
    }
    onClose();
  }, [isConnected, isConnecting, handleEnd, onClose]);

  // Encerra sessão ao desmontar
  useEffect(() => {
    return () => {
      if (isConnected) {
        conversation.endSession();
      }
    };
  }, [isConnected, conversation]);

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {/* Cabeçalho */}
      <div className="flex w-full items-center justify-between">
        <span className="font-display flex items-center gap-2 text-base font-extrabold text-navy">
          <BrandIcon name="fe" size={22} />
          Cordeirinho Ao Vivo
        </span>
        <button
          onClick={handleClose}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-navy/5 text-navy/60 hover:bg-navy/10"
          aria-label="Fechar"
        >
          ✕
        </button>
      </div>

      {/* Mascote com anéis visuais de estado */}
      <div className="relative flex items-center justify-center py-2">
        {isSpeaking && (
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.2, 0.6] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute h-40 w-40 rounded-full bg-orange/20"
          />
        )}
        {isListening && isConnected && (
          <motion.div
            animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.15, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute h-40 w-40 rounded-full bg-green/20"
          />
        )}

        <div className="relative z-10 flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-b from-white to-cream shadow-[var(--shadow-card)]">
          <MascotOficial
            size={120}
            pose={isSpeaking ? 'comemorando' : isConnected ? 'feliz' : 'acenando'}
          />
        </div>
      </div>

      {/* Indicador de Status */}
      <div className="flex items-center gap-2">
        <span
          className={`h-3 w-3 rounded-full ${
            isConnected
              ? isSpeaking
                ? 'animate-pulse bg-orange'
                : 'bg-green'
              : isConnecting
              ? 'animate-ping bg-yellow'
              : 'bg-navy/30'
          }`}
        />
        <span className="font-display text-sm font-bold text-navy">
          {isConnecting
            ? 'Ligando para o Cordeirinho...'
            : isConnected
            ? isSpeaking
              ? 'Cordeirinho falando...'
              : 'Pode falar, estou ouvindo você!'
            : 'Pronto para conversar!'}
        </span>
      </div>

      {/* Ondas sonoras animadas durante a fala */}
      {isSpeaking && (
        <div className="flex items-center justify-center gap-1.5 py-1">
          {[0.6, 1.1, 0.8, 1.4, 0.7, 1.2, 0.5].map((h, i) => (
            <motion.span
              key={i}
              animate={{ scaleY: [0.4, h, 0.4] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.08 }}
              className="h-6 w-1 rounded-full bg-orange"
            />
          ))}
        </div>
      )}

      {/* Balão com a fala ou texto da conversa */}
      <div className="w-full rounded-2xl border border-navy/10 bg-white/80 p-3.5 shadow-sm">
        <p className="text-sm font-semibold leading-relaxed text-navy-deep">
          “{lastMessage}”
        </p>
      </div>

      {/* Mensagem de Erro (se houver) */}
      {errorMsg && (
        <p className="rounded-xl bg-orange-light/30 px-3 py-2 text-xs font-bold text-navy-deep">
          {errorMsg}
        </p>
      )}

      {/* Botões de Ação */}
      <div className="mt-1 flex w-full flex-col gap-2">
        {!isConnected && !isConnecting ? (
          <Button full size="lg" onClick={handleStart} className="gap-2">
            🎙️ Falar com o Cordeirinho
          </Button>
        ) : (
          <div className="flex w-full gap-2">
            <Button
              variant="secondary"
              size="md"
              className="flex-1"
              onClick={() => conversation.setMuted(!conversation.isMuted)}
            >
              {conversation.isMuted ? '🔇 Desmutar' : '🎤 Mutar'}
            </Button>
            <Button
              variant="danger"
              size="md"
              className="flex-1"
              onClick={handleEnd}
            >
              Encerrar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function MascotLiveChatModal({ open, onClose, agentId }: MascotLiveChatModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <ConversationProvider>
        <LiveChatSession onClose={onClose} agentId={agentId} />
      </ConversationProvider>
    </Modal>
  );
}
