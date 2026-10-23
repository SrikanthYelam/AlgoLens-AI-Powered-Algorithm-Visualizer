import { Cell, CellRow, Empty, VizSection, VizStack, type VizState } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.StringCompressionState (camelCase JSON). */
interface StringCompressionState {
  chars: string[];
  groupStart: number;
  groupEnd: number;
  writeStart: number;
  write: number;
  compressed: string;
}

export function StringCompressionStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as StringCompressionState;
  const hasGroup = state.groupStart >= 0;
  const read = state.groupEnd + 1;

  return (
    <VizStack>
      <VizSection title="Array (compressed in place — highlighted is the result so far, ringed cells are the run just read)">
        <CellRow>
          {state.chars.map((char, i) => {
            const cellState: VizState =
              i >= state.writeStart && i < state.write ? 'current' : i < state.write ? 'found' : 'plain';
            const pointers = [i === state.write ? 'write' : null, hasGroup && i === read ? 'read' : null].filter(Boolean);

            return (
              <Cell
                key={i}
                value={char}
                state={cellState}
                index={i}
                ring={hasGroup && i >= state.groupStart && i <= state.groupEnd}
                pointer={pointers.length > 0 ? pointers.join('/') : null}
              />
            );
          })}
        </CellRow>
      </VizSection>

      <VizSection title={`Compressed so far (length ${state.write})`}>
        <CellRow>
          {state.compressed.length === 0 ? (
            <Empty>nothing yet</Empty>
          ) : (
            [...state.compressed].map((char, i) => <Cell key={i} value={char} state="found" size="sm" />)
          )}
        </CellRow>
      </VizSection>
    </VizStack>
  );
}
