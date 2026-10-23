import type { AlgorithmStateViewProps } from '../../types/algorithm';
import { TreeDiagram } from '../../components/TreeDiagram';
import { Cell, CellRow, Legend, VizSection, VizStack, type VizState } from '../../components/viz';

/** Mirrors AlgoLens.Core.Models.ConstructBinaryTreeState (camelCase JSON). Note: `root` is a
 * judge-only field carrying the raw constructed tree; it's not rendered here. */
interface ConstructBinaryTreeState {
  preorder: number[];
  inorder: number[];
  preorderIndex: number;
  inorderStart: number;
  inorderEnd: number;
  tree: (number | null)[];
}

export function ConstructBinaryTreeStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as ConstructBinaryTreeState;
  const currentRootVal = state.preorder[state.preorderIndex];
  const treeRoles = currentRootVal !== undefined ? { [currentRootVal]: 'current' as const } : {};

  return (
    <VizStack>
      <VizSection title="Preorder">
        <CellRow>
          {state.preorder.map((v, i) => (
            <Cell key={i} value={v} size="sm" state={i === state.preorderIndex ? 'current' : 'plain'} />
          ))}
        </CellRow>
      </VizSection>

      <VizSection
        title={
          <>
            Inorder <Legend state="range">current subtree's range</Legend>
          </>
        }
      >
        <CellRow>
          {state.inorder.map((v, i) => {
            const cellState: VizState = i >= state.inorderStart && i <= state.inorderEnd ? 'range' : 'visited';
            return <Cell key={i} value={v} size="sm" state={cellState} />;
          })}
        </CellRow>
      </VizSection>

      <VizSection title="Tree so far">
        <TreeDiagram tree={state.tree} roles={treeRoles} />
      </VizSection>
    </VizStack>
  );
}
