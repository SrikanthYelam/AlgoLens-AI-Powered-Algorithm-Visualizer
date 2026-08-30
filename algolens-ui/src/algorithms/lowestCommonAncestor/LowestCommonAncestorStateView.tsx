import type { AlgorithmStateViewProps } from '../../types/algorithm';
import { TreeDiagram } from '../../components/TreeDiagram';

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
    <div className="flex flex-col gap-4 text-sm">
      <TreeDiagram tree={state.tree} roles={roles} />
      <p className="font-medium text-gray-700 dark:text-gray-300">
        Targets: {state.p} and {state.q}
        {state.ancestor !== null && (
          <span className="text-emerald-600 dark:text-emerald-400"> — ancestor: {state.ancestor}</span>
        )}
      </p>
    </div>
  );
}
