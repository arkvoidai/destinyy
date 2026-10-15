import { useState } from 'react';
import { loadWorldState } from '../world/storage';

export interface VisitorRecord {
  first: number;
  last: number;
  visits: number;
}

export interface VisitorInfo {
  isReturning: boolean;
  sinceText: string;
  visits: number;
  entryCount: number;
}

const STORAGE_KEY = 'arkvoid.visit.v1';
const SESSION_KEY = 'arkvoid.session';

function formatSince(previousLast: number, now: number): string {
  try {
    const diffMs = now - previousLast;
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));

    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    if (diffDays >= 1) {
      return rtf.format(-diffDays, 'day');
    }
    if (diffHours >= 1) {
      return rtf.format(-diffHours, 'hour');
    }
    return 'earlier today';
  } catch {
    return 'earlier today';
  }
}

export function getVisitor(): VisitorInfo {
  const fallback: VisitorInfo = {
    isReturning: false,
    sinceText: '',
    visits: 1,
    entryCount: 0,
  };

  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    // 1. Read-only entry count from local prototype world state
    let entryCount = 0;
    try {
      const world = loadWorldState();
      entryCount = Array.isArray(world.events) ? world.events.length : 0;
    } catch {
      entryCount = 0;
    }

    const now = Date.now();
    let record: VisitorRecord | null = null;
    let previousLast: number | null = null;

    // 2. Read stored visitor record
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        record = JSON.parse(raw) as VisitorRecord;
      }
    } catch {
      record = null;
    }

    // 3. Check session flag
    let isNewSession = false;
    try {
      const hasSession = window.sessionStorage.getItem(SESSION_KEY);
      if (!hasSession) {
        isNewSession = true;
        window.sessionStorage.setItem(SESSION_KEY, '1');
      }
    } catch {
      // Storage access blocked; proceed safely
    }

    if (isNewSession) {
      if (record && typeof record.last === 'number') {
        previousLast = record.last;
        record = {
          first: record.first || now,
          last: now,
          visits: (record.visits || 0) + 1,
        };
      } else {
        record = {
          first: now,
          last: now,
          visits: 1,
        };
      }

      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
      } catch {
        // Ignore quota/disabled error
      }
    } else if (record && typeof record.last === 'number') {
      previousLast = record.last;
    }

    const THIRTY_MINUTES = 30 * 60 * 1000;
    const isReturning =
      previousLast !== null && now - previousLast > THIRTY_MINUTES;
    const sinceText =
      isReturning && previousLast !== null ? formatSince(previousLast, now) : '';

    return {
      isReturning,
      sinceText,
      visits: record ? record.visits : 1,
      entryCount,
    };
  } catch {
    return fallback;
  }
}

/**
 * useVisitor hook
 * Computes visitor memory once using a lazy useState initializer,
 * ensuring React StrictMode double-render never double-increments visits.
 */
export function useVisitor(): VisitorInfo {
  const [visitor] = useState<VisitorInfo>(() => getVisitor());
  return visitor;
}
