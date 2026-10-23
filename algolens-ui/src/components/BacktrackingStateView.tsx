import type { AlgorithmStateViewProps } from '../types/algorithm';
import { Cell, CellRow, Empty, VizSection, VizStack } from './viz';

/**
 * Mirrors AlgoLens.Core.Models.BacktrackingState (camelCase JSON). Shared by
 * every backtracking algorithm whose solutions are lists of integers
 * (Permutations, Combinations, Subsets) — used directly as their StateView.
 */
interface BacktrackingState {
  path: number[];
  solutions: number[][];
}

export function BacktrackingStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as BacktrackingState;
  const highlighted = new Set(step.highlights);

  return (
    <VizStack>
      <VizSection title="Current path">
        <CellRow>
          {state.path.length === 0 ? (
            <Empty>empty</Empty>
          ) : (
            state.path.map((value, i) => (
              <Cell
                key={i}
                value={value}
                state={i === state.path.length - 1 && highlighted.has(String(value)) ? 'current' : 'plain'}
              />
            ))
          )}
        </CellRow>
      </VizSection>

      <VizSection title={`Solutions found (${state.solutions.length})`}>
        <div className="flex max-h-48 flex-col gap-1 overflow-y-auto">
          {state.solutions.length === 0 ? (
            <Empty>none yet</Empty>
          ) : (
            state.solutions.map((solution, i) => (
              <CellRow key={i} gap="sm">
                {solution.length === 0 ? (
                  <Empty>(empty)</Empty>
                ) : (
                  solution.map((value, j) => <Cell key={j} value={value} />)
                )}
              </CellRow>
            ))
          )}
        </div>
      </VizSection>
    </VizStack>
  );
}
