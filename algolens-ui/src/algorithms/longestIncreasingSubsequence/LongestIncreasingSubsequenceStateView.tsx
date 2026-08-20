import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.LongestIncreasingSubsequenceState (camelCase JSON). */
interface LongestIncreasingSubsequenceState {
  nums: number[];
  table: number[][];
  i: number;
  j: number;
}

function Cell({
  value,
  highlighted,
  header,
  unused,
}: {
  value: string;
  highlighted: boolean;
  header?: boolean;
  unused?: boolean;
}) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border text-xs font-mono transition-colors duration-200 ${
        highlighted
          ? 'border-indigo-500 bg-indigo-400 text-white'
          : header
            ? 'border-transparent bg-transparent text-gray-500 dark:text-gray-400'
            : unused
              ? 'border-gray-100 bg-transparent text-gray-300 dark:border-gray-800 dark:text-gray-700'
              : 'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200'
      }`}
    >
      {value}
    </span>
  );
}

export function LongestIncreasingSubsequenceStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as LongestIncreasingSubsequenceState;

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          DP Table (dp[i][j] = LIS length from index i onward, given the previous pick was at index j-1)
        </h3>
        {state.table.length === 0 ? (
          <span className="text-gray-400">empty</span>
        ) : (
          <div className="inline-flex flex-col gap-1 overflow-x-auto">
            <div className="flex gap-1">
              <Cell value="" highlighted={false} header />
              {state.table[0].map((_, c) => (
                <Cell key={c} value={c === 0 ? '∅' : String(state.nums[c - 1])} highlighted={false} header />
              ))}
            </div>
            {state.table.map((rowValues, r) => (
              <div key={r} className="flex gap-1">
                <Cell value={r === state.nums.length ? '∅' : String(state.nums[r])} highlighted={false} header />
                {rowValues.map((v, c) => (
                  <Cell
                    key={c}
                    value={c > r ? '' : String(v)}
                    highlighted={state.i === r && state.j === c}
                    unused={c > r}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
