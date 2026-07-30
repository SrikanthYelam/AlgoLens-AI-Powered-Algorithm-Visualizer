import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.TreeTraversalState (camelCase JSON). */
interface TreeTraversalState {
  queue: (number | null)[];
  completedLevels: number[][];
  currentLevelInProgress: number[];
}

function NodeBox({ value, highlighted }: { value: number | null; highlighted: boolean }) {
  return (
    <span
      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 font-mono text-sm ${
        highlighted
          ? 'border-indigo-500 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200'
          : 'border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
      }`}
    >
      {value === null ? '·' : value}
    </span>
  );
}

export function TreeStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as TreeTraversalState;
  const highlighted = new Set(step.highlights);

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Queue</h3>
        <div className="flex flex-wrap gap-1.5">
          {state.queue.length === 0 ? (
            <span className="text-gray-400">empty</span>
          ) : (
            state.queue.map((value, i) => (
              <NodeBox key={i} value={value} highlighted={value !== null && highlighted.has(String(value))} />
            ))
          )}
        </div>
      </div>

      {state.currentLevelInProgress.length > 0 && (
        <div>
          <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Current level (in progress)</h3>
          <div className="flex flex-wrap gap-1.5">
            {state.currentLevelInProgress.map((value, i) => (
              <NodeBox key={i} value={value} highlighted={highlighted.has(String(value))} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Completed levels</h3>
        {state.completedLevels.length === 0 ? (
          <span className="text-gray-400">none yet</span>
        ) : (
          <div className="flex flex-col gap-1.5">
            {state.completedLevels.map((level, i) => (
              <div key={i} className="flex flex-wrap items-center gap-1.5">
                <span className="w-16 shrink-0 text-xs text-gray-400">Level {i}</span>
                {level.map((value, j) => (
                  <NodeBox key={j} value={value} highlighted={highlighted.has(String(value))} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
