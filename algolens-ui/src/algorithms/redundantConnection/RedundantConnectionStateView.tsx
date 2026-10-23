import { Cell, CellRow, Legend, VizSection, VizStack, Verdict } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.RedundantConnectionState (camelCase JSON). */
interface RedundantConnectionState {
  n: number;
  parent: number[];
  currentU: number;
  currentV: number;
  answer: number[] | null;
}

export function RedundantConnectionStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as RedundantConnectionState;

  return (
    <VizStack>
      <VizSection
        title={
          <>
            Union-Find parent array (node 0 is unused; nodes are 1-indexed) ·{' '}
            <Legend state="range">root (parent = own index)</Legend> <Legend state="current">edge endpoints</Legend>
          </>
        }
      >
        <CellRow>
          {state.parent.map((value, index) =>
            index === 0 ? null : (
              <Cell
                key={index}
                value={value}
                index={index}
                state={
                  index === state.currentU || index === state.currentV ? 'current' : value === index ? 'range' : 'plain'
                }
              />
            ),
          )}
        </CellRow>
      </VizSection>

      {state.answer ? (
        <Verdict ok>
          Redundant edge: ({state.answer[0]}, {state.answer[1]})
        </Verdict>
      ) : (
        <p className="font-medium text-ink">
          Edge ({state.currentU}, {state.currentV}) unioned.
        </p>
      )}
    </VizStack>
  );
}
