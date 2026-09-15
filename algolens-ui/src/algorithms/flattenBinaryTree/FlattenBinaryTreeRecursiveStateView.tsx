import type { AlgorithmStateViewProps } from '../../types/algorithm';
import { TreeDiagram } from '../../components/TreeDiagram';

/** Mirrors AlgoLens.Core.Models.FlattenBinaryTreeRecursiveState (camelCase JSON). */
interface FlattenBinaryTreeRecursiveState {
  tree: (number | null)[];
  currentValue: number | null;
  prevValue: number | null;
}

export function FlattenBinaryTreeRecursiveStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as FlattenBinaryTreeRecursiveState;

  const roles: Record<number, 'current' | 'path' | 'muted'> = {};
  if (state.prevValue !== null) {
    roles[state.prevValue] = 'path';
  }
  if (state.currentValue !== null) {
    roles[state.currentValue] = 'current';
  }

  return (
    <div className="flex flex-col gap-4 text-sm">
      <TreeDiagram tree={state.tree} roles={roles} />
      {state.currentValue !== null && (
        <p className="font-medium text-gray-700 dark:text-gray-300">
          Visiting {state.currentValue}
          {state.prevValue !== null && <span> — linked after {state.prevValue}</span>}
        </p>
      )}
    </div>
  );
}
