import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.SlidingWindowState (camelCase JSON). */
interface SlidingWindowState {
  nums: number[];
  windowSize: number;
  currentIndex: number;
  deque: number[];
  result: number[];
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
      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 font-mono text-sm ${
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

export function SlidingWindowStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as SlidingWindowState;
  const highlighted = new Set(step.highlights);
  const windowStart = state.currentIndex - state.windowSize + 1;

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Array</h3>
        <div className="flex flex-wrap gap-1.5">
          {state.nums.map((value, i) => (
            <Box
              key={i}
              value={value}
              highlighted={highlighted.has(String(value)) && i === state.currentIndex}
              inWindow={i >= windowStart && i <= state.currentIndex}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Deque (front → back, decreasing)
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {state.deque.length === 0 ? (
            <span className="text-gray-400">empty</span>
          ) : (
            state.deque.map((value, i) => <Box key={i} value={value} highlighted={false} inWindow={false} />)
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Maxima so far</h3>
        <div className="flex flex-wrap gap-1.5">
          {state.result.length === 0 ? (
            <span className="text-gray-400">none yet</span>
          ) : (
            state.result.map((value, i) => <Box key={i} value={value} highlighted={false} inWindow={false} />)
          )}
        </div>
      </div>
    </div>
  );
}
