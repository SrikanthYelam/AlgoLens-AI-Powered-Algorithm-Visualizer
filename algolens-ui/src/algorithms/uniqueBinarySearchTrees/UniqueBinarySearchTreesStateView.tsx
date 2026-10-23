import { Cell, CellRow, Legend, VizSection, VizStack } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.UniqueBstCountState (camelCase JSON). */
interface UniqueBstCountState {
  n: number;
  table: number[];
  currentI: number;
  currentJ: number;
  contribution: number;
}

export function UniqueBinarySearchTreesStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as UniqueBstCountState;
  const leftIndex = state.currentJ - 1;
  const rightIndex = state.currentI - state.currentJ;

  return (
    <VizStack>
      <VizSection
        title={
          <>
            dp table (dp[k] = unique BSTs over k nodes) · <Legend state="current">being updated</Legend>{' '}
            <Legend state="comparing">being multiplied</Legend>
          </>
        }
      >
        <CellRow>
          {state.table.map((value, index) => (
            <Cell
              key={index}
              value={value}
              index={`dp[${index}]`}
              state={
                index === state.currentI
                  ? 'current'
                  : index === leftIndex || index === rightIndex
                    ? 'comparing'
                    : 'plain'
              }
            />
          ))}
        </CellRow>
      </VizSection>

      {state.currentI > 0 && (
        <p className="text-ink-muted">
          Root <span className="font-mono font-semibold text-ink">{state.currentJ}</span>: dp[{leftIndex}] (
          {state.table[leftIndex]}) × dp[{rightIndex}] ({state.table[rightIndex]}) ={' '}
          <span className="font-mono font-semibold text-ink">{state.contribution}</span> added to dp[{state.currentI}].
        </p>
      )}
    </VizStack>
  );
}
