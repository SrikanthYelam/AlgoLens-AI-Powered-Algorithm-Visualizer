import { Cell, CellRow, VizSection, VizStack, Verdict } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.NumberOfWaysState (camelCase JSON). */
interface NumberOfWaysState {
  node: number;
  neighbor: number;
  edgeTime: number;
  dist: (number | null)[];
  ways: number[];
  outcome: 'shorter' | 'tie' | 'longer' | null;
  answer: number | null;
}

// Each outcome carries a leading glyph so the three cases read apart without color.
const OUTCOME_LABEL: Record<string, string> = {
  shorter: '↓ new shortest time — ways reset',
  tie: '= ties the shortest time — ways accumulate',
  longer: 'no improvement',
};

export function NumberOfWaysStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as NumberOfWaysState;
  const isDone = step.action.startsWith('Done:');

  return (
    <VizStack>
      <VizSection title="Shortest known time per intersection">
        <CellRow>
          {state.dist.map((time, city) => (
            <Cell
              key={city}
              wide
              value={`${city}:${time === null ? '∞' : time}`}
              state={city === state.node || city === state.neighbor ? 'current' : time === null ? 'visited' : 'plain'}
            />
          ))}
        </CellRow>
      </VizSection>

      <VizSection title="Ways to reach each intersection (that time)">
        <CellRow>
          {state.ways.map((count, city) => (
            <Cell
              key={city}
              wide
              value={`${city}:${count}`}
              state={city === state.node || city === state.neighbor ? 'current' : count === 0 ? 'visited' : 'plain'}
            />
          ))}
        </CellRow>
      </VizSection>

      {!isDone && state.outcome && (
        <p className="text-ink-muted">
          Road <span className="font-mono text-ink">{state.node}</span> →{' '}
          <span className="font-mono text-ink">{state.neighbor}</span> (
          <span className="font-mono text-ink">{state.edgeTime}</span>) —{' '}
          <span className={state.outcome === 'longer' ? undefined : 'font-medium text-ink'}>
            {OUTCOME_LABEL[state.outcome]}
          </span>
          .
        </p>
      )}

      {isDone && <Verdict ok>{state.answer} way(s) to arrive at the destination in the shortest time.</Verdict>}
    </VizStack>
  );
}
