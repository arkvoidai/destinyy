import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Container } from '../components/Container';
import { Chip } from '../components/Chip';
import { Heading } from '../components/Heading';
import { Glass } from '../components/Glass';
import { SceneImage } from '../components/SceneImage';
import { Reveal } from '../components/Reveal';
import { RevealGroup } from '../components/RevealGroup';
import { copy } from '../data/copy';
import { ASSETS } from '../data/assets';
import { createIdleLoop } from '../lib/motion';
import './Device.css';

export const Device: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [isPeeking, setIsPeeking] = useState(false);
  const [supportsClipCircle, setSupportsClipCircle] = useState(true);
  const [conceptExists, setConceptExists] = useState(false);

  const frameRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cachedRectRef = useRef<DOMRect | null>(null);
  const targetPointRef = useRef<{ x: number; y: number } | null>(null);
  const currentPointRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const stopLoopRef = useRef<(() => void) | null>(null);

  // 1. Detect clip-path circle support
  useEffect(() => {
    if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function') {
      const supported =
        CSS.supports('clip-path', 'circle(50% at 50% 50%)') ||
        CSS.supports('-webkit-clip-path', 'circle(50% at 50% 50%)');
      setSupportsClipCircle(supported);
    }
  }, []);

  // 2. Check if eyewearConcept photo exists (renders NOTHING if missing)
  useEffect(() => {
    const src = ASSETS.eyewearConcept?.src;
    if (!src) return;
    const img = new Image();
    img.src = src;
    img.onload = () => {
      if (img.naturalWidth > 0) setConceptExists(true);
    };
    img.onerror = () => {
      setConceptExists(false);
    };
  }, []);

  // 3. Cache frame rectangle on mount and resize (zero layout reads in the loop)
  const updateCachedRect = useCallback(() => {
    if (frameRef.current) {
      cachedRectRef.current = frameRef.current.getBoundingClientRect();
    }
  }, []);

  useEffect(() => {
    updateCachedRect();
    window.addEventListener('resize', updateCachedRect, { passive: true });
    return () => {
      window.removeEventListener('resize', updateCachedRect);
    };
  }, [updateCachedRect]);

  // 4. Desktop Fine Pointer Peek (motion full only)
  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    if (isOpen) return;

    const motionMode = document.documentElement.getAttribute('data-motion');
    const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (motionMode === 'none' || motionMode === 'lite' || !isFine) return;

    updateCachedRect();
    const rect = cachedRectRef.current;
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    targetPointRef.current = { x, y };
    currentPointRef.current = { x, y };

    if (frameRef.current) {
      frameRef.current.style.setProperty('--lx', `${x.toFixed(1)}px`);
      frameRef.current.style.setProperty('--ly', `${y.toFixed(1)}px`);
    }

    setIsPeeking(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPeeking || isOpen) return;
    const rect = cachedRectRef.current;
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    targetPointRef.current = { x, y };

    // Start idle loop if not already running
    if (!stopLoopRef.current) {
      stopLoopRef.current = createIdleLoop(() => {
        const target = targetPointRef.current;
        const frame = frameRef.current;
        if (!target || !frame) return false;

        const current = currentPointRef.current;
        const dx = target.x - current.x;
        const dy = target.y - current.y;

        // If close enough, snap and stop loop
        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
          current.x = target.x;
          current.y = target.y;
          frame.style.setProperty('--lx', `${current.x.toFixed(1)}px`);
          frame.style.setProperty('--ly', `${current.y.toFixed(1)}px`);
          stopLoopRef.current = null;
          return false;
        }

        current.x += dx * 0.2;
        current.y += dy * 0.2;
        frame.style.setProperty('--lx', `${current.x.toFixed(1)}px`);
        frame.style.setProperty('--ly', `${current.y.toFixed(1)}px`);
        return true;
      });
    }
  };

  const handlePointerLeave = () => {
    setIsPeeking(false);
    targetPointRef.current = null;
    if (stopLoopRef.current) {
      stopLoopRef.current();
      stopLoopRef.current = null;
    }
  };

  // 5. Button Press: sets origin to button center, toggles open/closed
  const handleToggle = () => {
    const btn = buttonRef.current;
    const frame = frameRef.current;

    if (btn && frame) {
      const bRect = btn.getBoundingClientRect();
      const fRect = frame.getBoundingClientRect();
      const cx = bRect.left + bRect.width / 2 - fRect.left;
      const cy = bRect.top + bRect.height / 2 - fRect.top;
      frame.style.setProperty('--lx', `${cx.toFixed(1)}px`);
      frame.style.setProperty('--ly', `${cy.toFixed(1)}px`);
    }

    const nextState = !isOpen;
    setIsOpen(nextState);
    setIsPeeking(false);

    // Stop peek loop when toggled
    if (stopLoopRef.current) {
      stopLoopRef.current();
      stopLoopRef.current = null;
    }

    // Live region announcement
    setAnnouncement(
      nextState ? 'Showing the Arkvoid world' : 'Showing today'
    );

    // Retain focus on the button
    btn?.focus();
  };

  return (
    <section
      id="device"
      data-theme="void"
      className="ark-device"
      aria-labelledby="device-heading"
    >
      <Container className="device-header-container">
        <RevealGroup className="device-header-block">
          <Reveal reveal="fade" delay={1}>
            <Chip variant="outline" className="device-label-chip">
              {copy.device.label}
            </Chip>
          </Reveal>
          <Reveal reveal="up" delay={2}>
            <Heading
              level={2}
              id="device-heading"
              text={copy.device.h2}
              ember={true}
              className="display-2 device-title"
            />
          </Reveal>
          <Reveal reveal="up" delay={3}>
            <p className="lead device-body">{copy.device.body}</p>
          </Reveal>
        </RevealGroup>
      </Container>

      <Container className="device-stage-container">
        <div className="device-split-layout">
          {/* LEFT: THE LENS */}
          <Reveal reveal="image" delay={2} className="lens-outer-wrap">
            <div
              ref={frameRef}
              className={`lens-frame ${isOpen ? 'is-open' : ''} ${
                isPeeking ? 'is-peeking' : ''
              } ${!supportsClipCircle ? 'no-clip-support' : ''}`}
              onPointerEnter={handlePointerEnter}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
            >
              {/* Corner Chip swapping: Without Arkvoid <-> With Arkvoid */}
              <div className="lens-corner-chip-wrap" aria-hidden="true">
                <span className="chip lens-corner-chip">
                  {isOpen ? copy.device.lensB : copy.device.lensA}
                </span>
              </div>

              {/* Base Layer: deviceToday */}
              <div className="lens-base-layer">
                <SceneImage
                  assetKey="deviceToday"
                  hideLabel={true}
                  sizes="(min-width: 1200px) 65vw, 100vw"
                />
              </div>

              {/* Top Layer: deviceWorld */}
              <div
                className="lens-world-layer"
                aria-hidden={!isOpen}
              >
                <SceneImage
                  assetKey="deviceWorld"
                  hideLabel={true}
                  sizes="(min-width: 1200px) 65vw, 100vw"
                />
              </div>

              {/* Bottom Centre Pill Action Button */}
              <div className="lens-action-container">
                <button
                  ref={buttonRef}
                  type="button"
                  aria-pressed={isOpen}
                  onClick={handleToggle}
                  className={`lens-toggle-btn ${isOpen ? 'is-active' : ''}`}
                >
                  <span className="lens-toggle-dot" aria-hidden="true" />
                  <span>{isOpen ? copy.device.lensActive : copy.device.lensIdle}</span>
                </button>
              </div>

              {/* Visually hidden live region for screen reader announcements */}
              <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="lens-sr-live"
              >
                {announcement}
              </div>
            </div>
          </Reveal>

          {/* RIGHT: THE LADDER */}
          <div className="device-ladder-wrap">
            <div className="ladder-heading">
              <span className="label">The Interface Pathway</span>
            </div>

            <RevealGroup className="ladder-list">
              <div className="ladder-rail-line" aria-hidden="true" />

              {copy.device.ladder.map((row, idx) => {
                const isNow = row.s === 'Now';
                const chipDot = isNow ? 'now' : row.s === 'Next' ? 'next' : 'then';
                return (
                  <Reveal
                    key={row.t}
                    reveal="up"
                    delay={(idx + 1) as 1 | 2 | 3 | 4}
                  >
                    <Glass
                      tone={isNow ? 'inverse' : 'dark'}
                      className={`ladder-row-glass ${isNow ? 'is-lit' : ''}`}
                    >
                      <div className="ladder-row-left">
                        <span className="ladder-node-dot" aria-hidden="true" />
                        <div className="ladder-row-content">
                          <span className="ladder-row-title">{row.t}</span>
                          <span className="ladder-row-desc">{row.d}</span>
                        </div>
                      </div>
                      <Chip
                        variant={isNow ? 'solid' : 'outline'}
                        dot={chipDot}
                        className="ladder-chip"
                      >
                        {row.s}
                      </Chip>
                    </Glass>
                  </Reveal>
                );
              })}
            </RevealGroup>

            {/* Optional eyewearConcept: renders ONLY if photo exists, NOTHING otherwise */}
            {conceptExists && (
              <Reveal reveal="up" delay={5} className="device-concept-wrap">
                <Glass tone="dark" className="device-concept-glass">
                  <div className="concept-tag-overlay">
                    <Chip variant="glass">{copy.device.tag}</Chip>
                  </div>
                  <SceneImage
                    assetKey="eyewearConcept"
                    hideLabel={true}
                    className="device-concept-photo"
                  />
                </Glass>
              </Reveal>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};
