import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.IslandsState (camelCase JSON). */
interface IslandsState {
  grid: number[][];
  visited: number[][];
  islandCount: number;
  currentRow: number;
  currentCol: number;
}

export function IslandsStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as IslandsState;

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Grid</h3>
        <div className="inline-flex flex-col gap-1">
          {state.grid.map((row, r) => (
            <div key={r} className="flex gap-1">
              {row.map((cell, c) => {
                const isCurrent = r === state.currentRow && c === state.currentCol;
                const isVisitedLand = cell === 1 && state.visited[r]?.[c] === 1;

                return (
                  <span
                    key={c}
                    className={`transition-colors duration-200 flex h-8 w-8 items-center justify-center rounded-sm border text-xs font-mono ${
                      isCurrent
                        ? 'border-indigo-500 bg-indigo-400 text-white'
                        : isVisitedLand
                          ? 'border-emerald-600 bg-emerald-500 text-white'
                          : cell === 1
                            ? 'border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'
                            : 'border-sky-200 bg-sky-50 text-sky-400 dark:border-sky-800 dark:bg-sky-950/40'
                    }`}
                  >
                    {cell}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <p className="font-medium text-gray-700 dark:text-gray-300">Islands found: {state.islandCount}</p>
    </div>
  );
}
