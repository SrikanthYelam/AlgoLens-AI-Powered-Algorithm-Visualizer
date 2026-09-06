import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.UniqueBstCountState (camelCase JSON). */
interface UniqueBstCountState {
  n: number;
  table: number[];
  currentI: number;
  currentJ: number;
  contribution: number;
}

function Box({ index, value, role }: { index: number; value: number; role: 'target' | 'source' | 'plain' }) {
  const roleClasses =
    role === 'target'
      ? 'border-indigo-500 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200'
      : role === 'source'
        ? 'border-emerald-400 bg-emerald-50 text-emerald-800 dark:border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-200'
        : 'border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200';

  return (
    <div className="flex flex-col items-center gap-0.5">
      <span
        className={`transition-colors duration-200 inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 font-mono text-sm ${roleClasses}`}
      >
        {value}
      </span>
      <span className="text-[10px] text-gray-400">dp[{index}]</span>
    </div>
  );
}

export function UniqueBinarySearchTreesStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as UniqueBstCountState;
  const leftIndex = state.currentJ - 1;
  const rightIndex = state.currentI - state.currentJ;

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          dp table (dp[k] = unique BSTs over k nodes)
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {state.table.map((value, index) => (
            <Box
              key={index}
              index={index}
              value={value}
              role={
                index === state.currentI
                  ? 'target'
                  : index === leftIndex || index === rightIndex
                    ? 'source'
                    : 'plain'
              }
            />
          ))}
        </div>
      </div>

      {state.currentI > 0 && (
        <p className="text-gray-600 dark:text-gray-300">
          Root <span className="font-mono font-semibold">{state.currentJ}</span>: dp[{leftIndex}] (
          {state.table[leftIndex]}) × dp[{rightIndex}] ({state.table[rightIndex]}) ={' '}
          <span className="font-mono font-semibold">{state.contribution}</span> added to dp[{state.currentI}].
        </p>
      )}
    </div>
  );
}
