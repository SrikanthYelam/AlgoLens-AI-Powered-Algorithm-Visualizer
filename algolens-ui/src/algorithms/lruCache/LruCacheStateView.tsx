import { EntryCell, Empty, VizSection, VizStack } from '../../components/viz';
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

export function LruCacheStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as LruCacheState;

  if (state.operation === '') {
    return <p className="text-body-sm text-ink-subtle">{step.action}</p>;
  }

  return (
    <VizStack>
      <VizSection title={`Cache (capacity ${state.capacity}), most-recently-used → least-recently-used`}>
        {state.order.length === 0 ? (
          <Empty>empty</Empty>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {state.order.map((entry) => (
              <EntryCell key={entry.key} entryKey={entry.key} value={entry.value} state={entry.key === state.key ? 'current' : 'plain'} />
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
