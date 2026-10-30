import { Cell, CellRow, DpTable, Empty, VizSection, VizStack } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.LongestCommonSubsequenceSpaceOptimizedState (camelCase JSON). */
interface LongestCommonSubsequenceSpaceOptimizedState {
  text1: string;
  text2: string;
  dp: number[];
  i: number;
  j: number;
  prev: number | null;
}

export function LongestCommonSubsequenceSpaceOptimizedStateView({ step }: AlgorithmStateViewProps) {
  const { text1, text2, dp, i, j, prev } = step.state as LongestCommonSubsequenceSpaceOptimizedState;
  const filling = i > 0;
  const matched = filling && text1[i - 1] === text2[j - 1];
  const isDone = !filling && dp.length > 0 && step.action.startsWith('Done');

  return (
    <VizStack>
      <VizSection title="text1 (one row of the 2D table per character — the rolling array is rewritten for each)">
        <CellRow>
          {[...text1].map((c, k) => (
            <Cell key={k} value={c} index={k + 1} state={filling && k + 1 === i ? 'current' : filling && k + 1 < i ? 'visited' : 'plain'} />
          ))}
        </CellRow>
      </VizSection>

      <VizSection title={filling ? `Rolling row dp[j] — now holding row i = ${i} (text1[${i - 1}] = "${text1[i - 1]}")` : 'Rolling row dp[j] — one 1D array reused for every i'}>
        {dp.length === 0 ? (
          <Empty>empty</Empty>
        ) : (
          <DpTable
            colHeaders={['Ø', ...text2]}
            rowHeaders={['dp']}
            rows={[
              dp.map((v, c) => ({
                value: String(v),
                state:
                  filling && c === j
                    ? 'current'
                    : filling && !matched && c === j - 1
                      ? 'comparing'
                      : filling && c > 0 && c < j
                        ? 'range'
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
              ? 'The characters match, so dp[j] = prev + 1, where prev is the old dp[j-1] saved before it was overwritten. Shaded cells to the left are already row i.'
              : 'The characters differ, so dp[j] is the larger of its own old value (the cell above, in the 2D table) and dp[j-1] (the cell to the left, already updated). Shaded cells to the left are already row i.'}
          </p>
        )}
      </VizSection>

      <VizSection title="prev (the carried 2D diagonal dp[i-1][j-1])">
        <CellRow>{prev === null ? <Empty>—</Empty> : <Cell value={prev} state={matched ? 'comparing' : 'plain'} />}</CellRow>
      </VizSection>
    </VizStack>
  );
}
