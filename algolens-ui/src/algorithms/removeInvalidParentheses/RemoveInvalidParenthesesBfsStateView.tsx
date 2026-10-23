import { Cell, CellRow, Empty, VizSection, VizStack } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.RemoveInvalidParenthesesBfsState (camelCase JSON). */
interface RemoveInvalidParenthesesBfsState {
  current: string;
  level: number;
  frontier: string[];
  results: string[];
}

export function RemoveInvalidParenthesesBfsStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as RemoveInvalidParenthesesBfsState;
  const label = (value: string) => (value.length === 0 ? '(empty)' : value);

  return (
    <VizStack>
      <VizSection title={`Level ${state.level}`}>
        <Cell value={label(state.current)} state="current" />
      </VizSection>

      <VizSection title={`Frontier (${state.frontier.length})`}>
        <CellRow>
          {state.frontier.length === 0 ? (
            <Empty>empty</Empty>
          ) : (
            state.frontier.map((candidate, i) => (
              <Cell key={i} value={label(candidate)} state={candidate === state.current ? 'current' : 'plain'} />
            ))
          )}
        </CellRow>
      </VizSection>

      <VizSection title={`Results found (${state.results.length})`}>
        <CellRow>
          {state.results.length === 0 ? (
            <Empty>none yet</Empty>
          ) : (
            state.results.map((result, i) => <Cell key={i} value={label(result)} state="found" />)
          )}
        </CellRow>
      </VizSection>
    </VizStack>
  );
}
