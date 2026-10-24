import { DequeView, dequeItemsOf } from '../../components/structures';
import { Cell, CellRow, Empty, VizSection, VizStack } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';
import { previousStepOf } from '../../utils/history';

/** Mirrors AlgoLens.Core.Models.SlidingWindowState (camelCase JSON). */
interface SlidingWindowState {
  nums: number[];
  windowSize: number;
  currentIndex: number;
  deque: number[];
  result: number[];
}

export function SlidingWindowStateView({ step, history }: AlgorithmStateViewProps) {
  const state = step.state as SlidingWindowState;
  const prev = previousStepOf(history)?.state as SlidingWindowState | undefined;
  const highlighted = new Set(step.highlights);
  const windowStart = Math.max(0, state.currentIndex - state.windowSize + 1);
  const dequeCell = (value: number) => <Cell value={value} />;

  return (
    <VizStack>
      <VizSection title={`Array (window of ${state.windowSize}: L → R)`}>
        <CellRow>
          {state.nums.map((value, i) => (
            <Cell
              key={i}
              value={value}
              index={i}
              pointer={i === windowStart && i === state.currentIndex ? 'L/R' : i === windowStart ? 'L' : i === state.currentIndex ? 'R' : ''}
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

      <VizSection title="Deque (decreasing — the front is the window's maximum)">
        <DequeView
          items={dequeItemsOf(state.deque, dequeCell)}
          prevItems={prev ? dequeItemsOf(prev.deque, dequeCell) : undefined}
        />
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
