import { DpTable, VizSection, VizStack, markSources } from '../../components/viz';
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
  const { row, col, table } = state;
  const filling = row > 0 && col > 0;

  // A match inherits the diagonal; otherwise 1 + the cheapest of replace ↘, delete ↓, insert →.
  const sources: Parameters<typeof markSources>[1] = [];
  if (filling) {
    if (state.word1[row - 1] === state.word2[col - 1]) {
      sources.push({ at: [row - 1, col - 1], strong: true });
    } else {
      const replace = table[row - 1][col - 1];
      const del = table[row - 1][col];
      const insert = table[row][col - 1];
      const best = Math.min(replace, del, insert);
      sources.push(
        { at: [row - 1, col - 1], strong: replace === best },
        { at: [row - 1, col], strong: del === best },
        { at: [row, col - 1], strong: insert === best },
      );
    }
  }
  const mark = markSources([row, col], sources);

  return (
    <VizStack>
      <VizSection title="DP Table (dp[i][j] = min operations to turn word1[..i] into word2[..j])">
        <DpTable
          colHeaders={table[0].map((_, c) => (c === 0 ? 'Ø' : state.word2[c - 1]))}
          rowHeaders={table.map((_, r) => (r === 0 ? 'Ø' : state.word1[r - 1]))}
          rows={table.map((rowValues, r) =>
            rowValues.map((v, c) => {
              const m = mark(r, c);
              return { value: String(v), state: row === r && col === c ? 'current' : (m?.state ?? 'plain'), badge: m?.badge };
            }),
          )}
        />
        {filling && state.word1[row - 1] !== state.word2[col - 1] && (
          <p className="text-caption text-ink-subtle">
            ↘ replace · ↓ delete · → insert — the filled arrows are the cheapest option(s), plus 1.
          </p>
        )}
      </VizSection>
    </VizStack>
  );
}
