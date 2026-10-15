/**
 * Prototype World State & Reducer
 * Preserved byte for byte for Stage 7
 */

import type { WorldState, WorldEvent, Inhabitant } from './types';

export const initialInhabitants: Inhabitant[] = [
  {
    id: 'chen',
    name: 'Master Chen',
    role: 'Valley Elder',
    history: 'Studied mountain breath cultivation for forty years.',
    routine: 'Tends shrine at dawn, teaches evening breath cultivation.',
    goal: 'Maintain valley balance and record seasonal covenants.',
    status: 'cultivating',
  },
  {
    id: 'lin',
    name: 'Lin',
    role: 'Apprentice Disciple',
    history: 'Arrived seeking guidance in medicinal plants.',
    routine: 'Gathers herbs along the brook before midday.',
    goal: 'Cultivate rare cliff orchids and master remedies.',
    status: 'idle',
  },
  {
    id: 'wu',
    name: 'Elder Wu',
    role: 'Keeper of Records',
    history: 'Inscribes permanent wood covenants in the valley pavilion.',
    routine: 'Catalogs ledger records at midday.',
    goal: 'Record every valid event permanently without omission.',
    status: 'idle',
  },
];

export const initialWorldState: WorldState = {
  inhabitants: initialInhabitants,
  events: [
    {
      id: 'event-0',
      timestamp: 1,
      actorId: 'chen',
      action: 'Opened valley cultivation sanctuary',
      valid: true,
      ruleVerified: 'Genesis covenant recorded',
      detail: 'Sanctuary gates prepared for apprentice entry.',
    },
  ],
  clock: 1,
  season: 'Autumn',
};

export type WorldAction =
  | { type: 'COMMIT_EVENT'; event: WorldEvent }
  | { type: 'TICK_CLOCK' };

export function worldReducer(state: WorldState, action: WorldAction): WorldState {
  switch (action.type) {
    case 'COMMIT_EVENT':
      return {
        ...state,
        events: [...state.events, action.event],
      };
    case 'TICK_CLOCK':
      return {
        ...state,
        clock: state.clock + 1,
      };
    default:
      return state;
  }
}
