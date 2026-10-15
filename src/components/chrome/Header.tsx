import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LogoLockup } from '../brand/Logo';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { copy } from '../../data/copy';
import { easeScrollTo } from '../../lib/motion';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useBrief } from '../../context/BriefContext';
import './Header.css';

const SECTION_IDS = ['world', 'people', 'prototype', 'engine', 'device', 'plan'];

export interface HeaderProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isMenuOpen, onToggleMenu }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [shouldDrawLogo, setShouldDrawLogo] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);

  const { openBrief } = useBrief();
  const activeSectionId = useActiveSection(SECTION_IDS);

  // Logo draw once per session when motion is full
  useEffect(() => {
    try {
      const drawn = window.sessionStorage.getItem('arkvoid.logo_drawn');
      const motion = document.documentElement.getAttribute('data-motion');
      if (!drawn && motion === 'full') {
        setShouldDrawLogo(true);
        window.sessionStorage.setItem('arkvoid.logo_drawn', '1');
      }
    } catch {
      // Storage access blocked
    }
  }, []);

  // Top sentinel observer to detect 24px of scroll without scroll listeners
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const sentinel = document.getElementById('header-top-sentinel');
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Nav indicator measurement & sliding
  const navListRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [indicator, setIndicator] = useState<{ left: number; width: number; ready: boolean }>({
    left: 0,
    width: 0,
    ready: false,
  });

  const activeHref = hoveredHref || `#${activeSectionId}`;

  const updateIndicator = useCallback(() => {
    const list = navListRef.current;
    if (!list) return;

    const targetLink = linkRefs.current.get(activeHref);
    if (!targetLink) {
      setIndicator((prev) => ({ ...prev, ready: false }));
      return;
    }

    const listRect = list.getBoundingClientRect();
    const linkRect = targetLink.getBoundingClientRect();

    setIndicator({
      left: linkRect.left - listRect.left,
      width: linkRect.width,
      ready: true,
    });
  }, [activeHref]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);

    if (document.fonts) {
      document.fonts.ready.then(updateIndicator);
    }

    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    easeScrollTo(href);
  };

  return (
    <header className={`ark-header ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="header-inner">
        {/* Left: LogoLockup */}
        <a
          href="#top"
          className="header-brand"
          onClick={(e) => handleNavClick(e, '#top')}
          aria-label={copy.hero.eyebrow}
        >
          <LogoLockup size={30} draw={shouldDrawLogo} />
        </a>

        {/* Desktop Center: Six nav links inside glass pill with sliding indicator */}
        <nav className="desktop-nav" aria-label={copy.ui.sectionNavigation}>
          <ul
            ref={navListRef}
            className="nav-pill-list"
            onMouseLeave={() => setHoveredHref(null)}
          >
            {copy.nav.links.map((link) => {
              const isActive = activeSectionId === link.href.replace('#', '');
              return (
                <li key={link.href} className="nav-item">
                  <a
                    ref={(el) => {
                      if (el) linkRefs.current.set(link.href, el);
                      else linkRefs.current.delete(link.href);
                    }}
                    href={link.href}
                    className={`nav-link ${isActive ? 'is-active' : ''}`}
                    onClick={(e) => handleNavClick(e, link.href)}
                    onMouseEnter={() => setHoveredHref(link.href)}
                    onFocus={() => setHoveredHref(link.href)}
                    onBlur={() => setHoveredHref(null)}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}

            {indicator.ready && (
              <div
                className="nav-indicator"
                style={{
                  transform: `translateX(${indicator.left}px) scaleX(${indicator.width})`,
                }}
                aria-hidden="true"
              />
            )}
          </ul>
        </nav>

        {/* Desktop Right: Brief quiet button & Enter demo pill */}
        <div className="desktop-actions">
          <Button
            variant="quiet"
            onClick={openBrief}
            className="header-brief-btn"
          >
            {copy.nav.brief}
          </Button>
          <Button
            variant="primary"
            href={copy.nav.cta.href}
            onClick={(e) => handleNavClick(e as unknown as React.MouseEvent<HTMLAnchorElement>, copy.nav.cta.href)}
            className="header-cta-btn"
          >
            {copy.nav.cta.label}
          </Button>
        </div>

        {/* Mobile Right: Brief Icon Button & Morphing Menu Button */}
        <div className="mobile-actions">
          <button
            type="button"
            className="mobile-icon-btn glass-btn"
            onClick={openBrief}
            aria-label={copy.nav.brief}
          >
            <Icon name="scroll" size={20} />
          </button>

          <button
            type="button"
            className={`mobile-icon-btn glass-btn menu-toggle-btn ${isMenuOpen ? 'is-open' : ''}`}
            onClick={onToggleMenu}
            aria-label={isMenuOpen ? copy.nav.menuClose : copy.nav.menuOpen}
            aria-expanded={isMenuOpen}
          >
            <span className="menu-bar menu-bar-top" />
            <span className="menu-bar menu-bar-mid" />
            <span className="menu-bar menu-bar-bot" />
          </button>
        </div>
      </div>
    </header>
  );
};
