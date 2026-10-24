import type { AlgorithmStateViewProps } from '../../types/algorithm';
import { TreeDiagram } from '../../components/TreeDiagram';
import { StackView } from '../../components/structures';
import { Cell, CellRow, VizSection, VizStack } from '../../components/viz';
import { previousStepOf } from '../../utils/history';

/** Mirrors AlgoLens.Core.Models.KthSmallestState (camelCase JSON). */
interface KthSmallestState {
  tree: (number | null)[];
  currentVal: number | null;
  visitedCount: number;
  k: number;
  answer: number | null;
}

export function KthSmallestStateView({ step, history = [] }: AlgorithmStateViewProps) {
  const state = step.state as KthSmallestState;
  const roles = state.currentVal !== null ? { [state.currentVal]: 'current' as const } : {};

  // Replay the walk: "Go left" pushes a node, "Visit" pops it and counts it in sorted order.
  const stackAt = (steps: typeof history) => {
    const stack: number[] = [];
    const visited: number[] = [];
    for (const h of steps) {
      const value = (h.state as KthSmallestState).currentVal;
      if (value === null) continue;
      if (h.action.startsWith('Go left')) stack.push(value);
      else if (h.action.startsWith('Visit')) {
        stack.pop();
        visited.push(value);
      }
    }
    return { stack, visited };
  };
  const now = stackAt(history);
  const before = stackAt(history.slice(0, -1));
  const toItem = (value: number, depth: number) => ({ id: `${depth}:${value}`, node: <>node {value}</> });

  return (
    <VizStack>
      <TreeDiagram tree={state.tree} roles={roles} />

      <div className="flex flex-wrap items-start gap-x-10 gap-y-4">
        <VizSection title="Stack (left spine being walked)">
          <StackView items={now.stack.map(toItem)} prevItems={previousStepOf(history) ? before.stack.map(toItem) : undefined} />
        </VizSection>

        <VizSection title={`Sorted order so far — stop at the ${state.k}th`}>
          <CellRow>
            {Array.from({ length: state.k }, (_, i) => (
              <Cell
                key={i}
                size="sm"
                index={`#${i + 1}`}
                value={now.visited[i] ?? ''}
                state={i === state.k - 1 && state.answer !== null ? 'found' : now.visited[i] !== undefined ? 'visited' : 'plain'}
                unused={now.visited[i] === undefined}
              />
            ))}
          </CellRow>
        </VizSection>
      </div>

      <p className="font-medium text-ink">
        Visited {state.visitedCount} of {state.k} in sorted order
        {state.answer !== null && <span className="text-success"> — ✓ answer: {state.answer}</span>}
      </p>
    </VizStack>
  );
}
