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

function Box({ label, highlighted, muted }: { label: string; highlighted: boolean; muted: boolean }) {
  return (
    <span
      className={`transition-colors duration-200 inline-flex h-9 min-w-14 items-center justify-center rounded-md border px-2 font-mono text-sm ${
        highlighted
          ? 'border-teal-500 bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200'
          : muted
            ? 'border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500'
            : 'border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
      }`}
    >
      {label}
    </span>
  );
}

function DistRow({ dist, highlightCity }: { dist: (number | null)[]; highlightCity: number }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {dist.map((price, city) => (
        <Box
          key={city}
          label={`${city}:${price === null ? '∞' : `$${price}`}`}
          highlighted={city === highlightCity}
          muted={price === null}
        />
      ))}
    </div>
  );
}

export function CheapestFlightsStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as CheapestFlightsState;
  const isDone = step.action.startsWith('Done:');
  const isStart = state.round === -1;

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          {isStart || isDone ? 'Prices per city' : `Prices before round ${state.round}`}
        </h3>
        <DistRow dist={state.dist} highlightCity={state.from} />
      </div>

      {!isStart && !isDone && (
        <div>
          <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Prices being built this round</h3>
          <DistRow dist={state.nextDist} highlightCity={state.to} />
        </div>
      )}

      {!isStart && !isDone && (
        <p className="text-gray-700 dark:text-gray-300">
          Flight <span className="font-mono">{state.from}</span> → <span className="font-mono">{state.to}</span> for{' '}
          <span className="font-mono">${state.price}</span> —{' '}
          <span className={state.updated ? 'font-medium text-teal-600 dark:text-teal-400' : 'text-gray-500 dark:text-gray-400'}>
            {state.updated ? 'improves this city\'s price' : 'no improvement'}
          </span>
          .
        </p>
      )}

      {isDone && (
        <p
          className={
            state.answer !== null && state.answer >= 0
              ? 'font-medium text-emerald-600 dark:text-emerald-400'
              : 'font-medium text-rose-600 dark:text-rose-400'
          }
        >
          {state.answer !== null && state.answer >= 0
            ? `Cheapest price: $${state.answer}.`
            : 'Destination is unreachable within the stop limit.'}
        </p>
      )}
    </div>
  );
}
