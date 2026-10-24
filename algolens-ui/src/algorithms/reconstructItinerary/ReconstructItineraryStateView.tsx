import { GraphDiagram, type GraphEdge } from '../../components/graphs';
import { Cell, Chain, Empty, Legend, VizSection, VizStack, type VizState } from '../../components/viz';
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

export function ReconstructItineraryStateView({ step, input }: AlgorithmStateViewProps) {
  const state = step.state as ReconstructItineraryState;
  const isDone = step.action.startsWith('Done:');
  const topOfStack = state.stack[state.stack.length - 1];
  const tickets = (input as { tickets?: string[][] } | undefined)?.tickets ?? [];

  // Tickets between the same two airports collapse into one edge labelled remaining/total.
  const totals = new Map<string, number>();
  for (const [from, to] of tickets) totals.set(`${from}>${to}`, (totals.get(`${from}>${to}`) ?? 0) + 1);
  const onStack = new Set(state.stack.slice(1).map((airport, i) => `${state.stack[i]}>${airport}`));
  const edges: GraphEdge[] = [...totals].map(([key, total]) => {
    const [from, to] = key.split('>');
    const remaining = (state.remainingGraph[from] ?? []).filter((dest) => dest === to).length;
    return {
      from,
      to,
      label: total > 1 ? `${remaining}/${total}` : undefined,
      state: remaining === total ? 'plain' : onStack.has(key) ? 'active' : 'dim',
    };
  });
  const airports = [...new Set(tickets.flat())].sort();
  const nodeState = (airport: string): VizState =>
    airport === topOfStack ? 'current' : state.stack.includes(airport) ? 'comparing' : state.postOrder.includes(airport) ? 'visited' : 'plain';

  return (
    <VizStack>
      <VizSection
        title={
          <>
            Flight graph · <Legend state="current">where we are</Legend> <Legend state="comparing">on the DFS path</Legend>{' '}
            <Legend state="visited">finished</Legend> · bright edge = flight on the path, dim = flight already used
          </>
        }
      >
        <GraphDiagram directed edges={edges} nodes={airports.map((airport) => ({ id: airport, state: nodeState(airport) }))} />
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
