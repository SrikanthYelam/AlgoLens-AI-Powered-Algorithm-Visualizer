import type { AlgorithmStateViewProps } from '../../types/algorithm';
import { TreeDiagram } from '../../components/TreeDiagram';
import { Cell, Chain, VizSection, VizStack } from '../../components/viz';

/** Mirrors AlgoLens.Core.Models.FlattenBinaryTreeIterativeState (camelCase JSON). */
interface FlattenBinaryTreeIterativeState {
  tree: (number | null)[];
  currentValue: number | null;
  predecessorValue: number | null;
}

export function FlattenBinaryTreeIterativeStateView({ step, history = [] }: AlgorithmStateViewProps) {
  const state = step.state as FlattenBinaryTreeIterativeState;

  const roles: Record<number, 'current' | 'path' | 'muted'> = {};
  if (state.predecessorValue !== null) {
    roles[state.predecessorValue] = 'path';
  }
  if (state.currentValue !== null) {
    roles[state.currentValue] = 'current';
  }

  const visited: number[] = [];
  for (const h of history) {
    const value = (h.state as { currentValue: number | null }).currentValue;
    if (value !== null && visited[visited.length - 1] !== value) visited.push(value);
  }

  return (
    <VizStack>
      <TreeDiagram tree={state.tree} roles={roles} />

      {visited.length > 0 && (
        <VizSection title="Nodes visited so far, left to right (the finished tree is this chain)">
          <Chain>
            {visited.map((value, i) => (
              <Cell key={i} size="sm" value={value} state={i === visited.length - 1 ? 'current' : 'plain'} />
            ))}
          </Chain>
        </VizSection>
      )}
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
