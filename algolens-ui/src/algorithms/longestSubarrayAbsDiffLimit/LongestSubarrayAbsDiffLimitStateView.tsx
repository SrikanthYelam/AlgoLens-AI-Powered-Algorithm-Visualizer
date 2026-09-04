import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.LongestSubarrayAbsDiffLimitState (camelCase JSON). */
interface LongestSubarrayAbsDiffLimitState {
  nums: number[];
  limit: number;
  left: number;
  right: number;
  maxDeque: number[];
  minDeque: number[];
  bestStart: number;
  bestLength: number;
}

function Box({
  value,
  highlighted,
  inWindow,
}: {
  value: number;
  highlighted: boolean;
  inWindow: boolean;
}) {
  return (
    <span
      className={`transition-colors duration-200 inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 font-mono text-sm ${
        highlighted
          ? 'border-indigo-500 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200'
          : inWindow
            ? 'border-indigo-300 bg-indigo-50 text-gray-700 dark:border-indigo-700 dark:bg-indigo-950/40 dark:text-gray-200'
            : 'border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
      }`}
    >
      {value}
    </span>
  );
}

export function LongestSubarrayAbsDiffLimitStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as LongestSubarrayAbsDiffLimitState;

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Array (window [{state.left}..{state.right}], limit {state.limit})
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {state.nums.map((value, i) => (
            <Box key={i} value={value} highlighted={i === state.right} inWindow={i >= state.left && i <= state.right} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Max deque (front → back, decreasing)</h3>
        <div className="flex flex-wrap gap-1.5">
          {state.maxDeque.length === 0 ? (
            <span className="text-gray-400">empty</span>
          ) : (
            state.maxDeque.map((value, i) => <Box key={i} value={value} highlighted={false} inWindow={false} />)
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Min deque (front → back, increasing)</h3>
        <div className="flex flex-wrap gap-1.5">
          {state.minDeque.length === 0 ? (
            <span className="text-gray-400">empty</span>
          ) : (
            state.minDeque.map((value, i) => <Box key={i} value={value} highlighted={false} inWindow={false} />)
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Longest valid subarray so far (length {state.bestLength})
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {state.bestLength === 0 ? (
            <span className="text-gray-400">none yet</span>
          ) : (
            state.nums
              .slice(state.bestStart, state.bestStart + state.bestLength)
              .map((value, i) => <Box key={i} value={value} highlighted={false} inWindow={false} />)
          )}
        </div>
      </div>
    </div>
  );
}
