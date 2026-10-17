import React from 'react';
import { Container } from '../components/Container';
import { Glass } from '../components/Glass';
import { Reveal } from '../components/Reveal';
import { RevealGroup } from '../components/RevealGroup';
import { copy } from '../data/copy';
import './GlanceSection.css';

export const GlanceSection: React.FC = () => {
  return (
    <section id="features" data-theme="void" className="ark-glance-section" aria-label="At a glance">
      <Container className="glance-section-container">
        <RevealGroup className="hero-glance-grid">
          {copy.hero.glance.map((item, idx) => {
            const isInverse = idx === 0;
            return (
              <Reveal
                key={item.k}
                reveal="up"
                delay={((idx % 4) + 1) as 1 | 2 | 3 | 4}
                className="glance-cell-wrap"
              >
                <Glass
                  tone={isInverse ? 'inverse' : 'dark'}
                  radius="md"
                  className={`glance-cell ${isInverse ? 'glance-cell-inverse' : ''}`}
                >
                  <span className="glance-key label">{item.k}</span>
                  <span className="glance-val">{item.v}</span>
                </Glass>
              </Reveal>
            );
          })}
        </RevealGroup>
      </Container>
    </section>
  );
};
