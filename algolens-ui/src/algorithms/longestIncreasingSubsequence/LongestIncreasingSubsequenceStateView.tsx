import { DpTable, Empty, VizSection, VizStack, markSources } from '../../components/viz';
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
  const { i, j, nums, table } = state;

  // Skip nums[i] (from the cell below) or take it (from the diagonal cell below-right), if it fits.
  const sources: Parameters<typeof markSources>[1] = [];
  if (i >= 0) {
    const canTake = j === 0 || nums[i] > nums[j - 1];
    const skip = table[i + 1][j];
    const take = canTake ? 1 + table[i + 1][i + 1] : -1;
    sources.push({ at: [i + 1, j], strong: skip >= take });
    if (canTake) sources.push({ at: [i + 1, i + 1], strong: take >= skip });
  }
  const mark = markSources([i, j], sources);

  return (
    <VizStack>
      <VizSection title="DP Table (dp[i][j] = LIS length from index i onward, given the previous pick was at index j-1)">
        {table.length === 0 ? (
          <Empty>empty</Empty>
        ) : (
          <DpTable
            colHeaders={table[0].map((_, c) => (c === 0 ? '∅' : String(nums[c - 1])))}
            rowHeaders={table.map((_, r) => (r === nums.length ? '∅' : String(nums[r])))}
            rows={table.map((rowValues, r) =>
              rowValues.map((v, c) => {
                const m = mark(r, c);
                return {
                  value: c > r ? '' : String(v),
                  state: i === r && j === c ? 'current' : (m?.state ?? 'plain'),
                  badge: m?.badge,
                  unused: c > r,
                };
              }),
            )}
          />
        )}
        {i >= 0 && (
          <p className="text-caption text-ink-subtle">
            Skipping nums[{i}] reads the cell just below; taking it (when it extends the pick) reads the diagonal cell
            below — the filled arrow is the larger option.
          </p>
        )}
      </VizSection>
    </VizStack>
  );
}
