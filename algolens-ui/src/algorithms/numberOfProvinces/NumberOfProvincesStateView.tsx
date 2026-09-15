import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.NumberOfProvincesState (camelCase JSON). */
interface NumberOfProvincesState {
  n: number;
  parent: number[];
  currentI: number;
  currentJ: number;
  components: number;
}

function Box({ index, value, highlighted }: { index: number; value: number; highlighted: boolean }) {
  const isRoot = value === index;
  const roleClasses = highlighted
    ? 'border-rose-500 bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200'
    : isRoot
      ? 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-200'
      : 'border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200';

  return (
    <div className="flex flex-col items-center gap-0.5">
      <span
        className={`transition-colors duration-200 inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 font-mono text-sm ${roleClasses}`}
      >
        {value}
      </span>
      <span className="text-[10px] text-gray-400">{index}</span>
    </div>
  );
}

export function NumberOfProvincesStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as NumberOfProvincesState;

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Union-Find parent array (root = same value as index)
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {state.parent.map((value, index) => (
            <Box
              key={index}
              index={index}
              value={value}
              highlighted={index === state.currentI || index === state.currentJ}
            />
          ))}
        </div>
      </div>

      <p className="font-medium text-gray-700 dark:text-gray-300">
        Provinces so far: <span className="font-mono font-semibold">{state.components}</span>
      </p>
    </div>
  );
}
