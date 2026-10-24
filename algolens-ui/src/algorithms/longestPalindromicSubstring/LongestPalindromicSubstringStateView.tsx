import { Cell, CellRow, DpTable, Empty, VizSection, VizStack, markSources } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.LongestPalindromicSubstringState (camelCase JSON). */
interface LongestPalindromicSubstringState {
  s: string;
  table: boolean[][];
  i: number;
  j: number;
  longestSoFar: string;
}

export function LongestPalindromicSubstringStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as LongestPalindromicSubstringState;
  const { i, j } = state;

  // Matching ends of a span longer than 2 are only a palindrome if the inside (↗ diagonal cell) is one.
  const inside = i >= 0 && j - i > 1 && state.s[i] === state.s[j];
  const mark = markSources([i, j], inside ? [{ at: [i + 1, j - 1], strong: state.table[i][j] }] : []);

  return (
    <VizStack>
      <VizSection title="DP Table (dp[i][j] = true when s[i..j] is a palindrome)">
        {state.table.length === 0 ? (
          <Empty>empty</Empty>
        ) : (
          <DpTable
            colHeaders={[...state.s]}
            rowHeaders={[...state.s]}
            rows={state.table.map((rowValues, r) =>
              rowValues.map((v, c) => {
                const m = mark(r, c);
                return {
                  value: c < r ? '' : v ? '✓' : '·',
                  state: state.i === r && state.j === c ? 'current' : (m?.state ?? 'plain'),
                  badge: m?.badge,
                  unused: c < r,
                };
              }),
            )}
          />
        )}
      </VizSection>

      <VizSection title="Longest palindrome so far">
        {state.longestSoFar.length === 0 ? (
          <Empty>none yet</Empty>
        ) : (
          <CellRow>
            {[...state.longestSoFar].map((c, i) => (
              <Cell key={i} value={c} state="found" size="sm" />
            ))}
          </CellRow>
        )}
      </VizSection>
    </VizStack>
  );
}
