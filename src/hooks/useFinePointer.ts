import { useMedia } from './useMedia';

export function useFinePointer(): boolean {
  return useMedia('(hover: hover) and (pointer: fine)');
}
