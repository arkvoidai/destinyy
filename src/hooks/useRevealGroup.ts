import { useMemo } from 'react';
import type { RevealDelay } from '../components/Reveal';

export function useRevealGroup(maxDelay: number = 12) {
  return useMemo(() => {
    return {
      getDelay: (index: number): RevealDelay => {
        const d = (index % maxDelay) + 1;
        return (d > 12 ? 12 : d) as RevealDelay;
      },
    };
  }, [maxDelay]);
}
