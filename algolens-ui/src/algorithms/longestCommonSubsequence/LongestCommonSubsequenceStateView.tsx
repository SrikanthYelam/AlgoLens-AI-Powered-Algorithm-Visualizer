import { Cell, CellRow, DpTable, Empty, VizSection, VizStack, markSources, type DpTableCell } from '../../components/viz';
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

const isTraceback = (action: string) => action.startsWith('Trace back');

export function LongestCommonSubsequenceStateView({ step, history = [] }: AlgorithmStateViewProps) {
  const state = step.state as LongestCommonSubsequenceState;
  const { row, col, table } = state;
  const tracing = isTraceback(step.action);
  const filling = !tracing && row > 0 && col > 0;

  // Fill phase: where the current cell's value came from.
  const sources: Parameters<typeof markSources>[1] = [];
  if (filling) {
    if (state.text1[row - 1] === state.text2[col - 1]) {
      sources.push({ at: [row - 1, col - 1], strong: true });
    } else {
      const up = table[row - 1][col];
      const left = table[row][col - 1];
      sources.push({ at: [row - 1, col], strong: up >= left }, { at: [row, col - 1], strong: left >= up });
    }
  }
  const mark = markSources([row, col], sources);

  // Traceback phase: the cells walked so far, each arrowed toward the next one.
  const path = history.filter((h) => isTraceback(h.action)).map((h) => h.state as LongestCommonSubsequenceState);
  const pathAt = new Map<string, [number, number]>();
  path.forEach((p, k) => {
    const next = path[k + 1];
    const dir: [number, number] = next
      ? [Math.sign(next.row - p.row), Math.sign(next.col - p.col)]
      : // The current step's own move is spelled out in its action text.
        step.action.includes('diagonally')
        ? [-1, -1]
        : step.action.includes('move up')
          ? [-1, 0]
          : [0, -1];
    pathAt.set(`${p.row},${p.col}`, dir);
  });

  const rows: DpTableCell[][] = table.map((rowValues, r) =>
    rowValues.map((v, c) => {
      const isCurrent = row === r && col === c;
      const onPath = pathAt.get(`${r},${c}`);
      const m = mark(r, c);
      return {
        value: String(v),
        state: isCurrent ? 'current' : onPath ? 'range' : (m?.state ?? 'plain'),
        badge: onPath && !isCurrent ? { dir: onPath, strong: true } : m?.badge,
      };
    }),
  );

  return (
    <VizStack>
      <VizSection
        title={
          tracing
            ? 'DP Table — tracing back from the bottom-right corner (arrows show the path taken)'
            : 'DP Table — a match comes from the diagonal ↘ (+1), otherwise the larger of ↓ above and → left'
        }
      >
        {table.length === 0 ? (
          <Empty>empty</Empty>
        ) : (
          <DpTable
            colHeaders={table[0].map((_, c) => (c === 0 ? 'Ø' : state.text2[c - 1]))}
            rowHeaders={table.map((_, r) => (r === 0 ? 'Ø' : state.text1[r - 1]))}
            rows={rows}
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
