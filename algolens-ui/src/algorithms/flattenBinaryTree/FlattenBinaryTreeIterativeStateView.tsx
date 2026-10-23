import type { AlgorithmStateViewProps } from '../../types/algorithm';
import { TreeDiagram } from '../../components/TreeDiagram';
import { VizStack } from '../../components/viz';

/** Mirrors AlgoLens.Core.Models.FlattenBinaryTreeIterativeState (camelCase JSON). */
interface FlattenBinaryTreeIterativeState {
  tree: (number | null)[];
  currentValue: number | null;
  predecessorValue: number | null;
}

export function FlattenBinaryTreeIterativeStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as FlattenBinaryTreeIterativeState;

  const roles: Record<number, 'current' | 'path' | 'muted'> = {};
  if (state.predecessorValue !== null) {
    roles[state.predecessorValue] = 'path';
  }
  if (state.currentValue !== null) {
    roles[state.currentValue] = 'current';
  }

  return (
    <VizStack>
      <TreeDiagram tree={state.tree} roles={roles} />
      {state.currentValue !== null && (
        <p className="font-medium text-ink">
          curr = {state.currentValue}
          {state.predecessorValue !== null && (
            <span> — rightmost node of its left subtree: {state.predecessorValue}</span>
          )}
        </p>
      )}
    </VizStack>
  );
}
