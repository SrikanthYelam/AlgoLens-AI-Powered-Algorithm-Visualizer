import { EntryCell, Empty, VizSection, VizStack } from '../../components/viz';
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
    return <p className="text-body-sm text-ink-subtle">{step.action}</p>;
  }

  const groups = groupByFreq(state.order);

  return (
    <VizStack>
      <VizSection title={`Cache (capacity ${state.capacity}), grouped by frequency — most-recently-used → least-recently-used within each`}>
        {groups.length === 0 ? (
          <Empty>empty</Empty>
        ) : (
          <div className="flex flex-col gap-2">
            {groups.map((group) => (
              <div key={group.freq} className="flex items-center gap-2">
                <span className="w-20 shrink-0 font-mono text-caption text-ink-subtle">
                  freq {group.freq}
                  {group.freq === state.minFreq ? ' (min)' : ''}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {group.entries.map((entry) => (
                    <EntryCell key={entry.key} entryKey={entry.key} value={entry.value} state={entry.key === state.key ? 'current' : 'plain'} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </VizSection>

      <p className="text-ink-muted">
        {state.operation === 'get' ? (
          state.hit ? (
            <>
              <span className="font-mono font-semibold text-ink">get({state.key})</span> → hit, returned{' '}
              <span className="font-mono font-semibold text-ink">{state.result}</span>.
            </>
          ) : (
            <>
              <span className="font-mono font-semibold text-ink">get({state.key})</span> → miss, returned{' '}
              <span className="font-mono font-semibold text-ink">-1</span>.
            </>
          )
        ) : (
          <>
            <span className="font-mono font-semibold text-ink">
              put({state.key}, {state.value})
            </span>
            {state.evictedKey !== null ? (
              <>
                {' '}
                → at capacity, evicted least-frequently (then least-recently) used key{' '}
                <span className="font-mono font-semibold text-ink">{state.evictedKey}</span>.
              </>
            ) : (
              <> → inserted/updated.</>
            )}
          </>
        )}
      </p>
    </VizStack>
  );
}
