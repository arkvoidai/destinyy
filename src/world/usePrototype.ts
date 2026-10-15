/**
 * Prototype World Engine Driving Hook
 * Preserved byte for byte for Stage 7
 */

import { useWorldContext } from './provider';
import { queryInhabitantMemory } from './memory';
import type { ActionProposal } from './types';

export function usePrototype() {
  const { state, proposeAction, tick } = useWorldContext();

  const getInhabitantMemories = (inhabitantId: string) => {
    return queryInhabitantMemory(inhabitantId, state.events);
  };

  const dispatchProposal = (proposal: ActionProposal) => {
    return proposeAction(proposal);
  };

  return {
    worldState: state,
    inhabitants: state.inhabitants,
    events: state.events,
    clock: state.clock,
    getInhabitantMemories,
    dispatchProposal,
    tick,
  };
}
