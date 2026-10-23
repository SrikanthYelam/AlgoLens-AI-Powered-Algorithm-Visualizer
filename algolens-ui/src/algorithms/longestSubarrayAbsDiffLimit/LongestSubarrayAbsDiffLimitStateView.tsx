import { Cell, CellRow, Empty, VizSection, VizStack } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

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

export function LongestSubarrayAbsDiffLimitStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as LongestSubarrayAbsDiffLimitState;

  return (
    <VizStack>
      <VizSection title={`Array (window [${state.left}..${state.right}], limit ${state.limit})`}>
        <CellRow>
          {state.nums.map((value, i) => (
            <Cell
              key={i}
              value={value}
              state={i === state.right ? 'current' : i >= state.left && i <= state.right ? 'range' : 'plain'}
            />
          ))}
        </CellRow>
      </VizSection>

      <VizSection title="Max deque (front → back, decreasing)">
        <CellRow>
          {state.maxDeque.length === 0 ? (
            <Empty>empty</Empty>
          ) : (
            state.maxDeque.map((value, i) => <Cell key={i} value={value} />)
          )}
        </CellRow>
      </VizSection>

      <VizSection title="Min deque (front → back, increasing)">
        <CellRow>
          {state.minDeque.length === 0 ? (
            <Empty>empty</Empty>
          ) : (
            state.minDeque.map((value, i) => <Cell key={i} value={value} />)
          )}
        </CellRow>
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
