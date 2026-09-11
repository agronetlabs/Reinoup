import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { SceneConfig, Motif } from '../../content/types';
import { getStoryArt, resolveStoryArtSource } from '../../lib/story-art';
import { MascotOficial } from '../mascot/MascotOficial';
import { MotifIcon } from './MotifIcon';

const SKY_GRADIENTS: Record<SceneConfig['sky'], [string, string]> = {
  dia: ['#8FC7EA', '#EAF6FF'],
  entardecer: ['#F5A15A', '#FCE0B0'],
  noite: ['#152F57', '#2A4D84'],
  tempestade: ['#4a5a72', '#8894a8'],
};

const GROUND_COLORS: Record<SceneConfig['ground'], string> = {
  campo: '#A9D18E',
  deserto: '#E3C888',
  agua: '#5FA3D9',
  pedra: '#9AA0A6',
  palacio: '#D9C48C',
  jardim: '#7FBF6A',
};

const SKY_MOTIFS = new Set<Motif>(['rainbow', 'dove', 'star', 'angel', 'fire-column', 'rain']);

interface SceneProps {
  scene: SceneConfig;
  className?: string;
  height?: number;
  /** Explicit pixel width. Omit to fill the parent's width (default). */
  width?: number;
  artId?: string;
  showGuide?: boolean;
}

export function Scene({ scene, className = '', height = 200, width, artId, showGuide = false }: SceneProps) {
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const reduceMotion = useReducedMotion();
  const art = getStoryArt(artId);
  const source = art && resolveStoryArtSource(art, failedSources);

  if (art && source) {
    const guideSize = Math.min(126, Math.max(64, Math.round(height * 0.5)));
    const entranceX = art.guide === 'left' ? 10 : art.guide === 'right' ? -10 : 0;
    return (
      <div
        className={`relative isolate overflow-hidden rounded-[var(--radius-card)] border border-white/70 bg-cream-dark shadow-[0_10px_24px_rgba(20,33,61,0.14)] ${className}`}
        style={{ height, width: width ?? '100%' }}
      >
        <motion.img
          key={source}
          src={source}
          alt={art.alt}
          onError={() => setFailedSources(previous => previous.includes(source) ? previous : [...previous, source])}
          className="h-full w-full object-cover"
          style={{ objectPosition: art.focalPoint, transformOrigin: art.focalPoint }}
          initial={reduceMotion ? false : { scale: 1.045, x: entranceX, filter: 'saturate(.82) brightness(.94)' }}
          animate={{ scale: 1, x: 0, filter: 'saturate(1) brightness(1)' }}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-deep/20 via-transparent to-white/10" />
        {!reduceMotion && (
          <motion.div
            key={`light-${artId}`}
            aria-hidden
            className="pointer-events-none absolute -inset-y-8 w-1/3 rotate-12 bg-white/20 blur-2xl"
            initial={{ x: '-180%', opacity: 0 }}
            animate={{ x: '430%', opacity: [0, 0.45, 0] }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
        {showGuide && art.guide && (
          <motion.div
            key={`guide-${artId}`}
            initial={reduceMotion ? false : { opacity: 0.7, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`pointer-events-none absolute bottom-0 ${art.guide === 'left' ? 'left-2' : 'right-2'} drop-shadow-lg`}
          >
            <MascotOficial size={guideSize} />
          </motion.div>
        )}
      </div>
    );
  }

  const [skyTop, skyBottom] = SKY_GRADIENTS[scene.sky];
  const gradId = `sky-${scene.sky}-${scene.ground}`;
  const motifs = scene.motifs.slice(0, 3);

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`} style={{ height, width: width ?? '100%' }}>
      <svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMax slice" className="h-full w-full">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={skyTop} />
            <stop offset="100%" stopColor={skyBottom} />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100" height="60" fill={`url(#${gradId})`} />
        {scene.sky === 'noite' &&
          Array.from({ length: 14 }).map((_, i) => (
            <circle key={i} cx={(i * 37) % 100} cy={(i * 17) % 30} r={0.5 + (i % 3) * 0.2} fill="#fff" opacity={0.6} />
          ))}
        {scene.sky === 'dia' && <circle cx="86" cy="12" r="6" fill="#FFE9A8" opacity="0.9" />}
        {scene.sky === 'entardecer' && <circle cx="50" cy="16" r="8" fill="#FFD873" opacity="0.9" />}
        <path d="M0 42 Q25 34 50 42 T100 42 V60 H0Z" fill={GROUND_COLORS[scene.ground]} />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex items-end justify-around pb-1">
        {motifs.map((m, i) => (
          <div
            key={`${m}-${i}`}
            className="drop-shadow-sm"
            style={{
              transform: `translateY(${SKY_MOTIFS.has(m) ? -height * 0.28 : 0}px)`,
              marginLeft: i === 0 ? 0 : undefined,
            }}
          >
            <MotifIcon motif={m} size={Math.round(height * 0.4)} />
          </div>
        ))}
      </div>
    </div>
  );
}
