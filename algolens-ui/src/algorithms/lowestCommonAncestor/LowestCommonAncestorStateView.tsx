import type { AlgorithmStateViewProps } from '../../types/algorithm';
import { TreeDiagram } from '../../components/TreeDiagram';
import { VizStack } from '../../components/viz';

/** Mirrors AlgoLens.Core.Models.LowestCommonAncestorState (camelCase JSON). */
interface LowestCommonAncestorState {
  tree: (number | null)[];
  currentVal: number | null;
  p: number;
  q: number;
  ancestor: number | null;
}

export function LowestCommonAncestorStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as LowestCommonAncestorState;

  const roles: Record<number, 'current' | 'path' | 'muted'> = {
    [state.p]: 'path',
    [state.q]: 'path',
  };
  if (state.currentVal !== null) {
    roles[state.currentVal] = 'current';
  }

  return (
    <VizStack>
      <TreeDiagram tree={state.tree} roles={roles} />
      <p className="font-medium text-ink">
        Targets: {state.p} and {state.q}
        {state.ancestor !== null && (
          <span className="text-success"> — ✓ ancestor: {state.ancestor}</span>
        )}
      </p>
    </VizStack>
  );
}
