import React, { useEffect, useRef } from 'react';
import { copy } from '../../data/copy';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { easeScrollTo } from '../../lib/motion';
import './MobileMenu.css';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  triggerRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll lock and focus restoration
  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (isOpen) {
      document.documentElement.classList.add('has-mobile-menu-open');

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        } else if (e.key === 'Tab') {
          const container = containerRef.current;
          if (!container) return;
          const focusables = container.querySelectorAll<HTMLElement>(
            'a, button, [tabindex]:not([tabindex="-1"])'
          );
          if (focusables.length === 0) return;

          const first = focusables[0];
          const last = focusables[focusables.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      const timer = setTimeout(() => {
        const firstLink = containerRef.current?.querySelector<HTMLElement>('a');
        firstLink?.focus();
      }, 30);

      return () => {
        clearTimeout(timer);
        document.documentElement.classList.remove('has-mobile-menu-open');
        window.removeEventListener('keydown', handleKeyDown);
        if (triggerRef?.current) {
          triggerRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onClose();
    easeScrollTo(href);
  };

  return (
    <div
      ref={containerRef}
      className="ark-mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label={copy.ui.menuTitle}
    >
      <div className="menu-ember-glow" aria-hidden="true" />

      <div className="mobile-menu-scrollable">
        <nav className="mobile-menu-nav">
          <ul className="mobile-link-list">
            {copy.nav.links.map((link, index) => (
              <li
                key={link.href}
                className="mobile-link-item"
                style={{
                  animationDelay: `${40 + index * 40}ms`,
                }}
              >
                <a
                  href={link.href}
                  className="mobile-nav-link"
                  onClick={(e) => handleLinkClick(e, link.href)}
                >
                  <span className="mobile-link-text">{link.label}</span>
                  <Icon name="arrow-up-right" size={24} className="mobile-link-icon" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mobile-menu-footer">
          <Button
            variant="primary"
            href={copy.nav.cta.href}
            onClick={(e) =>
              handleLinkClick(e as unknown as React.MouseEvent<HTMLAnchorElement>, copy.nav.cta.href)
            }
            className="mobile-cta-btn"
          >
            {copy.nav.cta.label}
          </Button>

          <a href={`mailto:${copy.finale.email}`} className="mobile-email-link">
            {copy.finale.email}
          </a>
        </div>
      </div>
    </div>
  );
};
