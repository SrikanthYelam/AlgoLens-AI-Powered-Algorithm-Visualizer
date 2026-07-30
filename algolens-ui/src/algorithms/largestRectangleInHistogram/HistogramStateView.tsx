import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.HistogramState (camelCase JSON). `highlights` here are bar indices, not values. */
interface HistogramState {
  heights: number[];
  currentIndex: number;
  stack: number[];
  maxArea: number;
}

const MAX_BAR_HEIGHT_PX = 140;

export function HistogramStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as HistogramState;
  const highlighted = new Set(step.highlights);
  const maxHeight = Math.max(...state.heights, 1);

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Histogram</h3>
        <div className="flex items-end gap-1.5" style={{ height: MAX_BAR_HEIGHT_PX }}>
          {state.heights.map((height, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className={`w-8 rounded-t-sm ${
                  highlighted.has(String(i))
                    ? 'bg-indigo-500'
                    : i === state.currentIndex
                      ? 'bg-indigo-300'
                      : 'bg-gray-300 dark:bg-gray-600'
                }`}
                style={{ height: Math.max(4, (height / maxHeight) * MAX_BAR_HEIGHT_PX) }}
              />
              <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{height}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Stack (bottom → top, indices)</h3>
        <div className="flex flex-wrap gap-1.5">
          {state.stack.length === 0 ? (
            <span className="text-gray-400">empty</span>
          ) : (
            state.stack.map((index, i) => (
              <span
                key={i}
                className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-gray-300 bg-gray-50 px-2 font-mono text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              >
                {index}
              </span>
            ))
          )}
        </div>
      </div>

      <p className="font-medium text-gray-700 dark:text-gray-300">Max area so far: {state.maxArea}</p>
    </div>
  );
}
