import React, { useRef, useEffect, useState } from 'react';
import { observe, unobserve } from '../lib/motion';
import './SplitWords.css';

export interface SplitWordsProps {
  text: string;
  as?: React.ElementType;
  stagger?: number;
  startDelay?: number;
  immediate?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const SplitWords: React.FC<SplitWordsProps> = ({
  text,
  as: Component = 'span',
  stagger = 45,
  startDelay = 0,
  immediate = false,
  className = '',
  style,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(immediate);

  const words = text.split(/\s+/).filter(Boolean);

  useEffect(() => {
    if (immediate) return;

    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (rect.top <= window.innerHeight) {
      setIsVisible(true);
      return;
    }

    observe(
      el,
      (entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          unobserve(el);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -8% 0px',
      }
    );

    return () => unobserve(el);
  }, [immediate]);

  // Dev invariant: normalized textContent must equal original text
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && containerRef.current) {
      const rendered = (containerRef.current.textContent || '')
        .replace(/\s+/g, ' ')
        .trim();
      const expected = text.replace(/\s+/g, ' ').trim();
      if (rendered !== expected) {
        console.error(
          `[SplitWords] Invariant failed: rendered "${rendered}" !== expected "${expected}"`
        );
      }
    }
  }, [text]);

  return (
    <Component
      ref={containerRef}
      aria-label={text}
      className={`split-words-wrapper ${isVisible ? 'is-visible' : ''} ${className}`.trim()}
      style={style}
    >
      <span aria-hidden="true" className="split-words-inner">
        {words.map((word, index) => {
          const delay = startDelay + index * stagger;
          return (
            <React.Fragment key={`${word}-${index}`}>
              <span className="word-mask">
                <span
                  className="word-rise"
                  style={{
                    transitionDelay: `calc(${delay}ms * var(--motion-scale))`,
                  }}
                >
                  {word}
                </span>
              </span>
              {index < words.length - 1 && ' '}
            </React.Fragment>
          );
        })}
      </span>
    </Component>
  );
};
