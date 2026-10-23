import { Cell, CellRow, Empty, VizSection, VizStack } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.SlidingWindowState (camelCase JSON). */
interface SlidingWindowState {
  nums: number[];
  windowSize: number;
  currentIndex: number;
  deque: number[];
  result: number[];
}

export function SlidingWindowStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as SlidingWindowState;
  const highlighted = new Set(step.highlights);
  const windowStart = state.currentIndex - state.windowSize + 1;

  return (
    <VizStack>
      <VizSection title="Array">
        <CellRow>
          {state.nums.map((value, i) => (
            <Cell
              key={i}
              value={value}
              state={
                highlighted.has(String(value)) && i === state.currentIndex
                  ? 'current'
                  : i >= windowStart && i <= state.currentIndex
                    ? 'range'
                    : 'plain'
              }
            />
          ))}
        </CellRow>
      </VizSection>

      <VizSection title="Deque (front → back, decreasing)">
        <CellRow>
          {state.deque.length === 0 ? <Empty>empty</Empty> : state.deque.map((value, i) => <Cell key={i} value={value} />)}
        </CellRow>
      </VizSection>

      <VizSection title="Maxima so far">
        <CellRow>
          {state.result.length === 0 ? (
            <Empty>none yet</Empty>
          ) : (
            state.result.map((value, i) => <Cell key={i} value={value} state="found" />)
          )}
        </CellRow>
      </VizSection>
    </VizStack>
  );
}
