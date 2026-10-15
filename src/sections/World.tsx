import React, { useState, useEffect, useRef } from 'react';
import { Container } from '../components/Container';
import { Chip } from '../components/Chip';
import { Heading } from '../components/Heading';
import { SceneImage } from '../components/SceneImage';
import { Glass } from '../components/Glass';
import { Reveal } from '../components/Reveal';
import { RevealGroup } from '../components/RevealGroup';
import { copy } from '../data/copy';
import { useMedia } from '../hooks/useMedia';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { observe, unobserve } from '../lib/motion';
import type { AssetKey } from '../data/assets';
import './World.css';

const CHAPTER_ASSETS: AssetKey[] = [
  'chapterArrive',
  'chapterMeet',
  'chapterChange',
  'chapterLeave',
  'chapterReturn',
];

export const World: React.FC = () => {
  const isDesktop = useMedia('(min-width: 900px)');
  const isReducedMotion = useReducedMotion();
  const [activeChapter, setActiveChapter] = useState(0);

  const chapterRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Desktop single observer with rootMargin "-45% 0px -45% 0px"
  useEffect(() => {
    if (!isDesktop || isReducedMotion) return;

    const elements: HTMLElement[] = [];
    chapterRefs.current.forEach((el, idx) => {
      if (!el) return;
      elements.push(el);

      observe(
        el,
        (entry) => {
          if (entry.isIntersecting) {
            setActiveChapter(idx);
          }
        },
        {
          rootMargin: '-45% 0px -45% 0px',
          threshold: 0,
        }
      );
    });

    return () => {
      elements.forEach((el) => unobserve(el));
    };
  }, [isDesktop, isReducedMotion]);

  const showSticky = isDesktop && !isReducedMotion;

  return (
    <section id="world" data-theme="night" className="ark-world" aria-labelledby="world-heading">
      <Container className="world-header-container">
        <RevealGroup className="world-label-block">
          <Reveal reveal="fade" delay={1}>
            <Chip variant="outline" className="world-label-chip">
              {copy.world.label}
            </Chip>
          </Reveal>
          <Reveal reveal="up" delay={2}>
            <Heading
              level={2}
              id="world-heading"
              text={copy.world.h2}
              ember={true}
              className="display-2 world-title"
            />
          </Reveal>
        </RevealGroup>
      </Container>

      {showSticky ? (
        <Container className="world-sticky-container">
          {/* Left Column: 5 Chapters */}
          <div className="world-left-column">
            {copy.world.chapters.map((chap, idx) => {
              const isActive = idx === activeChapter;
              return (
                <div
                  key={chap.n}
                  ref={(el) => {
                    chapterRefs.current[idx] = el;
                  }}
                  className={`world-chapter-item ${isActive ? 'is-active' : ''}`}
                >
                  <Reveal reveal="up" delay={1}>
                    <span className={`chapter-numeral ${isActive ? 'is-ember' : ''}`}>
                      {chap.n}
                    </span>
                  </Reveal>
                  <Reveal reveal="up" delay={2}>
                    <h3 className="display-3 chapter-title">{chap.t}</h3>
                  </Reveal>
                  <Reveal reveal="up" delay={3}>
                    <p className="body chapter-desc">{chap.d}</p>
                  </Reveal>
                </div>
              );
            })}
          </div>

          {/* Center: Slim progress hairline */}
          <div className="world-center-line" aria-hidden="true">
            <div
              className="world-line-fill"
              style={{
                transform: `scaleY(${(activeChapter + 1) / copy.world.chapters.length})`,
              }}
            />
          </div>

          {/* Right Column: Sticky Stage with stacked SceneImages */}
          <div className="world-right-column">
            <div className="world-sticky-stage">
              <Glass tone="dark" radius="xl" className="world-stage-glass">
                <div className="world-stage-box">
                  {copy.world.chapters.map((chap, idx) => {
                    const isActive = idx === activeChapter;
                    const assetKey = CHAPTER_ASSETS[idx] || 'chapterArrive';
                    return (
                      <div
                        key={chap.n}
                        className={`world-stage-slide ${isActive ? 'is-active' : ''}`}
                        aria-hidden={!isActive}
                      >
                        <SceneImage
                          assetKey={assetKey}
                          priority={idx === 0}
                          className="world-scene-img"
                        />
                      </div>
                    );
                  })}

                  {/* Chapter 04 "Leave": Day-pass fade overlay */}
                  <div
                    className={`world-leave-overlay ${activeChapter === 3 ? 'is-active' : ''}`}
                    aria-hidden="true"
                  />

                  {/* Chapter 05 "Return": Lantern beacon point */}
                  <div
                    className={`world-lantern-beacon ${activeChapter === 4 ? 'is-active' : ''}`}
                    aria-hidden="true"
                  >
                    <span className="lantern-point" />
                    <span className="lantern-glow" />
                  </div>
                </div>
              </Glass>
            </div>
          </div>
        </Container>
      ) : (
        /* Tablet & Mobile & Reduced Motion: Stacked Cards */
        <Container className="world-mobile-container">
          <div className="world-mobile-cards">
            {copy.world.chapters.map((chap, idx) => {
              const assetKey = CHAPTER_ASSETS[idx] || 'chapterArrive';
              return (
                <Reveal key={chap.n} reveal="up" delay={((idx % 3) + 1) as 1 | 2 | 3}>
                  <div className="world-mobile-card">
                    <Glass tone="dark" radius="xl" className="world-card-glass">
                      <SceneImage assetKey={assetKey} className="world-card-image" />
                    </Glass>
                    <div className="world-card-content">
                      <span className="chapter-numeral is-ember">{chap.n}</span>
                      <h3 className="display-3 chapter-title">{chap.t}</h3>
                      <p className="body chapter-desc">{chap.d}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      )}
    </section>
  );
};
