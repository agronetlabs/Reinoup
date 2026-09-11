import { useState, type ImgHTMLAttributes } from 'react';
import { getImageAsset, type ImageAssetId } from '../../lib/image-assets';

interface ImageAssetProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'alt'> {
  asset: ImageAssetId;
  alt?: string;
}

export function ImageAsset({ asset, alt, onError, ...props }: ImageAssetProps) {
  const image = getImageAsset(asset);
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const useFallback = failedSource === image.src;

  return (
    <picture>
      {!useFallback && <source srcSet={image.src} type={image.type} />}
      <img
        {...props}
        src={image.fallback}
        alt={alt ?? image.alt}
        onError={(event) => {
          // <picture> só troca de formato por compatibilidade, não por falha de rede.
          const fallbackUrl = new URL(image.fallback, event.currentTarget.ownerDocument.baseURI).href;
          if (!useFallback && event.currentTarget.currentSrc !== fallbackUrl) setFailedSource(image.src);
          else onError?.(event);
        }}
      />
    </picture>
  );
}
