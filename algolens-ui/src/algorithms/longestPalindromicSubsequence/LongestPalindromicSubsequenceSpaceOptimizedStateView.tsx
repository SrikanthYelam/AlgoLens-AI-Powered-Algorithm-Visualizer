import { Cell, CellRow, DpTable, Empty, VizSection, VizStack } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.LongestPalindromicSubsequenceSpaceOptimizedState (camelCase JSON). */
interface LongestPalindromicSubsequenceSpaceOptimizedState {
  s: string;
  dp: number[];
  i: number;
  j: number;
  prev: number | null;
}

export function LongestPalindromicSubsequenceSpaceOptimizedStateView({ step }: AlgorithmStateViewProps) {
  const { s, dp, i, j, prev } = step.state as LongestPalindromicSubsequenceSpaceOptimizedState;
  const filling = i >= 0;
  const matched = filling && s[i] === s[j];
  const isDone = !filling && dp.length > 0 && step.highlights.length === 0;

  return (
    <VizStack>
      <VizSection
        title={
          filling
            ? `Rolling row dp[j] — now holding row i = ${i} (s[${i}] = "${s[i]}")`
            : 'Rolling row dp[j] — one 1D array reused for every i'
        }
      >
        {dp.length === 0 ? (
          <Empty>empty</Empty>
        ) : (
          <DpTable
            colHeaders={[...s]}
            rowHeaders={['dp']}
            rows={[
              dp.map((v, c) => ({
                value: String(v),
                // Columns left of i are the untouched base-case diagonal, not part of row i.
                unused: filling && c < i,
                state:
                  filling && c === j
                    ? 'current'
                    : filling && !matched && c === j - 1
                      ? 'comparing'
                      : isDone && c === dp.length - 1
                        ? 'found'
                        : 'plain',
                badge: filling && !matched && c === j - 1 ? { dir: [0, 1], strong: true } : undefined,
              })),
            ]}
          />
        )}
        {filling && (
          <p className="text-caption text-ink-subtle">
            {matched
              ? 'The ends match, so dp[j] = prev + 2, where prev is the old dp[j-1] saved before it was overwritten.'
              : 'The ends differ, so dp[j] is the larger of its own old value (the cell below, in the 2D table) and dp[j-1] (the cell to the left, already updated).'}
          </p>
        )}
      </VizSection>

      <VizSection title="prev (the carried 2D diagonal dp[i+1][j-1])">
        <CellRow>{prev === null ? <Empty>—</Empty> : <Cell value={prev} state={matched ? 'comparing' : 'plain'} />}</CellRow>
      </VizSection>
    </VizStack>
  );
}
