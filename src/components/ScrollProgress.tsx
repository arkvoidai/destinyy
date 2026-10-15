import React, { useEffect } from 'react';
import './ScrollProgress.css';

let hasScrollListener = false;

function initFallbackScrollProgress(): void {
  if (typeof window === 'undefined' || hasScrollListener) return;
  // If native scroll-driven animations are supported, do not attach scroll listener
  if (document.documentElement.classList.contains('sd')) return;

  hasScrollListener = true;
  let ticking = false;

  const update = () => {
    const totalHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress =
      totalHeight > 0
        ? Math.min(Math.max(window.scrollY / totalHeight, 0), 1)
        : 0;
    document.documentElement.style.setProperty('--p', progress.toFixed(4));
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );

  update();
}

export const ScrollProgress: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  useEffect(() => {
    initFallbackScrollProgress();
  }, []);

  return (
    <div
      className={`scroll-progress-track ${className}`.trim()}
      aria-hidden="true"
    >
      <div className="scroll-progress-bar" />
    </div>
  );
};
