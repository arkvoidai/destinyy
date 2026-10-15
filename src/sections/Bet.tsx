import React from 'react';
import { Container } from '../components/Container';
import { Chip } from '../components/Chip';
import { Heading } from '../components/Heading';
import { Glass } from '../components/Glass';
import { Reveal } from '../components/Reveal';
import { RevealGroup } from '../components/RevealGroup';
import { copy } from '../data/copy';
import './Bet.css';

export const Bet: React.FC = () => {
  return (
    <section
      id="bet"
      data-theme="night"
      className="ark-bet"
      aria-labelledby="bet-heading"
    >
      <Container className="bet-header-container">
        <RevealGroup className="bet-header-block">
          <div className="bet-top-chips">
            <Reveal reveal="fade" delay={1}>
              <Chip variant="outline" className="bet-label-chip">
                {copy.bet.label}
              </Chip>
            </Reveal>
            <Reveal reveal="fade" delay={2}>
              <Chip variant="glass" className="bet-category-chip">
                {copy.bet.category}
              </Chip>
            </Reveal>
          </div>

          <Reveal reveal="up" delay={2}>
            <Heading
              level={2}
              id="bet-heading"
              text={copy.bet.h2}
              ember={true}
              className="display-2 bet-title"
            />
          </Reveal>
        </RevealGroup>
      </Container>

      <Container className="bet-content-container">
        {/* Three full-width Glass rows (radius xl, 12px gaps) */}
        <RevealGroup className="bet-rows-container">
          {copy.bet.layers.map((layer, idx) => {
            const isNow = layer.s === 'Now';
            const chipDot = isNow ? 'now' : layer.s === 'Next' ? 'next' : 'then';
            return (
              <Reveal
                key={layer.n}
                reveal="up"
                delay={(idx + 1) as 1 | 2 | 3}
              >
                <Glass
                  tone={isNow ? 'inverse' : 'dark'}
                  radius="xl"
                  className={`bet-layer-row ${isNow ? 'is-now' : ''}`}
                >
                  {/* Left: Huge Newsreader numeral and title */}
                  <div className="bet-row-left">
                    <span className="bet-row-numeral">{layer.n}</span>
                    <h3 className="bet-row-title">{layer.t}</h3>
                  </div>

                  {/* Centre: Description (max 52ch) */}
                  <p className="bet-row-desc">{layer.d}</p>

                  {/* Right: Status chip */}
                  <div className="bet-row-right">
                    <Chip
                      variant={isNow ? 'solid' : 'outline'}
                      dot={chipDot}
                      className="bet-chip"
                    >
                      {layer.s}
                    </Chip>
                  </div>
                </Glass>
              </Reveal>
            );
          })}
        </RevealGroup>

        {/* Investor Line in Newsreader italic at display-3 scale, max 40ch, 2px ember rule */}
        <Reveal reveal="up" delay={4} className="bet-investor-quote-wrap">
          <p className="bet-investor-line">{copy.bet.line}</p>
        </Reveal>
      </Container>
    </section>
  );
};
