import React from 'react';
import { Container } from '../components/Container';
import { Chip } from '../components/Chip';
import { Heading } from '../components/Heading';
import { Glass } from '../components/Glass';
import { SceneImage } from '../components/SceneImage';
import { Icon } from '../components/Icon';
import { GhostText } from '../components/GhostText';
import { Reveal } from '../components/Reveal';
import { RevealGroup } from '../components/RevealGroup';
import { copy } from '../data/copy';
import type { AssetKey } from '../data/assets';
import './People.css';

interface CastItem {
  key: AssetKey;
  title: string;
  desc: string;
  bentoClass: string;
}

const CAST_DATA: CastItem[] = [
  {
    key: 'personScholar',
    title: copy.people.cast[0].t,
    desc: copy.people.cast[0].d,
    bentoClass: 'bento-scholar',
  },
  {
    key: 'personDisciple',
    title: copy.people.cast[1].t,
    desc: copy.people.cast[1].d,
    bentoClass: 'bento-disciple',
  },
  {
    key: 'personBeast',
    title: copy.people.cast[2].t,
    desc: copy.people.cast[2].d,
    bentoClass: 'bento-beast',
  },
  {
    key: 'personImmortal',
    title: copy.people.cast[3].t,
    desc: copy.people.cast[3].d,
    bentoClass: 'bento-immortal',
  },
];

export const People: React.FC = () => {
  return (
    <section
      id="people"
      data-theme="dawn"
      className="ark-people sheet"
      aria-labelledby="people-heading"
    >
      <Container className="people-container">
        {/* Left Column: Sticky Heading & Memory Formation Timeline */}
        <div className="people-left-column">
          <div className="people-sticky-sidebar">
            {/* GhostText faint behind heading */}
            <div className="people-ghost-wrap" aria-hidden="true">
              <GhostText text="Day 7" />
            </div>

            <RevealGroup className="people-header-content">
              <Reveal reveal="fade" delay={1}>
                <Chip variant="outline" className="people-label-chip">
                  {copy.people.label}
                </Chip>
              </Reveal>
              <Reveal reveal="up" delay={2}>
                <Heading
                  level={2}
                  id="people-heading"
                  text={copy.people.h2}
                  ember={true}
                  className="display-2 people-title"
                />
              </Reveal>
              <Reveal reveal="up" delay={3}>
                <p className="lead people-sub">{copy.people.sub}</p>
              </Reveal>
            </RevealGroup>

            {/* Memory Formation Timeline */}
            <div className="people-timeline-block">
              <span className="label timeline-label">{copy.people.memoryLabel}</span>

              <div className="timeline-wrapper">
                {/* Connecting Line that draws on entry */}
                <Reveal reveal="line" className="timeline-connecting-line">
                  <span className="line-fill" />
                </Reveal>

                <div className="timeline-cards">
                  {copy.people.memory.map((item, idx) => {
                    const isLast = idx === copy.people.memory.length - 1;
                    return (
                      <Reveal
                        key={item.day}
                        reveal="up"
                        delay={(idx + 1) as 1 | 2 | 3}
                        className="timeline-card-reveal"
                      >
                        <Glass
                          tone="light"
                          radius="md"
                          padded
                          className={`timeline-card ${isLast ? 'is-last-node' : ''}`}
                        >
                          <div className="timeline-card-header">
                            <Chip variant="outline" className="timeline-day-chip">
                              {item.day}
                            </Chip>
                            {isLast ? (
                              <div className="day7-node-wrap" aria-hidden="true">
                                <span className="day7-dot" />
                                <span className="day7-ripple" />
                              </div>
                            ) : (
                              <span className="timeline-dot" aria-hidden="true" />
                            )}
                          </div>
                          <p className="body timeline-text">{item.line}</p>
                        </Glass>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Asymmetric Bento Grid of 4 Dignified Cast Members */}
        <div
          className="people-bento-scroller"
          tabIndex={0}
          role="region"
          aria-label="Inhabitants gallery"
        >
          <RevealGroup className="people-bento-grid">
            {CAST_DATA.map((item, idx) => (
              <Reveal
                key={item.key}
                reveal="up"
                delay={((idx % 3) + 1) as 1 | 2 | 3}
                className={`bento-tile-wrap ${item.bentoClass}`}
              >
                <Glass
                  tone="light"
                  radius="xl"
                  interactive
                  className="people-bento-tile"
                >
                  <div className="bento-photo-container">
                    <SceneImage
                      assetKey={item.key}
                      hideLabel={true}
                      className="bento-scene-photo"
                    />
                    <div className="bento-scrim" aria-hidden="true" />
                  </div>

                  {/* Tile Overlay Content */}
                  <div className="bento-tile-overlay">
                    <div className="bento-text-box">
                      <h3 className="display-3 bento-name">{item.title}</h3>
                      <p className="body bento-desc">{item.desc}</p>
                    </div>

                    <div className="bento-icon-btn" aria-hidden="true">
                      <Icon name="arrow-up-right" size={18} />
                    </div>
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
