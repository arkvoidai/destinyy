import React from 'react';
import { Container } from '../components/Container';
import { Chip } from '../components/Chip';
import { Ember } from '../components/Ember';
import { GhostText } from '../components/GhostText';
import { Reveal } from '../components/Reveal';
import { RevealGroup } from '../components/RevealGroup';
import { copy } from '../data/copy';
import './Ache.css';

export const Ache: React.FC = () => {
  return (
    <section
      id="ache"
      data-theme="void"
      className="ark-ache"
      aria-labelledby="ache-closing-heading"
    >
      <Container className="ache-container">
        {/* Label */}
        <Reveal reveal="fade" className="ache-label-row">
          <Chip variant="outline" className="ache-label-chip">
            {copy.ache.label}
          </Chip>
        </Reveal>

        {/* Three Beats */}
        <RevealGroup className="ache-beats-stack">
          {copy.ache.beats.map((beat, idx) => (
            <Reveal
              key={beat}
              reveal="up"
              delay={(idx + 1) as 1 | 2 | 3}
              className="ache-beat-reveal"
            >
              <p className="ache-beat-line">{beat}</p>
            </Reveal>
          ))}
        </RevealGroup>

        {/* Closing Line ending with Ember */}
        <Reveal reveal="up" delay={4} className="ache-closing-reveal">
          <h2 id="ache-closing-heading" className="display-2 ache-closing-heading">
            {copy.ache.closing}
            <Ember className="ache-ember" />
          </h2>
        </Reveal>
      </Container>

      {/* Decorative GhostText in normal case */}
      <div className="ache-ghost-wrap" aria-hidden="true">
        <GhostText text="Arkvoid" />
      </div>
    </section>
  );
};
