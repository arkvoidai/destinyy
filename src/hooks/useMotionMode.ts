import { useState, useEffect } from 'react';

export type MotionMode = 'full' | 'lite' | 'none';

export function useMotionMode(): MotionMode {
  const [mode, setMode] = useState<MotionMode>(() => {
    if (typeof document === 'undefined') return 'full';
    const attr = document.documentElement.getAttribute('data-motion');
    if (attr === 'lite' || attr === 'none') return attr;
    return 'full';
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const updateMode = () => {
      const attr = document.documentElement.getAttribute('data-motion');
      if (attr === 'lite' || attr === 'none') {
        setMode(attr);
      } else {
        setMode('full');
      }
    };

    updateMode();

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'data-motion') {
          updateMode();
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-motion'],
    });

    return () => observer.disconnect();
  }, []);

  return mode;
}
