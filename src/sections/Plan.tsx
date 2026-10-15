import React from 'react';
import { Container } from '../components/Container';
import { Chip } from '../components/Chip';
import { Heading } from '../components/Heading';
import { Glass } from '../components/Glass';
import { Reveal } from '../components/Reveal';
import { RevealGroup } from '../components/RevealGroup';
import { copy } from '../data/copy';
import './Plan.css';

export const Plan: React.FC = () => {
  return (
    <section
      id="plan"
      data-theme="dawn"
      className="ark-plan sheet"
      aria-labelledby="plan-heading"
    >
      <Container className="plan-header-container">
        <RevealGroup className="plan-header-block">
          <Reveal reveal="fade" delay={1}>
            <Chip variant="outline" className="plan-label-chip">
              {copy.plan.label}
            </Chip>
          </Reveal>
          <Reveal reveal="up" delay={2}>
            <Heading
              level={2}
              id="plan-heading"
              text={copy.plan.h2}
              ember={true}
              theme="dawn"
              className="display-2 plan-title"
            />
          </Reveal>
        </RevealGroup>
      </Container>

      <Container className="plan-content-container">
        {/* DESKTOP (1200px and up): Horizontal stepper of 6 light Glass tiles */}
        <div className="plan-desktop-stepper">
          {/* Progress Hairline: fills ONLY through step 01 */}
          <div className="plan-stepper-hairline-track" aria-hidden="true">
            <div className="plan-stepper-progress-fill" />
          </div>

          <RevealGroup className="plan-tiles-grid">
            {copy.plan.steps.map((st, idx) => {
              const isNow = st.s === 'Now';
              const chipDot = isNow ? 'now' : st.s === 'Next' ? 'next' : 'then';
              return (
                <Reveal
                  key={st.n}
                  reveal="up"
                  delay={(idx + 1) as 1 | 2 | 3 | 4 | 5 | 6}
                >
                  <Glass
                    tone={isNow ? 'inverse' : 'light'}
                    className={`plan-tile ${isNow ? 'is-now' : ''}`}
                  >
                    <div className="plan-tile-header">
                      <div className="plan-tile-numeral-wrap">
                        <span className="plan-tile-numeral">{st.n}</span>
                        {isNow && (
                          <div className="now-ripple-node" aria-hidden="true">
                            <span className="now-ripple-ring" />
                          </div>
                        )}
                      </div>
                      <Chip
                        variant={isNow ? 'solid' : 'outline'}
                        dot={chipDot}
                        className="plan-chip"
                      >
                        {st.s}
                      </Chip>
                    </div>

                    <h3 className="plan-tile-title">{st.t}</h3>
                    <p className="plan-tile-desc">{st.d}</p>
                  </Glass>
                </Reveal>
              );
            })}
          </RevealGroup>
        </div>

        {/* TABLET AND MOBILE (< 1200px): Vertical list with left rail */}
        <div className="plan-mobile-stepper">
          <div className="plan-mobile-rail-wrap">
            <div className="plan-mobile-rail-line" aria-hidden="true">
              <div className="plan-mobile-progress-fill" />
            </div>

            <RevealGroup className="plan-mobile-list">
              {copy.plan.steps.map((st, idx) => {
                const isNow = st.s === 'Now';
                const chipDot = isNow ? 'now' : st.s === 'Next' ? 'next' : 'then';
                return (
                  <Reveal
                    key={st.n}
                    reveal="up"
                    delay={(idx + 1) as 1 | 2 | 3 | 4 | 5 | 6}
                  >
                    <Glass
                      tone={isNow ? 'inverse' : 'light'}
                      className={`plan-mobile-card ${isNow ? 'is-now' : ''}`}
                    >
                      <div className="plan-tile-header">
                        <div className="plan-tile-numeral-wrap">
                          <span className="plan-tile-numeral">{st.n}</span>
                          {isNow && (
                            <div className="now-ripple-node" aria-hidden="true">
                              <span className="now-ripple-ring" />
                            </div>
                          )}
                        </div>
                        <Chip
                          variant={isNow ? 'solid' : 'outline'}
                          dot={chipDot}
                        >
                          {st.s}
                        </Chip>
                      </div>

                      <h3 className="plan-tile-title">{st.t}</h3>
                      <p className="plan-tile-desc">{st.d}</p>
                    </Glass>
                  </Reveal>
                );
              })}
            </RevealGroup>
          </div>
        </div>
      </Container>
    </section>
  );
};
