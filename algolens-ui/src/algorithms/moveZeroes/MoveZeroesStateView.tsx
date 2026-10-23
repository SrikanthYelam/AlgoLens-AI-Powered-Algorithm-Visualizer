import { Cell, CellRow, Legend, VizSection, VizStack, type VizState } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.MoveZeroesState (camelCase JSON). */
interface MoveZeroesState {
  nums: number[];
  read: number;
  write: number;
}

export function MoveZeroesStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as MoveZeroesState;

  return (
    <VizStack>
      <VizSection
        title={
          <>
            Array (<Legend state="found">✓ non-zeros gathered</Legend> <Legend state="visited">zeros passed</Legend>{' '}
            ringed = being read)
          </>
        }
      >
        <CellRow>
          {state.nums.map((value, i) => {
            const cellState: VizState =
              i < state.write ? 'found' : state.read < 0 || i <= state.read ? 'visited' : 'plain';
            const pointers = [i === state.write ? 'write' : null, i === state.read ? 'read' : null].filter(Boolean);

            return (
              <Cell
                key={i}
                value={value}
                state={cellState}
                index={i}
                ring={i === state.read}
                pointer={pointers.length > 0 ? pointers.join('/') : null}
              />
            );
          })}
        </CellRow>
      </VizSection>
    </VizStack>
  );
}
