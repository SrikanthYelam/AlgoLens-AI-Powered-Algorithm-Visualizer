import type { AlgorithmStateViewProps } from '../../types/algorithm';
import { TreeDiagram } from '../../components/TreeDiagram';
import { Cell, CellRow, Empty, Legend, VizSection, VizStack } from '../../components/viz';

/** Mirrors AlgoLens.Core.Models.SortedListToBstState (camelCase JSON). Note: `root` is a
 * judge-only field carrying the raw constructed tree; it's not rendered here. */
interface SortedListToBstState {
  segment: number[];
  middleIndex: number;
  tree: (number | null)[];
}

export function SortedListToBstStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as SortedListToBstState;
  const middleVal = state.segment[state.middleIndex];
  const treeRoles = middleVal !== undefined ? { [middleVal]: 'current' as const } : {};

  return (
    <VizStack>
      <VizSection
        title={
          <>
            Current list segment <Legend state="current">slow/fast pointers land here</Legend>
          </>
        }
      >
        <CellRow>
          {state.segment.length === 0 ? (
            <Empty>none</Empty>
          ) : (
            state.segment.map((v, i) => <Cell key={i} value={v} state={i === state.middleIndex ? 'current' : 'plain'} />)
          )}
        </CellRow>
      </VizSection>

      <VizSection title="Tree so far">
        <TreeDiagram tree={state.tree} roles={treeRoles} />
      </VizSection>
    </VizStack>
  );
}
