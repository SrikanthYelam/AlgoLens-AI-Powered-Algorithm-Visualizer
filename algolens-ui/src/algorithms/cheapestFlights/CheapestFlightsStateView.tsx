import { Cell, CellRow, VizSection, VizStack, Verdict } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.CheapestFlightsState (camelCase JSON). */
interface CheapestFlightsState {
  round: number;
  dist: (number | null)[];
  nextDist: (number | null)[];
  from: number;
  to: number;
  price: number;
  updated: boolean;
  answer: number | null;
}

function DistRow({ dist, highlightCity }: { dist: (number | null)[]; highlightCity: number }) {
  return (
    <CellRow>
      {dist.map((price, city) => (
        <Cell
          key={city}
          wide
          value={`${city}:${price === null ? '∞' : `$${price}`}`}
          state={city === highlightCity ? 'current' : price === null ? 'visited' : 'plain'}
        />
      ))}
    </CellRow>
  );
}

export function CheapestFlightsStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as CheapestFlightsState;
  const isDone = step.action.startsWith('Done:');
  const isStart = state.round === -1;
  const reachable = state.answer !== null && state.answer >= 0;

  return (
    <VizStack>
      <VizSection title={isStart || isDone ? 'Prices per city' : `Prices before round ${state.round}`}>
        <DistRow dist={state.dist} highlightCity={state.from} />
      </VizSection>

      {!isStart && !isDone && (
        <VizSection title="Prices being built this round">
          <DistRow dist={state.nextDist} highlightCity={state.to} />
        </VizSection>
      )}

      {!isStart && !isDone && (
        <p className="text-ink-muted">
          Flight <span className="font-mono text-ink">{state.from}</span> →{' '}
          <span className="font-mono text-ink">{state.to}</span> for{' '}
          <span className="font-mono text-ink">${state.price}</span> —{' '}
          <span className={state.updated ? 'font-medium text-ink' : undefined}>
            {state.updated ? "↓ improves this city's price" : 'no improvement'}
          </span>
          .
        </p>
      )}

      {isDone && (
        <Verdict ok={reachable}>
          {reachable ? `Cheapest price: $${state.answer}.` : 'Destination is unreachable within the stop limit.'}
        </Verdict>
      )}
    </VizStack>
  );
}
