import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.RemoveInvalidParenthesesDfsState (camelCase JSON). */
interface RemoveInvalidParenthesesDfsState {
  path: string;
  index: number;
  removeLeftBudget: number;
  removeRightBudget: number;
  results: string[];
}

function CharBox({ char }: { char: string }) {
  return (
    <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-gray-300 bg-gray-50 px-2 font-mono text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200">
      {char}
    </span>
  );
}

function StringChip({ value }: { value: string }) {
  return (
    <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-gray-300 bg-gray-50 px-2 font-mono text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200">
      {value.length === 0 ? '(empty)' : value}
    </span>
  );
}

export function RemoveInvalidParenthesesDfsStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as RemoveInvalidParenthesesDfsState;

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Path so far (scanned up to index {state.index})
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {state.path.length === 0 ? (
            <span className="text-gray-400">empty</span>
          ) : (
            [...state.path].map((char, i) => <CharBox key={i} char={char} />)
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Removal budget remaining</h3>
        <div className="flex gap-4">
          <span>
            <span className="font-mono">(</span> to remove: <span className="font-semibold">{state.removeLeftBudget}</span>
          </span>
          <span>
            <span className="font-mono">)</span> to remove: <span className="font-semibold">{state.removeRightBudget}</span>
          </span>
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
            state.results.map((result, i) => <StringChip key={i} value={result} />)
          )}
        </div>
      </div>
    </div>
  );
}
