import React, { useEffect, useRef } from 'react';
import { Container } from '../components/Container';
import { Chip } from '../components/Chip';
import { Button } from '../components/Button';
import { Glass } from '../components/Glass';
import { SceneImage } from '../components/SceneImage';
import { Ember } from '../components/Ember';
import { SplitWords } from '../components/SplitWords';
import { Reveal } from '../components/Reveal';
import { RevealGroup } from '../components/RevealGroup';
import { copy } from '../data/copy';
import { easeScrollTo, createIdleLoop } from '../lib/motion';
import { useMedia } from '../hooks/useMedia';
import './Hero.css';

export const Hero: React.FC = () => {
  const isDesktop = useMedia('(min-width: 900px)');

  const heroRef = useRef<HTMLElement>(null);
  const photoWrapperRef = useRef<HTMLDivElement>(null);

  // Desktop Pointer Drift (motion full only)
  useEffect(() => {
    if (!isDesktop) return;

    const hero = heroRef.current;
    const wrapper = photoWrapperRef.current;
    if (!hero || !wrapper) return;

    const motionMode = document.documentElement.getAttribute('data-motion');
    const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (motionMode !== 'full' || !isFine) return;

    let heroRect = hero.getBoundingClientRect();
    const handleResize = () => {
      heroRect = hero.getBoundingClientRect();
    };
    window.addEventListener('resize', handleResize);

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const relX = (e.clientX - heroRect.left) / heroRect.width - 0.5;
      const relY = (e.clientY - heroRect.top) / heroRect.height - 0.5;
      targetX = relX * -10; // Up to 10px opposite pointer
      targetY = relY * -10;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const stopLoop = createIdleLoop(() => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      if (wrapper) {
        wrapper.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
      }
      return true;
    });

    return () => {
      stopLoop();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDesktop]);

  const handleActionClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    easeScrollTo(href);
  };

  return (
    <section id="top" data-theme="void" ref={heroRef} className="ark-hero" aria-labelledby="hero-title">
      {/* 1. Background Photo Stage */}
      <div ref={photoWrapperRef} className="hero-photo-wrapper">
        <SceneImage
          assetKey={isDesktop ? 'heroWorld' : 'heroWorldPortrait'}
          priority={true}
          objectPosition="center 40%"
          sizes="100vw"
          className="hero-scene-image"
        />
      </div>

      {/* 2. Layer Scrims */}
      <div className="hero-scrim-left" aria-hidden="true" />
      <div className="hero-scrim-bottom" aria-hidden="true" />
      <div className="hero-ember-glow" aria-hidden="true" />

      {/* 3. Main Hero Content Over Scrims */}
      <Container className="hero-container">
        <div className="hero-content-block">
          {/* H1 Headline */}
          <h1 id="hero-title" className="display-1 hero-heading">
            <SplitWords text="A world that" />{' '}
            <em className="hero-italic">
              <SplitWords text={copy.hero.italic} />
            </em>
            <Ember className="hero-ember-period" />
          </h1>

          {/* Subtitle */}
          <p className="lead hero-sub">{copy.hero.sub}</p>

          {/* Action Buttons */}
          <div className="hero-actions-row">
            <Button
              variant="primary"
              href={copy.hero.primary.href}
              onClick={(e) => handleActionClick(e, copy.hero.primary.href)}
              className="hero-btn-primary"
            >
              {copy.hero.primary.label}
            </Button>
            <Button
              variant="secondary"
              href={copy.hero.secondary.href}
              onClick={(e) => handleActionClick(e, copy.hero.secondary.href)}
              className="hero-btn-secondary"
            >
              {copy.hero.secondary.label}
            </Button>
          </div>

          {/* Status with "now" dot */}
          <div className="hero-status-row">
            <Chip variant="outline" dot="now" className="hero-status-chip">
              {copy.hero.status}
            </Chip>
          </div>
        </div>

        {/* 4. Four Glance Cells across the bottom */}
        <RevealGroup className="hero-glance-grid">
          {copy.hero.glance.map((item, idx) => (
            <Reveal
              key={item.k}
              reveal="up"
              delay={((idx % 4) + 1) as 1 | 2 | 3 | 4}
              className="glance-cell-wrap"
            >
              <Glass
                tone={idx === 0 ? 'inverse' : 'dark'}
                radius="md"
                className="glance-cell"
              >
                <span className="glance-key label">{item.k}</span>
                <span className="glance-val">{item.v}</span>
              </Glass>
            </Reveal>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
};
