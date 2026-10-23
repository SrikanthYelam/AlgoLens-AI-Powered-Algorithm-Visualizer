import { DpTable, VizSection, VizStack } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.EditDistanceState (camelCase JSON). */
interface EditDistanceState {
  word1: string;
  word2: string;
  table: number[][];
  row: number;
  col: number;
}

export function EditDistanceStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as EditDistanceState;

  return (
    <VizStack>
      <VizSection title="DP Table (dp[i][j] = min operations to turn word1[..i] into word2[..j])">
        <DpTable
          colHeaders={state.table[0].map((_, c) => (c === 0 ? 'Ø' : state.word2[c - 1]))}
          rowHeaders={state.table.map((_, r) => (r === 0 ? 'Ø' : state.word1[r - 1]))}
          rows={state.table.map((rowValues, r) =>
            rowValues.map((v, c) => ({ value: String(v), state: state.row === r && state.col === c ? 'current' : 'plain' })),
          )}
        />
      </VizSection>
    </VizStack>
  );
}
