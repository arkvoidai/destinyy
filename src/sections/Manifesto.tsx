import React, { useRef, useState, useEffect } from 'react';
import { Container } from '../components/Container';
import { Ember } from '../components/Ember';
import { Reveal } from '../components/Reveal';
import { RevealGroup } from '../components/RevealGroup';
import { copy } from '../data/copy';
import { useMedia } from '../hooks/useMedia';
import { observe, unobserve } from '../lib/motion';
import './Manifesto.css';

export const Manifesto: React.FC = () => {
  const isDesktop = useMedia('(min-width: 900px)');
  const [activeIndex, setActiveIndex] = useState(0);

  const step0Ref = useRef<HTMLDivElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);

  // Desktop observer band toggling data-active (zero scroll listeners)
  useEffect(() => {
    if (!isDesktop) return;

    const refs = [step0Ref, step1Ref, step2Ref, step3Ref];
    const elements: HTMLElement[] = [];

    refs.forEach((ref, idx) => {
      const el = ref.current;
      if (!el) return;
      elements.push(el);

      observe(
        el,
        (entry) => {
          if (entry.isIntersecting) {
            setActiveIndex(idx);
          }
        },
        {
          rootMargin: '-30% 0px -50% 0px',
          threshold: 0,
        }
      );
    });

    return () => {
      elements.forEach((el) => unobserve(el));
    };
  }, [isDesktop]);

  return (
    <section
      id="manifesto"
      data-theme="night"
      className="ark-manifesto"
      aria-label="Manifesto"
    >
      <div className="manifesto-gas-haze" aria-hidden="true" />

      {isDesktop ? (
        <div className="manifesto-sticky-wrapper">
          <div className="manifesto-triggers" aria-hidden="true">
            <div ref={step0Ref} className="manifesto-step-trigger" />
            <div ref={step1Ref} className="manifesto-step-trigger" />
            <div ref={step2Ref} className="manifesto-step-trigger" />
            <div ref={step3Ref} className="manifesto-step-trigger" />
          </div>

          <div className="manifesto-sticky-stage">
            <Container className="manifesto-container">
              {/* Left Progress Rail */}
              <div className="manifesto-rail" aria-hidden="true">
                <div
                  className="rail-ember-dot"
                  style={{
                    transform: `translateY(${activeIndex * 48}px)`,
                  }}
                />
                <div className="rail-ticks">
                  {copy.manifesto.rail.map((label, idx) => (
                    <div
                      key={label}
                      className={`rail-tick ${idx === activeIndex ? 'is-active' : ''}`}
                    >
                      <span className="tick-dot" />
                      <span className="tick-label label">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Centered Stacking Lines */}
              <div className="manifesto-lines-center">
                <div className="manifesto-lines-stack">
                  {copy.manifesto.lines.map((line, idx) => {
                    const isLast = idx === copy.manifesto.lines.length - 1;
                    const isActive = idx === activeIndex;
                    return (
                      <p
                        key={line}
                        className={`manifesto-line ${isLast ? 'is-last' : ''} ${
                          isActive ? 'is-active' : ''
                        }`}
                      >
                        {line.replace(/\.$/, '')}
                        {isLast && <Ember />}
                      </p>
                    );
                  })}
                </div>

                <p
                  className={`manifesto-sub lead ${
                    activeIndex === 3 ? 'is-visible' : ''
                  }`}
                >
                  {copy.manifesto.sub}
                </p>
              </div>
            </Container>
          </div>
        </div>
      ) : (
        <Container className="manifesto-mobile-container">
          <RevealGroup className="manifesto-mobile-stack">
            {copy.manifesto.lines.map((line, idx) => {
              const isLast = idx === copy.manifesto.lines.length - 1;
              return (
                <Reveal key={line} reveal="up" delay={(idx + 1) as 1 | 2 | 3 | 4}>
                  <p className={`manifesto-line ${isLast ? 'is-last' : ''}`}>
                    {line.replace(/\.$/, '')}
                    {isLast && <Ember />}
                  </p>
                </Reveal>
              );
            })}
          </RevealGroup>

          <Reveal reveal="fade" delay={5}>
            <p className="manifesto-sub lead" style={{ opacity: 1, marginTop: 'var(--space-32)' }}>
              {copy.manifesto.sub}
            </p>
          </Reveal>
        </Container>
      )}
    </section>
  );
};
