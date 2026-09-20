import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.NumberOfIslandsIIState (camelCase JSON). */
interface NumberOfIslandsIIState {
  rows: number;
  cols: number;
  parent: number[];
  currentRow: number;
  currentCol: number;
  islandCount: number;
  counts: number[];
}

// One fill per island, picked by the island's root cell — each class string must appear
// literally so Tailwind's static analysis picks it up.
const ISLAND_COLORS = [
  'border-emerald-600 bg-emerald-500 text-white',
  'border-amber-600 bg-amber-500 text-white',
  'border-rose-600 bg-rose-500 text-white',
  'border-violet-600 bg-violet-500 text-white',
  'border-cyan-600 bg-cyan-500 text-white',
  'border-orange-600 bg-orange-500 text-white',
];

function findRoot(parent: number[], cell: number): number {
  let root = cell;
  while (parent[root] !== root) {
    root = parent[root];
  }
  return root;
}

export function NumberOfIslandsIIStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as NumberOfIslandsIIState;

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Grid (each island has its own color)
        </h3>
        <div className="inline-flex flex-col gap-1">
          {Array.from({ length: state.rows }, (_, r) => (
            <div key={r} className="flex gap-1">
              {Array.from({ length: state.cols }, (_, c) => {
                const cell = r * state.cols + c;
                const isLand = state.parent[cell] !== -1;
                const isCurrent = r === state.currentRow && c === state.currentCol;

                let classes = 'border-sky-200 bg-sky-50 text-sky-400 dark:border-sky-800 dark:bg-sky-950/40';
                if (isLand) {
                  classes = ISLAND_COLORS[findRoot(state.parent, cell) % ISLAND_COLORS.length];
                }
                if (isCurrent) {
                  classes += ' ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-gray-900';
                }

                return (
                  <span
                    key={c}
                    className={`transition-colors duration-200 flex h-8 w-8 items-center justify-center rounded-sm border text-xs font-mono ${classes}`}
                  >
                    {isLand ? 1 : 0}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <p className="font-medium text-gray-700 dark:text-gray-300">Islands right now: {state.islandCount}</p>

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Answer so far (island count after each addition)</h3>
        <div className="flex flex-wrap gap-1.5">
          {state.counts.length === 0 ? (
            <span className="text-gray-400">—</span>
          ) : (
            state.counts.map((count, index) => (
              <span
                key={index}
                className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-emerald-300 bg-emerald-50 px-2 font-mono text-sm text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200"
              >
                {count}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
