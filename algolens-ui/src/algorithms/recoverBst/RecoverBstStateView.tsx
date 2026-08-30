import type { AlgorithmStateViewProps } from '../../types/algorithm';
import { TreeDiagram } from '../../components/TreeDiagram';

/** Mirrors AlgoLens.Core.Models.RecoverBstState (camelCase JSON). */
interface RecoverBstState {
  tree: (number | null)[];
  currentVal: number | null;
  prevVal: number | null;
  firstVal: number | null;
  secondVal: number | null;
}

export function RecoverBstStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as RecoverBstState;

  const roles: Record<number, 'current' | 'path' | 'muted'> = {};
  if (state.firstVal !== null) {
    roles[state.firstVal] = 'path';
  }
  if (state.secondVal !== null) {
    roles[state.secondVal] = 'path';
  }
  if (state.currentVal !== null) {
    roles[state.currentVal] = 'current';
  }

  return (
    <div className="flex flex-col gap-4 text-sm">
      <TreeDiagram tree={state.tree} roles={roles} />
      <p className="font-medium text-gray-700 dark:text-gray-300">
        {state.firstVal !== null ? (
          <>
            Misplaced so far: {state.firstVal}
            {state.secondVal !== null && <> and {state.secondVal}</>}
          </>
        ) : (
          'No violation found yet'
        )}
      </p>
    </div>
  );
}
