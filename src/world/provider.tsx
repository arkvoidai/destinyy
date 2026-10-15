/**
 * Prototype World Context & Provider
 * Preserved byte for byte for Stage 7
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { WorldState, ActionProposal, WorldEvent } from './types';
import { initialWorldState, worldReducer } from './state';
import { loadWorldState, saveWorldState } from './storage';
import { evaluateRule } from './rules';

export interface WorldContextValue {
  state: WorldState;
  proposeAction: (proposal: ActionProposal) => { valid: boolean; event?: WorldEvent; reason: string };
  tick: () => void;
}

export const WorldContext = createContext<WorldContextValue | null>(null);

export function WorldProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(worldReducer, initialWorldState, () => loadWorldState());

  useEffect(() => {
    saveWorldState(state);
  }, [state]);

  const proposeAction = (proposal: ActionProposal) => {
    const check = evaluateRule(proposal, state);
    if (!check.valid) {
      return { valid: false, reason: check.reason };
    }

    const newEvent: WorldEvent = {
      id: `event-${Date.now()}`,
      timestamp: state.clock,
      actorId: proposal.actorId,
      action: proposal.action,
      valid: true,
      ruleVerified: check.reason,
      detail: proposal.intent,
    };

    dispatch({ type: 'COMMIT_EVENT', event: newEvent });
    return { valid: true, event: newEvent, reason: check.reason };
  };

  const tick = () => {
    dispatch({ type: 'TICK_CLOCK' });
  };

  return (
    <WorldContext.Provider value={{ state, proposeAction, tick }}>
      {children}
    </WorldContext.Provider>
  );
}

export function useWorldContext(): WorldContextValue {
  const ctx = useContext(WorldContext);
  if (!ctx) {
    throw new Error('useWorldContext must be used within a WorldProvider');
  }
  return ctx;
}
