import { Cell, CellRow, Empty, Legend, VizSection, VizStack } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.DecodeWaysState (camelCase JSON). */
interface DecodeWaysState {
  s: string;
  table: number[];
  index: number;
  segment: string;
  isValid: boolean;
  contribution: number;
}

export function DecodeWaysStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as DecodeWaysState;
  const sourceIndex = state.isValid ? state.index - state.segment.length : null;
  const segmentStart = state.index - state.segment.length;

  return (
    <VizStack>
      <VizSection title="Input string">
        {state.s.length === 0 ? (
          <Empty>empty</Empty>
        ) : (
          <CellRow gap="sm">
            {[...state.s].map((c, i) => (
              <Cell key={i} value={c} size="sm" state={i >= segmentStart && i < state.index ? 'current' : 'plain'} />
            ))}
          </CellRow>
        )}
      </VizSection>

      <VizSection
        title={
          <>
            dp table (dp[k] = ways to decode the first k characters) · <Legend state="current">being filled</Legend>{' '}
            <Legend state="comparing">source</Legend>
          </>
        }
      >
        <CellRow>
          {state.table.map((value, index) => (
            <Cell
              key={index}
              value={value}
              index={`dp[${index}]`}
              state={index === state.index ? 'current' : index === sourceIndex ? 'comparing' : 'plain'}
            />
          ))}
        </CellRow>
      </VizSection>

      {state.index > 0 && (
        <p className="text-ink-muted">
          {state.isValid ? (
            <>
              Segment <span className="font-mono font-semibold text-ink">'{state.segment}'</span> is a valid code: dp[
              {state.index}] += dp[{sourceIndex}] ({state.contribution}) → {state.table[state.index]}.
            </>
          ) : (
            <>
              No valid single or double-digit code ends here — dp[{state.index}] stays{' '}
              <span className="font-mono font-semibold text-ink">0</span>.
            </>
          )}
        </p>
      )}
    </VizStack>
  );
}
