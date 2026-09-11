import { useState } from 'react';
import { ImageAsset } from '../illustrations/ImageAsset';
import mascotInline from '../../assets/brand/mascote-fallback.png?inline';
import mascotBustInline from '../../assets/brand/mascote-busto-fallback.png?inline';

export type MascotPose = 'feliz' | 'comemorando' | 'pensando' | 'acenando' | 'surpreso';

/**
 * Arte oficial da marca — o cordeirinho 3D de boné esportivo e o logo.
 *
 * Gerados por `bun scripts/build-brand-assets.mjs` a partir dos originais em
 * `02. Reino UP/01. Identidade Visual/`. WebP é o formato servido; se o
 * arquivo falhar, tenta PNG e depois a mesma arte oficial embutida no bundle.
 * Nunca redesenha o personagem ou usa o mascote antigo como fallback.
 */

type Recorte = 'inteiro' | 'busto';

interface MascotOficialProps {
  size?: number;
  /** Estado semântico da cena; não substitui a arte oficial por outro desenho. */
  pose?: MascotPose;
  /** 'busto' corta na altura do peito — melhor em tamanho pequeno, como nos balões. */
  recorte?: Recorte;
  className?: string;
}

export function MascotOficial({ size = 120, recorte, className = '' }: MascotOficialProps) {
  const [falhou, setFalhou] = useState(false);

  // Abaixo de ~96px o corpo inteiro vira um borrão: usa o busto por padrão.
  const usarBusto = recorte ? recorte === 'busto' : size < 96;

  if (falhou) {
    return (
      <img
        src={usarBusto ? mascotBustInline : mascotInline}
        alt="Cordeirinho do ReinoUp"
        className={`object-contain ${className}`}
        style={{ width: size, height: 'auto' }}
      />
    );
  }

  return (
    <ImageAsset
      asset={usarBusto ? 'mascotBust' : 'mascot'}
      onError={() => setFalhou(true)}
      className={`object-contain ${className}`}
      style={{ width: size, height: 'auto' }}
      loading="eager"
    />
  );
}

interface LogoOficialProps {
  height?: number;
  className?: string;
}

export function LogoOficial({ height = 48, className = '' }: LogoOficialProps) {
  const [falhou, setFalhou] = useState(false);

  if (falhou) {
    return (
      <span className={`font-display font-extrabold ${className}`} style={{ fontSize: height * 0.8 }}>
        ReinoUp
      </span>
    );
  }

  return (
    <ImageAsset
      asset="logo"
      onError={() => setFalhou(true)}
      className={`object-contain ${className}`}
      style={{ height, width: 'auto' }}
      loading="eager"
    />
  );
}
