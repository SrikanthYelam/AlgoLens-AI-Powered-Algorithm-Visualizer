import type { AlgorithmStateViewProps } from '../../types/algorithm';
import { TreeDiagram } from '../../components/TreeDiagram';

/** Mirrors AlgoLens.Core.Models.DeleteNodeInBstState (camelCase JSON). */
interface DeleteNodeInBstState {
  tree: (number | null)[];
  currentValue: number | null;
  key: number;
}

export function DeleteNodeInBstStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as DeleteNodeInBstState;

  const roles: Record<number, 'current' | 'path' | 'muted'> = { [state.key]: 'path' };
  if (state.currentValue !== null) {
    roles[state.currentValue] = 'current';
  }

  return (
    <div className="flex flex-col gap-4 text-sm">
      <TreeDiagram tree={state.tree} roles={roles} />
      <p className="font-medium text-gray-700 dark:text-gray-300">Deleting key: {state.key}</p>
    </div>
  );
}
