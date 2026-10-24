import type { Step } from '../types/algorithm';

/** The step before the current one (the last entry of `history` is the current step), or undefined on step 1. */
export function previousStepOf(history?: Step[]): Step | undefined {
  return history && history.length > 1 ? history[history.length - 2] : undefined;
}
