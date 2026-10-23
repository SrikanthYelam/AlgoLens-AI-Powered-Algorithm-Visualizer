import { Cell, CellRow, Empty, VizSection, VizStack } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.RemoveInvalidParenthesesDfsState (camelCase JSON). */
interface RemoveInvalidParenthesesDfsState {
  path: string;
  index: number;
  removeLeftBudget: number;
  removeRightBudget: number;
  results: string[];
}

export function RemoveInvalidParenthesesDfsStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as RemoveInvalidParenthesesDfsState;

  return (
    <VizStack>
      <VizSection title={`Path so far (scanned up to index ${state.index})`}>
        <CellRow>
          {state.path.length === 0 ? <Empty>empty</Empty> : [...state.path].map((char, i) => <Cell key={i} value={char} />)}
        </CellRow>
      </VizSection>

      <VizSection title="Removal budget remaining">
        <div className="flex gap-4 text-ink-muted">
          <span>
            <span className="font-mono text-ink">(</span> to remove:{' '}
            <span className="font-semibold text-ink">{state.removeLeftBudget}</span>
          </span>
          <span>
            <span className="font-mono text-ink">)</span> to remove:{' '}
            <span className="font-semibold text-ink">{state.removeRightBudget}</span>
          </span>
        </div>
      </VizSection>

      <VizSection title={`Results found (${state.results.length})`}>
        <CellRow>
          {state.results.length === 0 ? (
            <Empty>none yet</Empty>
          ) : (
            state.results.map((result, i) => (
              <Cell key={i} value={result.length === 0 ? '(empty)' : result} state="found" />
            ))
          )}
        </CellRow>
      </VizSection>
    </VizStack>
  );
}
