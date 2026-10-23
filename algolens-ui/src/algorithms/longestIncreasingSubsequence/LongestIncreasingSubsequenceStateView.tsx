import { DpTable, Empty, VizSection, VizStack } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.LongestIncreasingSubsequenceState (camelCase JSON). */
interface LongestIncreasingSubsequenceState {
  nums: number[];
  table: number[][];
  i: number;
  j: number;
}

export function LongestIncreasingSubsequenceStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as LongestIncreasingSubsequenceState;

  return (
    <VizStack>
      <VizSection title="DP Table (dp[i][j] = LIS length from index i onward, given the previous pick was at index j-1)">
        {state.table.length === 0 ? (
          <Empty>empty</Empty>
        ) : (
          <DpTable
            colHeaders={state.table[0].map((_, c) => (c === 0 ? '∅' : String(state.nums[c - 1])))}
            rowHeaders={state.table.map((_, r) => (r === state.nums.length ? '∅' : String(state.nums[r])))}
            rows={state.table.map((rowValues, r) =>
              rowValues.map((v, c) => ({
                value: c > r ? '' : String(v),
                state: state.i === r && state.j === c ? 'current' : 'plain',
                unused: c > r,
              })),
            )}
          />
        )}
      </VizSection>
    </VizStack>
  );
}
