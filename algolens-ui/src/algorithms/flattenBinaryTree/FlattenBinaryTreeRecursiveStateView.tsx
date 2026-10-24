import type { AlgorithmStateViewProps } from '../../types/algorithm';
import { TreeDiagram } from '../../components/TreeDiagram';
import { Cell, Chain, VizSection, VizStack } from '../../components/viz';

/** Mirrors AlgoLens.Core.Models.FlattenBinaryTreeRecursiveState (camelCase JSON). */
interface FlattenBinaryTreeRecursiveState {
  tree: (number | null)[];
  currentValue: number | null;
  prevValue: number | null;
}

export function FlattenBinaryTreeRecursiveStateView({ step, history = [] }: AlgorithmStateViewProps) {
  const state = step.state as FlattenBinaryTreeRecursiveState;

  const roles: Record<number, 'current' | 'path' | 'muted'> = {};
  if (state.prevValue !== null) {
    roles[state.prevValue] = 'path';
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
        <VizSection title="Preorder chain built so far (each node links to the next via its right pointer)">
          <Chain>
            {visited.map((value, i) => (
              <Cell key={i} size="sm" value={value} state={i === visited.length - 1 ? 'current' : 'plain'} />
            ))}
          </Chain>
        </VizSection>
      )}
      {state.currentValue !== null && (
        <p className="font-medium text-ink">
          Visiting {state.currentValue}
          {state.prevValue !== null && <span> — linked after {state.prevValue}</span>}
        </p>
      )}
    </VizStack>
  );
}
