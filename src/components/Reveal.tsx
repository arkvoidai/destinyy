import React, { useRef, useEffect, useContext, useState } from 'react';
import { observe, unobserve } from '../lib/motion';
import { RevealGroupContext } from './RevealGroup';
import './Reveal.css';

export type RevealPreset = 'up' | 'fade' | 'rise-s' | 'line' | 'image';
export type RevealDelay = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  reveal?: RevealPreset;
  delay?: RevealDelay;
  className?: string;
  children?: React.ReactNode;
}

export const Reveal: React.FC<RevealProps> = ({
  as: Component = 'div',
  reveal = 'up',
  delay,
  className = '',
  children,
  ...rest
}) => {
  const ref = useRef<HTMLElement>(null);
  const group = useContext(RevealGroupContext);

  // Auto-assigned delay from parent RevealGroup if not explicitly provided
  const [autoDelay] = useState<RevealDelay | undefined>(() => {
    if (delay !== undefined) return delay;
    if (group) {
      const idx = group.getNextIndex();
      return Math.min(Math.max(idx, 1), 12) as RevealDelay;
    }
    return undefined;
  });

  const effectiveDelay = delay ?? autoDelay;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Elements already scrolled past above the viewport become visible immediately
    const rect = el.getBoundingClientRect();
    if (rect.bottom < 0) {
      el.classList.add('is-visible');
      return;
    }

    // If part of a RevealGroup, trigger when group becomes visible
    if (group) {
      if (group.isInView) {
        el.classList.add('is-visible');
      }
      return;
    }

    // Standalone reveal: observe with IntersectionObserver
    const handleIntersect = (entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        el.classList.add('is-visible');
        unobserve(el);
      }
    };

    observe(el, handleIntersect, {
      threshold: 0.15,
      rootMargin: '0px 0px -8% 0px',
    });

    // Handle back/forward cache restore
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        el.classList.add('is-visible');
        unobserve(el);
      }
    };

    window.addEventListener('pageshow', handlePageShow);

    return () => {
      unobserve(el);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [group, group?.isInView]);

  return (
    <Component
      ref={ref}
      data-reveal={reveal}
      data-reveal-delay={effectiveDelay}
      className={`ark-reveal ${className}`.trim()}
      {...rest}
    >
      {children}
    </Component>
  );
};
