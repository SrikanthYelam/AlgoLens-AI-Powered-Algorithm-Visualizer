import type { AlgorithmStateViewProps } from '../../types/algorithm';
import { TreeDiagram } from '../../components/TreeDiagram';

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
    <div className="flex flex-col gap-4 text-sm">
      <TreeDiagram tree={state.tree} roles={roles} />
      <p className="font-medium text-gray-700 dark:text-gray-300">
        Visited {state.visitedCount} of {state.k} in sorted order
        {state.answer !== null && (
          <span className="text-emerald-600 dark:text-emerald-400"> — answer: {state.answer}</span>
        )}
      </p>
    </div>
  );
}
