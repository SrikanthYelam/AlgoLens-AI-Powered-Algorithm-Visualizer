import type { AlgorithmStateViewProps } from '../../types/algorithm';
import { TreeDiagram } from '../../components/TreeDiagram';
import { Cell, CellRow, VizSection, VizStack } from '../../components/viz';

/** Mirrors AlgoLens.Core.Models.RecoverBstState (camelCase JSON). */
interface RecoverBstState {
  tree: (number | null)[];
  currentVal: number | null;
  prevVal: number | null;
  firstVal: number | null;
  secondVal: number | null;
}

export function RecoverBstStateView({ step, history = [] }: AlgorithmStateViewProps) {
  const state = step.state as RecoverBstState;

  const roles: Record<number, 'current' | 'path' | 'muted'> = {};
  if (state.firstVal !== null) {
    roles[state.firstVal] = 'path';
  }
  if (state.secondVal !== null) {
    roles[state.secondVal] = 'path';
  }
  if (state.currentVal !== null) {
    roles[state.currentVal] = 'current';
  }

  // The inorder sequence seen so far: in a valid BST it only ever rises, so every drop marks a swapped node.
  const sequence: number[] = [];
  for (const h of history) {
    const value = (h.state as RecoverBstState).currentVal;
    if (value !== null && sequence[sequence.length - 1] !== value) sequence.push(value);
  }

  return (
    <VizStack>
      <TreeDiagram tree={state.tree} roles={roles} />

      <VizSection title="Inorder sequence so far — should only increase; a drop is a swapped node">
        <CellRow>
          {sequence.map((value, i) => {
            const dips = i > 0 && value < sequence[i - 1];
            return (
              <Cell
                key={i}
                size="sm"
                value={value}
                state={i === sequence.length - 1 && state.currentVal !== null ? 'current' : dips ? 'comparing' : 'plain'}
                pointer={dips ? 'drop' : ''}
              />
            );
          })}
        </CellRow>
      </VizSection>
      <p className="font-medium text-ink">
        {state.firstVal !== null ? (
          <>
            Misplaced so far: {state.firstVal}
            {state.secondVal !== null && <> and {state.secondVal}</>}
          </>
        ) : (
          'No violation found yet'
        )}
      </p>
    </VizStack>
  );
}
