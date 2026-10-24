import type { AlgorithmStateViewProps } from '../types/algorithm';
import { RecursionTree } from './RecursionTree';
import { Cell, CellRow, Empty, Legend, VizSection, VizStack } from './viz';

/**
 * Mirrors AlgoLens.Core.Models.StringBacktrackingState (camelCase JSON). Shared by
 * every backtracking algorithm whose solutions are strings (Letter Combinations of a
 * Phone Number, Generate Parentheses) — used directly as their StateView.
 */
interface StringBacktrackingState {
  path: string;
  solutions: string[];
}

export function StringBacktrackingStateView({ step, history }: AlgorithmStateViewProps) {
  const state = step.state as StringBacktrackingState;
  const highlighted = new Set(step.highlights);

  return (
    <VizStack>
      {history && (
        <VizSection
          title={
            <>
              Recursion tree — each node is one choice · <Legend state="current">now</Legend>{' '}
              <Legend state="range">current path</Legend> <Legend state="found">solution</Legend>{' '}
              <Legend state="visited">backtracked</Legend>
            </>
          }
        >
          <RecursionTree history={history} />
        </VizSection>
      )}

      <VizSection title="Current path">
        <CellRow>
          {state.path.length === 0 ? (
            <Empty>empty</Empty>
          ) : (
            [...state.path].map((char, i) => (
              <Cell
                key={i}
                value={char.toUpperCase()}
                state={i === state.path.length - 1 && highlighted.has(char) ? 'current' : 'plain'}
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
                {[...solution].map((char, j) => (
                  <Cell key={j} value={char.toUpperCase()} />
                ))}
              </CellRow>
            ))
          )}
        </div>
      </VizSection>
    </VizStack>
  );
}
