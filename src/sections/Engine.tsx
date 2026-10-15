import React from 'react';
import { Container } from '../components/Container';
import { Chip } from '../components/Chip';
import { Heading } from '../components/Heading';
import { Glass } from '../components/Glass';
import { Icon, type IconName } from '../components/Icon';
import { GhostText } from '../components/GhostText';
import { Reveal } from '../components/Reveal';
import { RevealGroup } from '../components/RevealGroup';
import { copy } from '../data/copy';
import './Engine.css';

const PILLAR_ICONS: IconName[] = ['layers', 'check', 'gauge'];

export const Engine: React.FC = () => {
  return (
    <section
      id="engine"
      data-theme="dawn-soft"
      className="ark-engine sheet"
      aria-labelledby="engine-heading"
    >
      <Container className="engine-container">
        {/* 1. Header Block */}
        <RevealGroup className="engine-header-block">
          <Reveal reveal="fade" delay={1}>
            <Chip variant="outline" className="engine-label-chip">
              {copy.engine.label}
            </Chip>
          </Reveal>
          <Reveal reveal="up" delay={2}>
            <Heading
              level={2}
              id="engine-heading"
              text={copy.engine.h2}
              ember={true}
              className="display-2 engine-title"
            />
          </Reveal>
          <Reveal reveal="up" delay={3}>
            <p className="lead engine-body">{copy.engine.body}</p>
          </Reveal>
        </RevealGroup>

        {/* 2. Hero Diagram: Suggest -> Check -> Record */}
        <Reveal reveal="up" delay={2} className="engine-diagram-wrap">
          <Glass tone="inverse" radius="xl" padded className="engine-diagram-glass">
            <div className="diagram-svg-container">
              {/* Responsive SVG Diagram */}
              <svg
                viewBox="0 0 900 240"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="diagram-svg"
                aria-label="Engine verification flow diagram: Suggest to Check to Record"
              >
                {/* Connecting Path from Node 1 to Node 2 to Node 3 */}
                <path
                  d="M230 110 H420 M540 110 H710"
                  stroke="var(--gas)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className="diagram-connect-line"
                />

                {/* Animated traveling path for ember dot */}
                <path
                  d="M230 110 H710"
                  stroke="var(--accent)"
                  strokeWidth="2.5"
                  pathLength="1"
                  className="diagram-travel-stroke"
                />

                {/* Node 1: Suggest (Dashed Circle) */}
                <g className="diagram-node node-suggest" transform="translate(140, 110)">
                  <circle
                    r="54"
                    stroke="var(--gas)"
                    strokeWidth="2"
                    strokeDasharray="5 5"
                    fill="var(--cadet-raised)"
                  />
                  <text
                    textAnchor="middle"
                    dy="5"
                    fill="var(--gas-soft)"
                    fontSize="15"
                    fontWeight="600"
                    fontFamily="var(--font-body)"
                  >
                    {copy.engine.diagram.suggest}
                  </text>
                </g>

                {/* Node 2: Check (Rounded Rect with Tick) */}
                <g className="diagram-node node-check" transform="translate(480, 110)">
                  <rect
                    x="-55"
                    y="-45"
                    width="110"
                    height="90"
                    rx="14"
                    stroke="var(--gas)"
                    strokeWidth="2"
                    fill="var(--cadet-raised)"
                  />
                  <path
                    d="M-12 -2 L-3 8 L14 -10"
                    stroke="var(--gas-soft)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <text
                    textAnchor="middle"
                    dy="28"
                    fill="var(--gas-soft)"
                    fontSize="15"
                    fontWeight="600"
                    fontFamily="var(--font-body)"
                  >
                    {copy.engine.diagram.check}
                  </text>
                </g>

                {/* Node 3: Record (Stack of 3 Bars) */}
                <g className="diagram-node node-record" transform="translate(780, 110)">
                  <rect
                    x="-55"
                    y="-45"
                    width="110"
                    height="90"
                    rx="14"
                    stroke="var(--gas)"
                    strokeWidth="2"
                    fill="var(--cadet-raised)"
                  />
                  {/* Three stacking bars appending 60ms apart */}
                  <rect
                    x="-32"
                    y="-24"
                    width="64"
                    height="8"
                    rx="4"
                    fill="var(--gas)"
                    className="record-bar bar-1"
                  />
                  <rect
                    x="-32"
                    y="-8"
                    width="64"
                    height="8"
                    rx="4"
                    fill="var(--gas)"
                    className="record-bar bar-2"
                  />
                  <rect
                    x="-32"
                    y="8"
                    width="64"
                    height="8"
                    rx="4"
                    fill="var(--gas-soft)"
                    className="record-bar bar-3"
                  />
                  <text
                    textAnchor="middle"
                    dy="32"
                    fill="var(--gas-soft)"
                    fontSize="14"
                    fontWeight="600"
                    fontFamily="var(--font-body)"
                  >
                    {copy.engine.diagram.record}
                  </text>
                </g>
              </svg>
            </div>
          </Glass>
        </Reveal>

        {/* 3. Six Steps Rail (Horizontal desktop, 3x2 tablet, vertical mobile) */}
        <div className="engine-steps-wrap">
          <div className="steps-rail-header">
            <span className="label">Step-by-Step Execution Covenant</span>
          </div>

          <RevealGroup className="steps-rail-track">
            {copy.engine.steps.map((st, idx) => {
              const isRecord = st.n === '05';
              return (
                <Reveal
                  key={st.n}
                  reveal="up"
                  delay={((idx % 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6}
                  className="step-node-item"
                >
                  <div className="step-node-badge-wrap">
                    <span className={`step-badge ${isRecord ? 'has-ember-ring' : ''}`}>
                      {st.n}
                    </span>
                    <span className="step-node-line" aria-hidden="true" />
                  </div>
                  <h4 className="step-node-title">{st.t}</h4>
                  <p className="body step-node-desc">{st.d}</p>
                </Reveal>
              );
            })}
          </RevealGroup>
        </div>

        {/* 4. Pillars (3 light glass tiles, first is tone inverse) */}
        <div className="engine-pillars-wrap">
          <RevealGroup className="pillars-grid">
            {copy.engine.pillars.map((pillar, idx) => (
              <Reveal
                key={pillar.t}
                reveal="up"
                delay={(idx + 1) as 1 | 2 | 3}
                className="pillar-card-wrap"
              >
                <Glass
                  tone={idx === 0 ? 'inverse' : 'light'}
                  radius="lg"
                  padded
                  className="pillar-card"
                >
                  <div className="pillar-icon-box" aria-hidden="true">
                    <Icon name={PILLAR_ICONS[idx] || 'check'} size={24} />
                  </div>
                  <h3 className="display-3 pillar-title">{pillar.t}</h3>
                  <p className="body pillar-desc">{pillar.d}</p>
                </Glass>
              </Reveal>
            ))}
          </RevealGroup>
        </div>

        {/* 5. Engineering Targets (Static, no counters or progress bars) */}
        <div className="engine-targets-wrap">
          <span className="label targets-eyebrow">{copy.engine.targetsLabel}</span>

          <RevealGroup className="targets-grid">
            {copy.engine.targets.map((tgt, idx) => (
              <Reveal
                key={tgt.v}
                reveal="up"
                delay={((idx % 4) + 1) as 1 | 2 | 3 | 4}
                className="target-card-wrap"
              >
                <div className="target-cadet-card">
                  {/* Four 10px corner ember dots */}
                  <span className="target-corner-dot dot-tl" aria-hidden="true" />
                  <span className="target-corner-dot dot-tr" aria-hidden="true" />
                  <span className="target-corner-dot dot-bl" aria-hidden="true" />
                  <span className="target-corner-dot dot-br" aria-hidden="true" />

                  <span className="target-numeral">{tgt.v}</span>
                  <p className="body target-desc">{tgt.d}</p>
                </div>
              </Reveal>
            ))}
          </RevealGroup>

          <p className="targets-note">{copy.engine.targetsNote}</p>
        </div>

        {/* 6. THE RESEARCH CONTINUATION (Anchor: #research) */}
        <div id="research" className="engine-research-section">
          <RevealGroup className="research-header-block">
            <Reveal reveal="fade" delay={1}>
              <Chip variant="outline" className="research-label-chip">
                {copy.research.label}
              </Chip>
            </Reveal>
            <Reveal reveal="up" delay={2}>
              <Heading
                level={2}
                text={copy.research.h2}
                ember={true}
                className="display-2 research-title"
              />
            </Reveal>
          </RevealGroup>

          <RevealGroup className="research-grid">
            {copy.research.items.map((item, idx) => {
              const numeral = `0${idx + 1}`;
              return (
                <Reveal
                  key={item.t}
                  reveal="up"
                  delay={((idx % 4) + 1) as 1 | 2 | 3 | 4}
                  className="research-tile-wrap"
                >
                  <Glass
                    tone="light"
                    radius="lg"
                    padded
                    className="research-card"
                  >
                    <div className="research-card-top">
                      <span className="label research-track-label">{item.k}</span>
                      <Chip variant="outline" dot="next" className="research-chip">
                        {copy.research.chip}
                      </Chip>
                    </div>

                    <h3 className="display-3 research-question">{item.t}</h3>
                    <p className="body research-desc">{item.d}</p>

                    {/* Architectural numeral as GhostText */}
                    <div className="research-ghost-wrap" aria-hidden="true">
                      <GhostText text={numeral} />
                    </div>
                  </Glass>
                </Reveal>
              );
            })}
          </RevealGroup>
        </div>
      </Container>
    </section>
  );
};
