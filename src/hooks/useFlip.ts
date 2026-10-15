import { useLayoutEffect, useRef } from 'react';

export function useFlip(
  containerRef: React.RefObject<HTMLElement | null>,
  key: unknown
): void {
  const prevRects = useRef<Map<Element, DOMRect>>(new Map());

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const container = containerRef.current;
    if (!container) return;

    const motionMode = document.documentElement.getAttribute('data-motion');
    if (motionMode === 'none') {
      prevRects.current.clear();
      return;
    }

    const children = Array.from(container.children);
    if (children.length > 30) {
      prevRects.current.clear();
      return;
    }

    // Skip if container is off-screen
    const containerRect = container.getBoundingClientRect();
    if (
      containerRect.bottom < 0 ||
      containerRect.top > window.innerHeight
    ) {
      prevRects.current.clear();
      return;
    }

    // Calculate delta and animate moved children
    for (const child of children) {
      const oldRect = prevRects.current.get(child);
      if (oldRect) {
        const newRect = child.getBoundingClientRect();
        const dx = oldRect.left - newRect.left;
        const dy = oldRect.top - newRect.top;

        if (dx !== 0 || dy !== 0) {
          child.animate(
            [
              { transform: `translate(${dx}px, ${dy}px)` },
              { transform: 'none' },
            ],
            {
              duration: 360,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              fill: 'none',
            }
          );
        }
      }
    }

    // Record new rects
    prevRects.current.clear();
    for (const child of children) {
      prevRects.current.set(child, child.getBoundingClientRect());
    }
  }, [containerRef, key]);
}
