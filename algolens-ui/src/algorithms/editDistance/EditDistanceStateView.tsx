import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.EditDistanceState (camelCase JSON). */
interface EditDistanceState {
  word1: string;
  word2: string;
  table: number[][];
  row: number;
  col: number;
}

function Cell({ value, highlighted, header }: { value: string; highlighted: boolean; header?: boolean }) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border text-xs font-mono transition-colors duration-200 ${
        highlighted
          ? 'border-indigo-500 bg-indigo-400 text-white'
          : header
            ? 'border-transparent bg-transparent text-gray-500 dark:text-gray-400'
            : 'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200'
      }`}
    >
      {value}
    </span>
  );
}

export function EditDistanceStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as EditDistanceState;

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          DP Table (dp[i][j] = min operations to turn word1[..i] into word2[..j])
        </h3>
        <div className="inline-flex flex-col gap-1 overflow-x-auto">
          <div className="flex gap-1">
            <Cell value="" highlighted={false} header />
            {state.table[0].map((_, c) => (
              <Cell key={c} value={c === 0 ? 'Ø' : state.word2[c - 1]} highlighted={false} header />
            ))}
          </div>
          {state.table.map((rowValues, r) => (
            <div key={r} className="flex gap-1">
              <Cell value={r === 0 ? 'Ø' : state.word1[r - 1]} highlighted={false} header />
              {rowValues.map((v, c) => (
                <Cell key={c} value={String(v)} highlighted={state.row === r && state.col === c} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
