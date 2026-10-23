import { Cell, Chain, Empty, VizSection, VizStack } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.ReconstructItineraryState (camelCase JSON). */
interface ReconstructItineraryState {
  remainingGraph: Record<string, string[]>;
  stack: string[];
  postOrder: string[];
  itinerary: string[] | null;
}

function AirportChain({ airports, highlightLast }: { airports: string[]; highlightLast?: boolean }) {
  if (airports.length === 0) {
    return <Empty>none yet</Empty>;
  }
  return (
    <Chain>
      {airports.map((airport, i) => (
        <Cell key={i} value={airport} state={highlightLast && i === airports.length - 1 ? 'current' : 'plain'} />
      ))}
    </Chain>
  );
}

export function ReconstructItineraryStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as ReconstructItineraryState;
  const isDone = step.action.startsWith('Done:');
  const topOfStack = state.stack[state.stack.length - 1];
  const remainingEntries = Object.entries(state.remainingGraph).filter(([, destinations]) => destinations.length > 0);

  return (
    <VizStack>
      <VizSection title="Remaining flights (sorted, smallest destination first)">
        <div className="flex flex-col gap-1.5">
          {remainingEntries.length === 0 ? (
            <Empty>none left</Empty>
          ) : (
            remainingEntries.map(([from, destinations]) => (
              <div key={from} className="flex flex-wrap items-center gap-1.5">
                <Cell value={from} state={from === topOfStack ? 'current' : 'plain'} />
                <span aria-hidden="true" className="text-ink-subtle">
                  →
                </span>
                {destinations.map((to, i) => (
                  <Cell key={i} value={to} />
                ))}
              </div>
            ))
          )}
        </div>
      </VizSection>

      <VizSection title="DFS stack (current path)">
        <AirportChain airports={state.stack} highlightLast />
      </VizSection>

      <VizSection title="Backtracked so far (reverse order — flipped once the search finishes)">
        <AirportChain airports={state.postOrder} />
      </VizSection>

      {isDone && state.itinerary && (
        <VizSection title="Final itinerary">
          <Chain>
            {state.itinerary.map((airport, i) => (
              <Cell key={i} value={airport} state="found" />
            ))}
          </Chain>
        </VizSection>
      )}
    </VizStack>
  );
}
