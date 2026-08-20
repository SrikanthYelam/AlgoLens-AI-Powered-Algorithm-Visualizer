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

export function LongestCommonSubsequenceStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as LongestCommonSubsequenceState;

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">DP Table</h3>
        {state.table.length === 0 ? (
          <span className="text-gray-400">empty</span>
        ) : (
          <div className="inline-flex flex-col gap-1 overflow-x-auto">
            <div className="flex gap-1">
              <Cell value="" highlighted={false} header />
              {state.table[0].map((_, c) => (
                <Cell key={c} value={c === 0 ? 'Ø' : state.text2[c - 1]} highlighted={false} header />
              ))}
            </div>
            {state.table.map((rowValues, r) => (
              <div key={r} className="flex gap-1">
                <Cell value={r === 0 ? 'Ø' : state.text1[r - 1]} highlighted={false} header />
                {rowValues.map((v, c) => (
                  <Cell key={c} value={String(v)} highlighted={state.row === r && state.col === c} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Subsequence so far</h3>
        {state.subsequence.length === 0 ? (
          <span className="text-gray-400">none yet</span>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {[...state.subsequence].map((c, i) => (
              <Cell key={i} value={c} highlighted={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
