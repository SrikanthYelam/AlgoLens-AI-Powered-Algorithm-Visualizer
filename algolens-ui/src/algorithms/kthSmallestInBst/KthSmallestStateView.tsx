import type { AlgorithmStateViewProps } from '../../types/algorithm';
import { TreeDiagram } from '../../components/TreeDiagram';
import { VizStack } from '../../components/viz';

/** Mirrors AlgoLens.Core.Models.KthSmallestState (camelCase JSON). */
interface KthSmallestState {
  tree: (number | null)[];
  currentVal: number | null;
  visitedCount: number;
  k: number;
  answer: number | null;
}

export function KthSmallestStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as KthSmallestState;
  const roles = state.currentVal !== null ? { [state.currentVal]: 'current' as const } : {};

  return (
    <VizStack>
      <TreeDiagram tree={state.tree} roles={roles} />
      <p className="font-medium text-ink">
        Visited {state.visitedCount} of {state.k} in sorted order
        {state.answer !== null && (
          <span className="text-success"> — ✓ answer: {state.answer}</span>
        )}
      </p>
    </VizStack>
  );
}
