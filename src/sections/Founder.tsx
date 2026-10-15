import React, { useState, useEffect } from 'react';
import { Container } from '../components/Container';
import { Chip } from '../components/Chip';
import { Glass } from '../components/Glass';
import { SceneImage } from '../components/SceneImage';
import { Reveal } from '../components/Reveal';
import { RevealGroup } from '../components/RevealGroup';
import { copy } from '../data/copy';
import { ASSETS } from '../data/assets';
import './Founder.css';

export const Founder: React.FC = () => {
  const [photoExists, setPhotoExists] = useState(false);

  // Check if founder photo exists; if missing, renders NOTHING
  useEffect(() => {
    const src = ASSETS.founder?.src;
    if (!src) return;
    const img = new Image();
    img.src = src;
    img.onload = () => {
      if (img.naturalWidth > 0) setPhotoExists(true);
    };
    img.onerror = () => {
      setPhotoExists(false);
    };
  }, []);

  return (
    <section
      id="founder"
      data-theme="void"
      className="ark-founder"
      aria-label="Founder Note"
    >
      <Container className="founder-container">
        <div className={`founder-layout ${photoExists ? 'has-photo' : ''}`}>
          {/* Quote Column */}
          <RevealGroup className="founder-quote-column">
            <Reveal reveal="fade" delay={1} className="founder-eyebrow">
              <Chip variant="outline">{copy.founder.label}</Chip>
            </Reveal>

            <Reveal reveal="up" delay={2}>
              <blockquote className="founder-blockquote">
                <p className="founder-quote-text">
                  <span className="founder-quote-mark" aria-hidden="true">&ldquo;</span>
                  {copy.founder.quote}&rdquo;
                </p>
              </blockquote>
            </Reveal>

            <Reveal reveal="up" delay={3}>
              <div className="founder-attribution">
                <h3 className="founder-name">{copy.founder.name}</h3>
                <p className="founder-role">{copy.founder.role}</p>
              </div>
            </Reveal>
          </RevealGroup>

          {/* Desktop Optional Photo in Glass matte: renders NOTHING if missing */}
          {photoExists && (
            <Reveal reveal="image" delay={3} className="founder-photo-wrap">
              <Glass tone="dark" className="founder-photo-glass">
                <SceneImage
                  assetKey="founder"
                  hideLabel={true}
                  className="founder-scene-photo"
                />
              </Glass>
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
};
