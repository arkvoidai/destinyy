import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Icon, type IconName } from '../Icon';
import { useActiveSection } from '../../hooks/useActiveSection';
import { easeScrollTo } from '../../lib/motion';
import './Dock.css';

const DOCK_ITEMS: Array<{ id: string; label: string; href: string; icon: IconName }> = [
  { id: 'world', label: 'The World', href: '#world', icon: 'world' },
  { id: 'people', label: 'The People', href: '#people', icon: 'eye' },
  { id: 'prototype', label: 'The Demo', href: '#prototype', icon: 'door' },
  { id: 'engine', label: 'The Engine', href: '#engine', icon: 'layers' },
];

const DOCK_IDS = DOCK_ITEMS.map((d) => d.id);

export interface DockProps {
  isMenuOpen: boolean;
}

export const Dock: React.FC<DockProps> = ({ isMenuOpen }) => {
  const activeId = useActiveSection(DOCK_IDS);
  const activeHref = `#${activeId}`;

  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [indicator, setIndicator] = useState<{ left: number; width: number; ready: boolean }>({
    left: 0,
    width: 0,
    ready: false,
  });

  const updateIndicator = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;

    const activeEl = itemRefs.current.get(activeHref) || itemRefs.current.get('#world');
    if (!activeEl) return;

    const navRect = nav.getBoundingClientRect();
    const itemRect = activeEl.getBoundingClientRect();

    setIndicator({
      left: itemRect.left - navRect.left,
      width: itemRect.width,
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

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    easeScrollTo(href);
  };

  return (
    <nav
      ref={navRef}
      className={`ark-dock ${isMenuOpen ? 'is-hidden' : ''}`}
      aria-label="Sections"
    >
      <div className="dock-pill">
        {DOCK_ITEMS.map((item) => {
          const isActive = activeHref === item.href;
          return (
            <a
              key={item.href}
              ref={(el) => {
                if (el) itemRefs.current.set(item.href, el);
                else itemRefs.current.delete(item.href);
              }}
              href={item.href}
              className={`dock-item ${isActive ? 'is-active' : ''}`}
              onClick={(e) => handleClick(e, item.href)}
              aria-current={isActive ? 'true' : undefined}
            >
              <span className="dock-icon-wrap" aria-hidden="true">
                <Icon name={item.icon} size={20} />
              </span>
              <span className="dock-label">{item.label}</span>
            </a>
          );
        })}

        {indicator.ready && (
          <div
            className="dock-indicator"
            style={{
              transform: `translateX(${indicator.left}px) scaleX(${indicator.width})`,
            }}
            aria-hidden="true"
          />
        )}
      </div>
    </nav>
  );
};
