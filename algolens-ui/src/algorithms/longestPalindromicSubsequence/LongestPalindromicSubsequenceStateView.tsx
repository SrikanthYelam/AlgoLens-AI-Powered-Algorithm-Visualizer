import { DpTable, Empty, VizSection, VizStack, markSources } from '../../components/viz';
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
  const { i, j, table } = state;

  // Matching ends wrap the inside ↗ (+2); otherwise the better of dropping either end (↑ / →).
  const sources: Parameters<typeof markSources>[1] = [];
  if (i >= 0 && j > i) {
    if (state.s[i] === state.s[j]) {
      if (j - i > 1) sources.push({ at: [i + 1, j - 1], strong: true });
    } else {
      const below = table[i + 1][j];
      const left = table[i][j - 1];
      sources.push({ at: [i + 1, j], strong: below >= left }, { at: [i, j - 1], strong: left >= below });
    }
  }
  const mark = markSources([i, j], sources);

  return (
    <VizStack>
      <VizSection title="DP Table (dp[i][j] = LPS length within s[i..j])">
        {table.length === 0 ? (
          <Empty>empty</Empty>
        ) : (
          <DpTable
            colHeaders={[...state.s]}
            rowHeaders={[...state.s]}
            rows={table.map((rowValues, r) =>
              rowValues.map((v, c) => {
                const m = mark(r, c);
                return {
                  value: c < r ? '' : String(v),
                  state: i === r && j === c ? 'current' : (m?.state ?? 'plain'),
                  badge: m?.badge,
                  unused: c < r,
                };
              }),
            )}
          />
        )}
      </VizSection>
    </VizStack>
  );
}
