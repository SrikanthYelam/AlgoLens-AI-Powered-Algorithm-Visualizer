import { DpTable, Empty, VizSection, VizStack } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.LongestPalindromicSubsequenceState (camelCase JSON). */
interface LongestPalindromicSubsequenceState {
  s: string;
  table: number[][];
  i: number;
  j: number;
}

export function LongestPalindromicSubsequenceStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as LongestPalindromicSubsequenceState;

  return (
    <VizStack>
      <VizSection title="DP Table (dp[i][j] = LPS length within s[i..j])">
        {state.table.length === 0 ? (
          <Empty>empty</Empty>
        ) : (
          <DpTable
            colHeaders={[...state.s]}
            rowHeaders={[...state.s]}
            rows={state.table.map((rowValues, r) =>
              rowValues.map((v, c) => ({
                value: c < r ? '' : String(v),
                state: state.i === r && state.j === c ? 'current' : 'plain',
                unused: c < r,
              })),
            )}
          />
        )}
      </VizSection>
    </VizStack>
  );
}
