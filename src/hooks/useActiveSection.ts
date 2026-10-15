import { useState, useEffect } from 'react';
import { observe, unobserve } from '../lib/motion';

export function useActiveSection(ids: string[]): string {
  const [activeId, setActiveId] = useState<string>(ids[0] || '');

  useEffect(() => {
    if (typeof document === 'undefined' || ids.length === 0) return;

    const elements: HTMLElement[] = [];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) elements.push(el);
    }

    const handleIntersect = (entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        setActiveId(entry.target.id);
      }
    };

    const options: IntersectionObserverInit = {
      rootMargin: '-45% 0px -50% 0px',
      threshold: 0,
    };

    for (const el of elements) {
      observe(el, handleIntersect, options);
    }

    return () => {
      for (const el of elements) {
        unobserve(el);
      }
    };
  }, [ids]);

  return activeId;
}
