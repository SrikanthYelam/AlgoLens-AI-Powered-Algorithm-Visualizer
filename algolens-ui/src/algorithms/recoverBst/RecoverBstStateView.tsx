import type { AlgorithmStateViewProps } from '../../types/algorithm';
import { TreeDiagram } from '../../components/TreeDiagram';
import { VizStack } from '../../components/viz';

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
    <VizStack>
      <TreeDiagram tree={state.tree} roles={roles} />
      <p className="font-medium text-ink">
        {state.firstVal !== null ? (
          <>
            Misplaced so far: {state.firstVal}
            {state.secondVal !== null && <> and {state.secondVal}</>}
          </>
        ) : (
          'No violation found yet'
        )}
      </p>
    </VizStack>
  );
}
