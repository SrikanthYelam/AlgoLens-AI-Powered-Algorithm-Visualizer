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

function Box({ label, highlighted, muted }: { label: string; highlighted: boolean; muted: boolean }) {
  return (
    <span
      className={`transition-colors duration-200 inline-flex h-9 min-w-16 items-center justify-center rounded-md border px-2 font-mono text-sm ${
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

const OUTCOME_STYLE: Record<string, string> = {
  shorter: 'font-medium text-teal-600 dark:text-teal-400',
  tie: 'font-medium text-amber-600 dark:text-amber-400',
  longer: 'text-gray-500 dark:text-gray-400',
};

const OUTCOME_LABEL: Record<string, string> = {
  shorter: 'new shortest time — ways reset',
  tie: 'ties the shortest time — ways accumulate',
  longer: 'no improvement',
};

export function NumberOfWaysStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as NumberOfWaysState;
  const isDone = step.action.startsWith('Done:');

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Shortest known time per intersection</h3>
        <div className="flex flex-wrap gap-1.5">
          {state.dist.map((time, city) => (
            <Box
              key={city}
              label={`${city}:${time === null ? '∞' : time}`}
              highlighted={city === state.node || city === state.neighbor}
              muted={time === null}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Ways to reach each intersection (that time)</h3>
        <div className="flex flex-wrap gap-1.5">
          {state.ways.map((count, city) => (
            <Box
              key={city}
              label={`${city}:${count}`}
              highlighted={city === state.node || city === state.neighbor}
              muted={count === 0}
            />
          ))}
        </div>
      </div>

      {!isDone && state.outcome && (
        <p className="text-gray-700 dark:text-gray-300">
          Road <span className="font-mono">{state.node}</span> → <span className="font-mono">{state.neighbor}</span>{' '}
          (<span className="font-mono">{state.edgeTime}</span>) —{' '}
          <span className={OUTCOME_STYLE[state.outcome]}>{OUTCOME_LABEL[state.outcome]}</span>.
        </p>
      )}

      {isDone && (
        <p className="font-medium text-emerald-600 dark:text-emerald-400">
          {state.answer} way(s) to arrive at the destination in the shortest time.
        </p>
      )}
    </div>
  );
}
