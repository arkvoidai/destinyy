import React, { createContext, useContext, useRef, useEffect, useState, useMemo } from 'react';
import { observe, unobserve } from '../lib/motion';

export interface RevealGroupContextValue {
  isInView: boolean;
  getNextIndex: () => number;
}

export const RevealGroupContext = createContext<RevealGroupContextValue | null>(null);

export interface RevealGroupProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  staggerMs?: number;
  children: React.ReactNode;
}

export const RevealGroup: React.FC<RevealGroupProps> = ({
  as: Component = 'div',
  className = '',
  threshold = 0.15,
  rootMargin = '0px 0px -8% 0px',
  staggerMs,
  children,
  style,
  ...rest
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const indexCounterRef = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Elements already scrolled above the viewport are immediately visible
    const rect = el.getBoundingClientRect();
    if (rect.bottom < 0) {
      setIsInView(true);
      return;
    }

    const handleIntersect = (entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        unobserve(el);
      }
    };

    observe(el, handleIntersect, { threshold, rootMargin });

    // Handle back/forward cache restore
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setIsInView(true);
        unobserve(el);
      }
    };

    window.addEventListener('pageshow', handlePageShow);

    return () => {
      unobserve(el);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [threshold, rootMargin]);

  const contextValue = useMemo<RevealGroupContextValue>(() => ({
    isInView,
    getNextIndex: () => {
      indexCounterRef.current += 1;
      return indexCounterRef.current;
    },
  }), [isInView]);

  // Reset counter on each render so children get stable sequential indices
  indexCounterRef.current = 0;

  return (
    <RevealGroupContext.Provider value={contextValue}>
      <Component
        ref={containerRef}
        className={`ark-reveal-group ${isInView ? 'is-in-view' : ''} ${className}`.trim()}
        style={{
          ...(staggerMs ? { ['--stagger' as string]: `${staggerMs}ms` } : {}),
          ...style,
        }}
        {...rest}
      >
        {children}
      </Component>
    </RevealGroupContext.Provider>
  );
};

export function useRevealGroupContext() {
  return useContext(RevealGroupContext);
}
