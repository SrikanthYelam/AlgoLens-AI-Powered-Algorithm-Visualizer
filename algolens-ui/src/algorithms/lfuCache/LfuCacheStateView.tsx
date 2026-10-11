import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.LfuCacheState (camelCase JSON). */
interface LfuCacheEntry {
  key: number;
  value: number;
  freq: number;
}

interface LfuCacheState {
  capacity: number;
  order: LfuCacheEntry[];
  minFreq: number;
  operation: string;
  key: number;
  value: number | null;
  result: number | null;
  hit: boolean;
  evictedKey: number | null;
}

function EntryChip({ entry, role }: { entry: LfuCacheEntry; role: 'touched' | 'plain' }) {
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

/** Groups entries by frequency, preserving the backend's freq-ascending, MRU-first order. */
function groupByFreq(order: LfuCacheEntry[]): Array<{ freq: number; entries: LfuCacheEntry[] }> {
  const groups: Array<{ freq: number; entries: LfuCacheEntry[] }> = [];
  for (const entry of order) {
    const last = groups[groups.length - 1];
    if (last && last.freq === entry.freq) {
      last.entries.push(entry);
    } else {
      groups.push({ freq: entry.freq, entries: [entry] });
    }
  }
  return groups;
}

export function LfuCacheStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as LfuCacheState;

  if (state.operation === '') {
    return <p className="text-sm text-gray-500 dark:text-gray-400">{step.action}</p>;
  }

  const groups = groupByFreq(state.order);

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Cache (capacity {state.capacity}), grouped by frequency — most-recently-used → least-recently-used within
          each
        </h3>
        {groups.length === 0 ? (
          <span className="text-gray-400">empty</span>
        ) : (
          <div className="flex flex-col gap-2">
            {groups.map((group) => (
              <div key={group.freq} className="flex items-center gap-2">
                <span className="w-20 shrink-0 text-xs text-gray-500 dark:text-gray-400">
                  freq {group.freq}
                  {group.freq === state.minFreq ? ' (min)' : ''}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {group.entries.map((entry) => (
                    <EntryChip key={entry.key} entry={entry} role={entry.key === state.key ? 'touched' : 'plain'} />
                  ))}
                </div>
              </div>
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
                → at capacity, evicted least-frequently (then least-recently) used key{' '}
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
