/**
 * Prototype World Derived Memory
 * Preserved byte for byte for Stage 7
 * Memory is strictly derived from the permanent record.
 */

import type { WorldEvent } from './types';

export interface DerivedMemory {
  actorId: string;
  summary: string;
  eventId: string;
}

export function deriveMemories(events: WorldEvent[]): DerivedMemory[] {
  return events
    .filter((event) => event.valid)
    .map((event) => ({
      actorId: event.actorId,
      summary: `Remembered: ${event.action} (${event.detail})`,
      eventId: event.id,
    }));
}

export function queryInhabitantMemory(
  actorId: string,
  events: WorldEvent[]
): DerivedMemory[] {
  return deriveMemories(events).filter((m) => m.actorId === actorId);
}
