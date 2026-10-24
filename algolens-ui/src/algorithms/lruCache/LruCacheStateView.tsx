import { HashTable, LinkedListRow } from '../../components/structures';
import { EntryCell, VizSection, VizStack } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';
import { previousStepOf } from '../../utils/history';

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

export function LruCacheStateView({ step, history }: AlgorithmStateViewProps) {
  const state = step.state as LruCacheState;
  const prev = previousStepOf(history)?.state as LruCacheState | undefined;
  const prevOrder = prev?.order ?? [];

  if (state.operation === '') {
    return <p className="text-body-sm text-ink-subtle">{step.action}</p>;
  }

  const evicted = state.evictedKey === null ? undefined : prevOrder.find((entry) => entry.key === state.evictedKey);

  // What happened to the touched entry, read off its position in the previous step.
  const caption = (entry: LruCacheEntry) => {
    if (entry.key !== state.key) return '';
    const before = prevOrder.findIndex((e) => e.key === entry.key);
    if (before === -1) return '↓ new at front';
    return before > 0 ? '↑ moved to front' : '';
  };

  const nodes = state.order.map((entry, i) => (
    <div key={entry.key} className="flex flex-col items-center gap-0.5">
      <EntryCell entryKey={entry.key} value={entry.value} state={entry.key === state.key ? 'current' : 'plain'} />
      <span className="h-4 font-mono text-caption leading-none text-accent-hover">{caption(entry)}</span>
      <span className="font-mono text-caption text-ink-subtle">
        {i === 0 ? 'MRU' : i === state.order.length - 1 ? 'LRU' : ''}
      </span>
    </div>
  ));

  const rows = [
    ...state.order
      .slice()
      .sort((a, b) => a.key - b.key)
      .map((entry) => ({
        key: entry.key,
        target: `node v=${entry.value}`,
        state: entry.key === state.key ? ('current' as const) : ('plain' as const),
      })),
    ...(evicted ? [{ key: evicted.key, target: `node v=${evicted.value}`, state: 'discarded' as const }] : []),
  ];

  return (
    <VizStack>
      <VizSection title={`Doubly linked list (capacity ${state.capacity}) — HEAD side is most recently used`}>
        <LinkedListRow
          items={nodes}
          ghost={evicted && <EntryCell entryKey={evicted.key} value={evicted.value} state="discarded" />}
        />
      </VizSection>

      <VizSection title="Hash map (O(1) lookup straight to the node)">
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
                → at capacity, evicted least-recently-used key{' '}
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
