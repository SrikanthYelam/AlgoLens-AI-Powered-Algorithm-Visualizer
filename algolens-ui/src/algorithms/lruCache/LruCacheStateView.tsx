import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.LruCacheState (camelCase JSON). */
interface LruCacheEntry {
  key: number;
  value: number;
}

interface LruCacheState {
  capacity: number;
  order: LruCacheEntry[];
  operation: string;
  key: number;
  value: number | null;
  result: number | null;
  hit: boolean;
  evictedKey: number | null;
}

function EntryChip({ entry, role }: { entry: LruCacheEntry; role: 'touched' | 'plain' }) {
  const roleClasses =
    role === 'touched'
      ? 'border-indigo-500 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200'
      : 'border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200';

  return (
    <div
      className={`flex h-12 min-w-14 flex-col items-center justify-center rounded-md border px-2 font-mono text-sm transition-colors duration-200 ${roleClasses}`}
    >
      <span>{entry.key}</span>
      <span className="text-[10px] opacity-70">v={entry.value}</span>
    </div>
  );
}

export function LruCacheStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as LruCacheState;

  if (state.operation === '') {
    return <p className="text-sm text-gray-500 dark:text-gray-400">{step.action}</p>;
  }

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Cache (capacity {state.capacity}), most-recently-used → least-recently-used
        </h3>
        {state.order.length === 0 ? (
          <span className="text-gray-400">empty</span>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {state.order.map((entry) => (
              <EntryChip key={entry.key} entry={entry} role={entry.key === state.key ? 'touched' : 'plain'} />
            ))}
          </div>
        )}
      </div>

      <p className="text-gray-600 dark:text-gray-300">
        {state.operation === 'get' ? (
          state.hit ? (
            <>
              <span className="font-mono font-semibold">get({state.key})</span> → hit, returned{' '}
              <span className="font-mono font-semibold">{state.result}</span>.
            </>
          ) : (
            <>
              <span className="font-mono font-semibold">get({state.key})</span> → miss, returned{' '}
              <span className="font-mono font-semibold">-1</span>.
            </>
          )
        ) : (
          <>
            <span className="font-mono font-semibold">
              put({state.key}, {state.value})
            </span>
            {state.evictedKey !== null ? (
              <>
                {' '}
                → at capacity, evicted least-recently-used key{' '}
                <span className="font-mono font-semibold">{state.evictedKey}</span>.
              </>
            ) : (
              <> → inserted/updated.</>
            )}
          </>
        )}
      </p>
    </div>
  );
}
