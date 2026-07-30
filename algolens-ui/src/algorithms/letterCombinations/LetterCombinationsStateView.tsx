import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.LetterCombinationsState (camelCase JSON). */
interface LetterCombinationsState {
  path: string;
  solutions: string[];
}

function LetterBox({ letter, highlighted }: { letter: string; highlighted: boolean }) {
  return (
    <span
      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 font-mono text-sm uppercase ${
        highlighted
          ? 'border-indigo-500 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200'
          : 'border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
      }`}
    >
      {letter}
    </span>
  );
}

export function LetterCombinationsStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as LetterCombinationsState;
  const highlighted = new Set(step.highlights);

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Current path</h3>
        <div className="flex flex-wrap gap-1.5">
          {state.path.length === 0 ? (
            <span className="text-gray-400">empty</span>
          ) : (
            [...state.path].map((letter, i) => (
              <LetterBox key={i} letter={letter} highlighted={i === state.path.length - 1 && highlighted.has(letter)} />
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
                {[...solution].map((letter, j) => (
                  <LetterBox key={j} letter={letter} highlighted={false} />
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
