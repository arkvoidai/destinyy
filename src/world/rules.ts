/**
 * Prototype World Rule Engine
 * Preserved byte for byte for Stage 7
 */

import type { ActionProposal, RuleCheckResult, WorldState } from './types';

export function evaluateRule(
  proposal: ActionProposal,
  state: WorldState
): RuleCheckResult {
  const actor = state.inhabitants.find((inh) => inh.id === proposal.actorId);
  if (!actor) {
    return {
      valid: false,
      reason: 'Unknown inhabitant identity.',
    };
  }

  // World physics and authorization laws
  if (proposal.action.includes('without fuel') || proposal.action.includes('unauthorized')) {
    return {
      valid: false,
      reason: 'Physical law check failed: resources or fuel unavailable.',
    };
  }

  return {
    valid: true,
    reason: `Verified valid for ${actor.name} under current world state.`,
  };
}

export const worldRules = {
  evaluateRule,
};
