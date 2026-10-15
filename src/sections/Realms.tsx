import React from 'react';
import { Container } from '../components/Container';
import { Chip } from '../components/Chip';
import { Heading } from '../components/Heading';
import { Glass } from '../components/Glass';
import { SceneImage } from '../components/SceneImage';
import { Icon } from '../components/Icon';
import { Reveal } from '../components/Reveal';
import { RevealGroup } from '../components/RevealGroup';
import { copy } from '../data/copy';
import type { AssetKey } from '../data/assets';
import './Realms.css';

const REALM_KEYS: AssetKey[] = [
  'realm01',
  'realm02',
  'realm03',
  'realm04',
  'realm05',
  'realm06',
];

export const Realms: React.FC = () => {
  return (
    <section
      id="realms"
      data-theme="deep"
      className="ark-realms"
      aria-labelledby="realms-heading"
    >
      <Container className="realms-header-container">
        <RevealGroup className="realms-label-block">
          <Reveal reveal="fade" delay={1}>
            <Chip variant="outline" className="realms-label-chip">
              {copy.realms.label}
            </Chip>
          </Reveal>
          <Reveal reveal="up" delay={2}>
            <Heading
              level={2}
              id="realms-heading"
              text={copy.realms.h2}
              ember={true}
              className="display-2 realms-title"
            />
          </Reveal>
          <Reveal reveal="up" delay={3}>
            <p className="lead realms-sub">{copy.realms.sub}</p>
          </Reveal>
        </RevealGroup>
      </Container>

      {/* Grid or Scroll-snap container */}
      <Container className="realms-content-container">
        <div
          className="realms-scroller"
          tabIndex={0}
          role="region"
          aria-label="Cultivation realms overview"
        >
          <RevealGroup className="realms-grid">
            {/* 1. Six Known Realms (realm01 to realm06) */}
            {copy.realms.items.map((item, idx) => {
              const assetKey = REALM_KEYS[idx] || 'realm01';
              return (
                <Reveal
                  key={item.n}
                  reveal="up"
                  delay={((idx % 5) + 1) as 1 | 2 | 3 | 4 | 5}
                  className="realm-card-wrap"
                >
                  <Glass
                    tone="dark"
                    radius="xl"
                    interactive
                    className="realm-card"
                  >
                    <div className="realm-photo-container">
                      <SceneImage
                        assetKey={assetKey}
                        hideLabel={true}
                        className="realm-scene-photo"
                      />
                      <div className="realm-scrim-top" aria-hidden="true" />
                      <div className="realm-scrim-bottom" aria-hidden="true" />
                    </div>

                    {/* Top-left Numeral */}
                    <span className="realm-numeral" aria-hidden="true">
                      {item.n}
                    </span>

                    {/* Bottom Realm Name */}
                    <div className="realm-bottom-content">
                      <h3 className="display-3 realm-name">{item.t}</h3>
                    </div>
                  </Glass>
                </Reveal>
              );
            })}

            {/* 2. Three Unknown Cards (07, 08, 09) */}
            {copy.realms.unknown.map((num, idx) => (
              <Reveal
                key={num}
                reveal="fade"
                delay={((idx + 2) % 5 + 1) as 1 | 2 | 3 | 4 | 5}
                className="realm-card-wrap"
              >
                <Glass
                  tone="dark"
                  radius="xl"
                  className="realm-card is-unknown"
                >
                  {/* Top-left Numeral */}
                  <span className="realm-numeral" aria-hidden="true">
                    {num}
                  </span>

                  <div className="unknown-center-content">
                    <div className="unknown-icon-box" aria-hidden="true">
                      <Icon name="door" size={28} />
                    </div>
                    <span className="unknown-title">{copy.realms.unknownLabel}</span>
                  </div>
                </Glass>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </section>
  );
};
