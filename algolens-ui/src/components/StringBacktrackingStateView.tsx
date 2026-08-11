import type { AlgorithmStateViewProps } from '../types/algorithm';

/**
 * Mirrors AlgoLens.Core.Models.StringBacktrackingState (camelCase JSON). Shared by
 * every backtracking algorithm whose solutions are strings (Letter Combinations of a
 * Phone Number, Generate Parentheses) — used directly as their StateView.
 */
interface StringBacktrackingState {
  path: string;
  solutions: string[];
}

function CharBox({ char, highlighted }: { char: string; highlighted: boolean }) {
  return (
    <span
      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 font-mono text-sm uppercase ${
        highlighted
          ? 'border-indigo-500 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200'
          : 'border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
      }`}
    >
      {char}
    </span>
  );
}

export function StringBacktrackingStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as StringBacktrackingState;
  const highlighted = new Set(step.highlights);

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Current path</h3>
        <div className="flex flex-wrap gap-1.5">
          {state.path.length === 0 ? (
            <span className="text-gray-400">empty</span>
          ) : (
            [...state.path].map((char, i) => (
              <CharBox key={i} char={char} highlighted={i === state.path.length - 1 && highlighted.has(char)} />
            ))
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Solutions found ({state.solutions.length})
        </h3>
        <div className="flex max-h-48 flex-col gap-1 overflow-y-auto">
          {state.solutions.length === 0 ? (
            <span className="text-gray-400">none yet</span>
          ) : (
            state.solutions.map((solution, i) => (
              <div key={i} className="flex flex-wrap gap-1">
                {[...solution].map((char, j) => (
                  <CharBox key={j} char={char} highlighted={false} />
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
