import { DequeView, dequeItemsOf } from '../../components/structures';
import { Cell, CellRow, Empty, VizSection, VizStack } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';
import { previousStepOf } from '../../utils/history';

/** Mirrors AlgoLens.Core.Models.LongestSubarrayAbsDiffLimitState (camelCase JSON). */
interface LongestSubarrayAbsDiffLimitState {
  nums: number[];
  limit: number;
  left: number;
  right: number;
  maxDeque: number[];
  minDeque: number[];
  bestStart: number;
  bestLength: number;
}

export function LongestSubarrayAbsDiffLimitStateView({ step, history }: AlgorithmStateViewProps) {
  const state = step.state as LongestSubarrayAbsDiffLimitState;
  const prev = previousStepOf(history)?.state as LongestSubarrayAbsDiffLimitState | undefined;
  const dequeCell = (value: number) => <Cell value={value} />;
  const windowMax = state.maxDeque.length > 0 ? state.maxDeque[0] : null;
  const windowMin = state.minDeque.length > 0 ? state.minDeque[0] : null;

  return (
    <VizStack>
      <VizSection title={`Array (window [${state.left}..${state.right}], limit ${state.limit})`}>
        <CellRow>
          {state.nums.map((value, i) => (
            <Cell
              key={i}
              value={value}
              index={i}
              pointer={i === state.left && i === state.right ? 'L/R' : i === state.left ? 'L' : i === state.right ? 'R' : ''}
              state={i === state.right ? 'current' : i >= state.left && i <= state.right ? 'range' : 'plain'}
            />
          ))}
        </CellRow>
        {windowMax !== null && windowMin !== null && (
          <p className="mt-2 font-mono text-code text-ink-muted">
            max {windowMax} − min {windowMin} = <span className="font-semibold text-ink">{windowMax - windowMin}</span>{' '}
            {windowMax - windowMin <= state.limit ? '≤' : '>'} {state.limit}{' '}
            {windowMax - windowMin <= state.limit ? '✓ window valid' : '✕ shrink from the left'}
          </p>
        )}
      </VizSection>

      <VizSection title="Max deque (decreasing — front is the window max)">
        <DequeView
          items={dequeItemsOf(state.maxDeque, dequeCell)}
          prevItems={prev ? dequeItemsOf(prev.maxDeque, dequeCell) : undefined}
        />
      </VizSection>

      <VizSection title="Min deque (increasing — front is the window min)">
        <DequeView
          items={dequeItemsOf(state.minDeque, dequeCell)}
          prevItems={prev ? dequeItemsOf(prev.minDeque, dequeCell) : undefined}
        />
      </VizSection>

      <VizSection title={`Longest valid subarray so far (length ${state.bestLength})`}>
        <CellRow>
          {state.bestLength === 0 ? (
            <Empty>none yet</Empty>
          ) : (
            state.nums
              .slice(state.bestStart, state.bestStart + state.bestLength)
              .map((value, i) => <Cell key={i} value={value} state="found" />)
          )}
        </CellRow>
      </VizSection>
    </VizStack>
  );
}
