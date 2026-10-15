import React, { useState, useEffect, useRef } from 'react';
import { ASSETS, type AssetSpec } from '../data/assets';
import { copy } from '../data/copy';
import { Chip } from './Chip';
import './SceneImage.css';

const warnedKeys = new Set<string>();

export interface SceneImageProps {
  assetKey: string;
  priority?: boolean;
  sizes?: string;
  objectPosition?: string;
  hideLabel?: boolean;
  overlay?: React.ReactNode;
  className?: string;
}

export const SceneImage: React.FC<SceneImageProps> = ({
  assetKey,
  priority = false,
  sizes = '100vw',
  objectPosition = 'center',
  hideLabel = false,
  overlay,
  className = '',
}) => {
  const spec: AssetSpec | undefined = (ASSETS as Record<string, AssetSpec | undefined>)[assetKey];
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(() => {
    if (!spec || !spec.src) return 'error';
    return 'loading';
  });
  const [hasRevealed, setHasRevealed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Warn once in development for unknown keys
  useEffect(() => {
    if (!spec && !warnedKeys.has(assetKey)) {
      warnedKeys.add(assetKey);
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[SceneImage] Missing asset key: "${assetKey}".`);
      }
    }
  }, [assetKey, spec]);

  // Check if image is already cached and loaded on mount
  useEffect(() => {
    if (imgRef.current && spec?.src) {
      if (imgRef.current.complete && imgRef.current.naturalWidth > 0) {
        setStatus('loaded');
        setHasRevealed(true);
      }
    }
  }, [spec?.src]);

  if (!spec && !warnedKeys.has(assetKey)) {
    return null;
  }

  if (!spec) {
    return (
      <figure
        className={`scene-figure is-atmosphere ${className}`.trim()}
        style={{ aspectRatio: '16 / 9' }}
      >
        <div className="atmosphere-plate" aria-hidden="true">
          <div className="atmo-ember-lantern" />
          <div className="atmo-gas-haze" />
          <div className="atmo-arch-logo">
            <svg viewBox="0 0 48 56" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 50V24a18 18 0 0 1 36 0v26M2 50h44" />
              <circle cx="24" cy="30" r="3" fill="currentColor" stroke="none" />
            </svg>
          </div>
        </div>
        <div className="scene-bottom-scrim" aria-hidden="true" />
        {overlay && <div className="scene-overlay-content">{overlay}</div>}
      </figure>
    );
  }

  if (spec.optional && (!spec.src || status === 'error')) {
    return null;
  }

  const isFailedOrMissing = !spec.src || status === 'error';

  return (
    <figure
      className={`scene-figure ${isFailedOrMissing ? 'is-atmosphere' : ''} ${
        status === 'loaded' ? 'is-loaded' : ''
      } ${hasRevealed ? 'is-revealed' : ''} ${className}`.trim()}
      style={{ aspectRatio: spec.aspectRatio }}
    >
      {/* 1. Photographic Image if available */}
      {spec.src && (
        <div className="scene-image-clip">
          <img
            ref={imgRef}
            src={spec.src}
            alt={spec.alt}
            width={spec.width}
            height={spec.height}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            sizes={sizes}
            style={{ objectPosition }}
            className="scene-photo"
            onLoad={() => {
              setStatus('loaded');
              setHasRevealed(true);
            }}
            onError={() => setStatus('error')}
          />
        </div>
      )}

      {/* 2. Atmosphere Plate (rendered when photo is missing or failed) */}
      {isFailedOrMissing && (
        <div className="atmosphere-plate" aria-hidden="true">
          <div className="atmo-ember-lantern" />
          <div className="atmo-gas-haze" />
          <div className="atmo-arch-logo">
            <svg viewBox="0 0 48 56" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 50V24a18 18 0 0 1 36 0v26M2 50h44" />
              <circle cx="24" cy="30" r="3" fill="currentColor" stroke="none" />
            </svg>
          </div>
          {!hideLabel && (
            <div className="atmo-label-container">
              <Chip variant="glass" className="atmo-chip">
                {spec.name || spec.caption}
              </Chip>
            </div>
          )}
        </div>
      )}

      {/* 3. Bottom Scrim (guarantees 4.5:1 for overlay text) */}
      <div className="scene-bottom-scrim" aria-hidden="true" />

      {/* 4. Loaded Photo Caption Chip */}
      {status === 'loaded' && !isFailedOrMissing && (
        <div className="scene-caption-container">
          <Chip variant="glass" className="concept-art-chip">
            {copy.ui.conceptArtCaption}
          </Chip>
        </div>
      )}

      {/* 5. Custom Overlay Content */}
      {overlay && <div className="scene-overlay-content">{overlay}</div>}
    </figure>
  );
};
