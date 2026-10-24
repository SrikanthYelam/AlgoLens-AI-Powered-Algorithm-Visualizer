import { ForestDiagram, GraphDiagram, type GraphEdge } from '../../components/graphs';
import { Legend, VizSection, VizStack, Verdict } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.RedundantConnectionState (camelCase JSON). */
interface RedundantConnectionState {
  n: number;
  parent: number[];
  currentU: number;
  currentV: number;
  answer: number[] | null;
}

export function RedundantConnectionStateView({ step, input }: AlgorithmStateViewProps) {
  const state = step.state as RedundantConnectionState;
  const list = (input as { edges?: number[][] } | undefined)?.edges ?? [];

  // The edge being processed is bright; if it is the redundant one it turns dashed (it closes a cycle).
  const edges: GraphEdge[] = list.map(([u, v]) => ({
    from: u,
    to: v,
    state: u === state.currentU && v === state.currentV ? (state.answer ? 'discarded' : 'active') : 'plain',
  }));
  const nodeState = (node: number) => (node === state.currentU || node === state.currentV ? 'current' : 'plain');
  const nodes = state.parent.map((_, node) => node).filter((node) => node !== 0);

  return (
    <VizStack>
      <div className="grid grid-cols-1 items-start gap-x-8 gap-y-4 sm:grid-cols-2">
        <VizSection
          title={
            <>
              Graph (n nodes, n edges — exactly one closes a cycle) · <Legend state="current">edge being added</Legend>
            </>
          }
        >
          <GraphDiagram edges={edges} nodes={nodes.map((node) => ({ id: node, state: nodeState(node) }))} />
        </VizSection>

        <VizSection title="Union-Find forest — an edge whose ends already share a root closes a cycle">
          <ForestDiagram
            parent={state.parent}
            skipZero
            states={Object.fromEntries(nodes.map((node) => [node, nodeState(node)]))}
          />
        </VizSection>
      </div>

      {state.answer ? (
        <Verdict ok>
          Redundant edge: ({state.answer[0]}, {state.answer[1]}) — both ends were already connected
        </Verdict>
      ) : (
        <p className="font-medium text-ink">
          Edge ({state.currentU}, {state.currentV}) joined two separate trees.
        </p>
      )}
    </VizStack>
  );
}
