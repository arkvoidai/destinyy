/**
 * Prototype World Engine Types
 * Preserved byte for byte for Stage 7
 */

export interface Inhabitant {
  id: string;
  name: string;
  role: string;
  history: string;
  routine: string;
  goal: string;
  status: 'idle' | 'acting' | 'resting' | 'cultivating';
}

export interface WorldEvent {
  id: string;
  timestamp: number;
  actorId: string;
  action: string;
  valid: boolean;
  ruleVerified: string;
  detail: string;
}

export interface ActionProposal {
  actorId: string;
  action: string;
  intent: string;
}

export interface RuleCheckResult {
  valid: boolean;
  reason: string;
}

export interface WorldState {
  inhabitants: Inhabitant[];
  events: WorldEvent[];
  clock: number;
  season: string;
}
