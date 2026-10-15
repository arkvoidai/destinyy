/**
 * Prototype World Local Storage Persistence
 * Preserved byte for byte for Stage 7
 */

import type { WorldState } from './types';
import { initialWorldState } from './state';

const STORAGE_KEY = 'arkvoid.world.state.v1';

export function loadWorldState(): WorldState {
  if (typeof window === 'undefined') {
    return initialWorldState;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialWorldState;
    return JSON.parse(raw) as WorldState;
  } catch {
    return initialWorldState;
  }
}

export function saveWorldState(state: WorldState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota or disabled errors
  }
}
