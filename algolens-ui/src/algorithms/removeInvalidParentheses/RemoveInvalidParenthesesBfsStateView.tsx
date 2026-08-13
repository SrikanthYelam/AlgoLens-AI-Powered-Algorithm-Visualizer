import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.RemoveInvalidParenthesesBfsState (camelCase JSON). */
interface RemoveInvalidParenthesesBfsState {
  current: string;
  level: number;
  frontier: string[];
  results: string[];
}

function StringChip({ value, highlighted }: { value: string; highlighted: boolean }) {
  return (
    <span
      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 font-mono text-sm ${
        highlighted
          ? 'border-indigo-500 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200'
          : 'border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
      }`}
    >
      {value.length === 0 ? '(empty)' : value}
    </span>
  );
}

export function RemoveInvalidParenthesesBfsStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as RemoveInvalidParenthesesBfsState;

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Level {state.level}</h3>
        <StringChip value={state.current} highlighted />
      </div>

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Frontier ({state.frontier.length})
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {state.frontier.length === 0 ? (
            <span className="text-gray-400">empty</span>
          ) : (
            state.frontier.map((candidate, i) => (
              <StringChip key={i} value={candidate} highlighted={candidate === state.current} />
            ))
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Results found ({state.results.length})
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {state.results.length === 0 ? (
            <span className="text-gray-400">none yet</span>
          ) : (
            state.results.map((result, i) => <StringChip key={i} value={result} highlighted={false} />)
          )}
        </div>
      </div>
    </div>
  );
}
