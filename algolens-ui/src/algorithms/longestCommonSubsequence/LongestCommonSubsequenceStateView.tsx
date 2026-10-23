import { Cell, CellRow, DpTable, Empty, VizSection, VizStack } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.LongestCommonSubsequenceState (camelCase JSON). */
interface LongestCommonSubsequenceState {
  text1: string;
  text2: string;
  table: number[][];
  row: number;
  col: number;
  subsequence: string;
}

export function LongestCommonSubsequenceStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as LongestCommonSubsequenceState;

  return (
    <VizStack>
      <VizSection title="DP Table">
        {state.table.length === 0 ? (
          <Empty>empty</Empty>
        ) : (
          <DpTable
            colHeaders={state.table[0].map((_, c) => (c === 0 ? 'Ø' : state.text2[c - 1]))}
            rowHeaders={state.table.map((_, r) => (r === 0 ? 'Ø' : state.text1[r - 1]))}
            rows={state.table.map((rowValues, r) =>
              rowValues.map((v, c) => ({ value: String(v), state: state.row === r && state.col === c ? 'current' : 'plain' })),
            )}
          />
        )}
      </VizSection>

      <VizSection title="Subsequence so far">
        {state.subsequence.length === 0 ? (
          <Empty>none yet</Empty>
        ) : (
          <CellRow>
            {[...state.subsequence].map((c, i) => (
              <Cell key={i} value={c} state="found" size="sm" />
            ))}
          </CellRow>
        )}
      </VizSection>
    </VizStack>
  );
}
