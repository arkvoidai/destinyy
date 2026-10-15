import React, { useState, useRef } from 'react';
import { Container } from '../components/Container';
import { Icon } from '../components/Icon';
import { GhostText } from '../components/GhostText';
import { Reveal } from '../components/Reveal';
import { RevealGroup } from '../components/RevealGroup';
import { copy } from '../data/copy';
import { useBrief } from '../context/BriefContext';
import { easeScrollTo } from '../lib/motion';
import './Finale.css';

export const Finale: React.FC = () => {
  const { openBrief } = useBrief();
  const [copied, setCopied] = useState(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDemoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    easeScrollTo('#prototype');
  };

  const handleCopyEmail = async () => {
    const text = copy.finale.email;
    let succeeded = false;

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        succeeded = true;
      } catch {
        succeeded = false;
      }
    }

    if (!succeeded) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        succeeded = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        succeeded = false;
      }
    }

    if (succeeded) {
      setCopied(true);
      setLiveAnnouncement(copy.ui.emailCopied);

      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }

      copyTimerRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <section
      id="finale"
      data-theme="void"
      className="ark-finale"
      aria-labelledby="finale-heading"
    >
      <Container className="finale-container">
        {/* The Massive Solid Ember Panel */}
        <Reveal reveal="up" delay={1} className="finale-ember-panel">
          <div className="finale-panel-content">
            <h2 id="finale-heading" className="finale-heading display-1">
              {copy.finale.h2}
              <span className="finale-black-period">.</span>
            </h2>

            <p className="finale-body">{copy.finale.body}</p>

            <div className="finale-actions-row">
              {/* 1. Black pill with --gas text */}
              <a
                href={copy.finale.primary.href}
                onClick={handleDemoClick}
                className="finale-btn-demo"
              >
                {copy.finale.primary.label}
              </a>

              {/* 2. Outlined black pill */}
              <a
                href={copy.finale.secondary.href}
                target="_blank"
                rel="noopener noreferrer"
                className="finale-btn-x"
              >
                <span>{copy.finale.secondary.label}</span>
                <Icon name="arrow-up-right" size={14} />
              </a>

              {/* 3. Quiet text button to open 60-second brief */}
              <button
                type="button"
                onClick={openBrief}
                className="finale-btn-brief"
              >
                {copy.nav.brief}
              </button>
            </div>
          </div>

          {/* GhostText "Arkvoid" in black at 14% clipped in panel's lower edge */}
          <div className="finale-ghost-wrap" aria-hidden="true">
            <GhostText text="Arkvoid" />
          </div>
        </Reveal>

        {/* Sub-bar in the black area: email mailto & Copy email button */}
        <RevealGroup className="finale-subbar">
          <Reveal reveal="fade" delay={2}>
            <a
              href={`mailto:${copy.finale.email}`}
              className="finale-subbar-email-link"
            >
              <Icon name="mail" size={16} />
              <span>{copy.finale.email}</span>
            </a>
          </Reveal>

          <Reveal reveal="fade" delay={3}>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="finale-copy-btn"
              aria-label={copy.ui.copyEmail}
            >
              <Icon name={copied ? 'check' : 'copy'} size={14} />
              <span className={`finale-copy-label ${copied ? 'is-copied' : ''}`}>
                {copied ? copy.finale.copied : copy.finale.copy}
              </span>
            </button>
          </Reveal>
        </RevealGroup>

        {/* Live region announcement for screen readers */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="finale-sr-live"
        >
          {liveAnnouncement}
        </div>
      </Container>
    </section>
  );
};
