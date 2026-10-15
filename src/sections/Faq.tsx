import React, { useState } from 'react';
import { Container } from '../components/Container';
import { Chip } from '../components/Chip';
import { Heading } from '../components/Heading';
import { Icon } from '../components/Icon';
import { Reveal } from '../components/Reveal';
import { RevealGroup } from '../components/RevealGroup';
import { copy } from '../data/copy';
import './Faq.css';

export const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section
      id="faq"
      data-theme="dawn-soft"
      className="ark-faq sheet"
      aria-labelledby="faq-heading"
    >
      <Container className="faq-header-container">
        <RevealGroup className="faq-header-block">
          <Reveal reveal="fade" delay={1}>
            <Chip variant="outline" className="faq-label-chip">
              {copy.faq.label}
            </Chip>
          </Reveal>
          <Reveal reveal="up" delay={2}>
            <Heading
              level={2}
              id="faq-heading"
              text={copy.faq.h2}
              ember={true}
              theme="dawn"
              className="display-2 faq-title"
            />
          </Reveal>
        </RevealGroup>
      </Container>

      <Container className="faq-accordion-container">
        <RevealGroup className="faq-accordion-list">
          {copy.faq.items.map((item, idx) => {
            const isOpen = openIndex === idx;
            const btnId = `faq-trigger-${idx}`;
            const panelId = `faq-panel-${idx}`;

            return (
              <Reveal
                key={item.q}
                reveal="up"
                delay={((idx % 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6}
              >
                <div className={`faq-item-glass ${isOpen ? 'is-open' : ''}`}>
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => handleToggle(idx)}
                    className="faq-trigger-btn"
                  >
                    <span className="faq-question-text">{item.q}</span>
                    <span className="faq-icon-wrap" aria-hidden="true">
                      <Icon name="plus" size={16} />
                    </span>
                  </button>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    className="faq-panel"
                  >
                    <div className="faq-panel-content">
                      <div className="faq-answer-inner">
                        <p>{item.a}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </RevealGroup>
      </Container>
    </section>
  );
};
