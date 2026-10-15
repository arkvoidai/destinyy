import React from 'react';
import { Container } from '../Container';
import { LogoLockup } from '../brand/Logo';
import { Icon } from '../Icon';
import { copy } from '../../data/copy';
import { siteConfig } from '../../config/site';
import { useBrief } from '../../context/BriefContext';
import { easeScrollTo } from '../../lib/motion';
import './Footer.css';

export const Footer: React.FC = () => {
  const { openBrief } = useBrief();

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    easeScrollTo(href);
  };

  const navColumn1 = [
    { label: 'The World', href: '#world' },
    { label: 'The People', href: '#people' },
    { label: 'The Demo', href: '#prototype' },
    { label: 'The Engine', href: '#engine' },
  ];

  const navColumn2 = [
    { label: 'The Device', href: '#device' },
    { label: 'The Plan', href: '#plan' },
    { label: 'Questions', href: '#faq' },
  ];

  return (
    <footer
      id="footer"
      data-theme="deep"
      className="ark-footer"
      role="contentinfo"
      aria-label="Site footer"
    >
      <Container className="footer-container">
        <div className="footer-top-grid">
          {/* Brand & Tagline */}
          <div className="footer-brand-col">
            <a
              href="#top"
              onClick={(e) => handleLinkClick(e, '#top')}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <LogoLockup size={32} />
            </a>
            <p className="footer-tagline">{copy.footer.tagline}</p>
          </div>

          {/* Navigation Links in 2 Columns */}
          <div className="footer-nav-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
              {navColumn1.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className="footer-nav-link"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
              {navColumn2.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className="footer-nav-link"
                >
                  {item.label}
                </a>
              ))}
              <button
                type="button"
                onClick={openBrief}
                className="footer-nav-link"
              >
                {copy.brief.title}
              </button>
            </div>
          </div>

          {/* Small Glass Pills for X and Email */}
          <div className="footer-social-col">
            <a
              href={siteConfig.xUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-pill-link"
            >
              <span>{siteConfig.xHandle}</span>
              <Icon name="arrow-up-right" size={13} />
            </a>

            <a
              href={`mailto:${siteConfig.email}`}
              className="footer-pill-link"
            >
              <Icon name="mail" size={13} />
              <span>{siteConfig.email}</span>
            </a>
          </div>
        </div>

        {/* Bottom Metadata: Legal, Images Note, Memory Note */}
        <div className="footer-bottom-row">
          <div className="footer-meta-line">
            <span className="footer-legal">{copy.footer.legal}</span>
            <span className="footer-images-note">{copy.footer.note}</span>
          </div>

          <p className="footer-memory-note">{copy.footer.memoryNote}</p>
        </div>
      </Container>
    </footer>
  );
};
