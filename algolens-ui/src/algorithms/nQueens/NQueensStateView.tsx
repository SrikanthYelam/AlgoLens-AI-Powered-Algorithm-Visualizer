import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.NQueensState (camelCase JSON). */
interface NQueensState {
  boardSize: number;
  queenColumns: number[];
  solutions: number[][];
}

export function NQueensStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as NQueensState;
  const highlighted = new Set(step.highlights);

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Board</h3>
        <div className="inline-flex flex-col gap-1">
          {Array.from({ length: state.boardSize }, (_, row) => (
            <div key={row} className="flex gap-1">
              {Array.from({ length: state.boardSize }, (_, col) => {
                const hasQueen = row < state.queenColumns.length && state.queenColumns[row] === col;
                const isCurrent = highlighted.has(`${row},${col}`);

                return (
                  <span
                    key={col}
                    className={`transition-colors duration-200 flex h-9 w-9 items-center justify-center rounded-sm border text-lg ${
                      isCurrent
                        ? 'border-indigo-500 bg-indigo-200 dark:bg-indigo-900/50'
                        : (row + col) % 2 === 0
                          ? 'border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800'
                          : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900'
                    }`}
                  >
                    {hasQueen ? '♛' : ''}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <p className="font-medium text-gray-700 dark:text-gray-300">Solutions found: {state.solutions.length}</p>
    </div>
  );
}
