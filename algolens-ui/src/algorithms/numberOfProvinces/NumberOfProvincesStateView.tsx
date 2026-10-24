import { ForestDiagram, GraphDiagram, type GraphEdge } from '../../components/graphs';
import { Legend, VizSection, VizStack } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.NumberOfProvincesState (camelCase JSON). */
interface NumberOfProvincesState {
  n: number;
  parent: number[];
  currentI: number;
  currentJ: number;
  components: number;
}

export function NumberOfProvincesStateView({ step, input }: AlgorithmStateViewProps) {
  const state = step.state as NumberOfProvincesState;
  const isConnected = (input as { isConnected?: number[][] } | undefined)?.isConnected ?? [];

  const edges: GraphEdge[] = [];
  isConnected.forEach((row, i) =>
    row.forEach((linked, j) => {
      if (j > i && linked === 1) {
        edges.push({
          from: i,
          to: j,
          state: i === state.currentI && j === state.currentJ ? 'active' : 'plain',
        });
      }
    }),
  );
  const cityState = (city: number) => (city === state.currentI || city === state.currentJ ? 'current' : 'plain');

  return (
    <VizStack>
      <div className="grid grid-cols-1 items-start gap-x-8 gap-y-4 sm:grid-cols-2">
        <VizSection
          title={
            <>
              Cities and direct connections · <Legend state="current">pair being unioned</Legend>
            </>
          }
        >
          <GraphDiagram
            edges={edges}
            nodes={state.parent.map((_, city) => ({
              id: city,
              state: cityState(city),
            }))}
          />
        </VizSection>

        <VizSection title="Union-Find forest — one tree per province; a union hangs one root under another">
          <ForestDiagram
            parent={state.parent}
            states={Object.fromEntries(state.parent.map((_, city) => [city, cityState(city)]))}
          />
        </VizSection>
      </div>

      <p className="font-medium text-ink">
        Provinces so far: <span className="font-mono font-semibold">{state.components}</span>
      </p>
    </VizStack>
  );
}
