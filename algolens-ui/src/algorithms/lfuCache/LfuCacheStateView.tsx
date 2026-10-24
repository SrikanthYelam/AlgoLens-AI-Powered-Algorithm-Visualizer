import { HashTable, LinkedListRow } from '../../components/structures';
import { EntryCell, Empty, VizSection, VizStack } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';
import { previousStepOf } from '../../utils/history';

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

export function LfuCacheStateView({ step, history }: AlgorithmStateViewProps) {
  const state = step.state as LfuCacheState;
  const prev = previousStepOf(history)?.state as LfuCacheState | undefined;
  const prevOrder = prev?.order ?? [];

  if (state.operation === '') {
    return <p className="text-body-sm text-ink-subtle">{step.action}</p>;
  }

  const evicted = state.evictedKey === null ? undefined : prevOrder.find((entry) => entry.key === state.evictedKey);
  const groups = groupByFreq(state.order);
  // The evicted entry's frequency list may now be empty, but it should still show what left it.
  if (evicted && !groups.some((group) => group.freq === evicted.freq)) {
    groups.push({ freq: evicted.freq, entries: [] });
    groups.sort((a, b) => a.freq - b.freq);
  }

  // The touched entry moves from its old frequency list to the next one.
  const caption = (entry: LfuCacheEntry) => {
    if (entry.key !== state.key) return '';
    const before = prevOrder.find((e) => e.key === entry.key);
    return before ? `↑ freq ${before.freq} → ${entry.freq}` : '↓ new, freq 1';
  };

  const rows = [
    ...state.order
      .slice()
      .sort((a, b) => a.key - b.key)
      .map((entry) => ({
        key: entry.key,
        target: `node v=${entry.value} · freq ${entry.freq}`,
        state: entry.key === state.key ? ('current' as const) : ('plain' as const),
      })),
    ...(evicted ? [{ key: evicted.key, target: `node v=${evicted.value} · freq ${evicted.freq}`, state: 'discarded' as const }] : []),
  ];

  return (
    <VizStack>
      <VizSection title={`One linked list per frequency (capacity ${state.capacity}) — within a list, HEAD side is most recently used`}>
        {groups.length === 0 ? (
          <Empty>empty</Empty>
        ) : (
          <div className="flex flex-col gap-3">
            {groups.map((group) => (
              <div key={group.freq} className="flex flex-wrap items-center gap-3">
                <span className="w-44 shrink-0 font-mono text-caption text-ink-subtle">
                  freq {group.freq}
                  {group.freq === state.minFreq ? ' · min ◂ evicts here' : ''}
                </span>
                <LinkedListRow
                  items={group.entries.map((entry) => (
                    <div key={entry.key} className="flex flex-col items-center gap-0.5">
                      <EntryCell entryKey={entry.key} value={entry.value} state={entry.key === state.key ? 'current' : 'plain'} />
                      <span className="h-4 font-mono text-caption leading-none text-accent-hover">{caption(entry)}</span>
                    </div>
                  ))}
                  ghost={
                    evicted && evicted.freq === group.freq ? (
                      <EntryCell entryKey={evicted.key} value={evicted.value} state="discarded" />
                    ) : undefined
                  }
                />
              </div>
            ))}
          </div>
        )}
      </VizSection>

      <VizSection title="Hash map (key → node, which remembers its own frequency)">
        <HashTable rows={rows} />
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
