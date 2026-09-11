import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { SceneConfig } from '../../content/types';
import { isApprovedStory3DArtId } from '../../../shared/card-art-policy';
import { getStoryArt, resolveStoryArtSource } from '../../lib/story-art';
import { MotifIcon } from './MotifIcon';

interface SceneProps {
  scene: SceneConfig;
  className?: string;
  height?: number;
  /** Explicit pixel width. Omit to fill the parent's width (default). */
  width?: number;
  artId?: string;
}

export function Scene({ scene, className = '', height = 200, width, artId }: SceneProps) {
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const reduceMotion = useReducedMotion();
  const art = getStoryArt(artId);
  const candidate = art && resolveStoryArtSource(art, failedSources);
  const hasApproved3DArt = isApprovedStory3DArtId(artId) && candidate === art?.src && candidate?.endsWith('.webp');
  const source = hasApproved3DArt || candidate?.endsWith('.svg') ? candidate : undefined;

  if (!art || !source) {
    return (
      <div
        role="img"
        aria-label={art?.alt ?? 'Ilustração simplificada da história'}
        data-art-status="legacy-fallback"
        className={`flex items-center justify-around overflow-hidden rounded-[var(--radius-card)] bg-sand ${className}`}
        style={{ height, width: width ?? '100%' }}
      >
        {scene.motifs.slice(0, 3).map((motif, index) => (
          <span key={`${motif}-${index}`} aria-hidden>
            <MotifIcon motif={motif} size={Math.round(height * 0.4)} />
          </span>
        ))}
      </div>
    );
  }

  const entranceX = art.guide === 'left' ? 10 : art.guide === 'right' ? -10 : 0;
  return (
    <div
      data-art-status={hasApproved3DArt ? 'approved-3d' : 'legacy-fallback'}
      className={`relative isolate overflow-hidden rounded-[var(--radius-card)] border border-white/70 bg-cream-dark shadow-[0_10px_24px_rgba(20,33,61,0.14)] ${className}`}
      style={{ height, width: width ?? '100%' }}
    >
      <motion.img
        key={source}
        src={source}
        alt={art.alt}
        onError={() => {
          console.warn(`Ilustração indisponível na história: ${source}`);
          setFailedSources(previous => previous.includes(source) ? previous : [...previous, source]);
        }}
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
    </div>
  );
}
