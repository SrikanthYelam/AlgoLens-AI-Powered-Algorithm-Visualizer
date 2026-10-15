import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.ReconstructItineraryState (camelCase JSON). */
interface ReconstructItineraryState {
  remainingGraph: Record<string, string[]>;
  stack: string[];
  postOrder: string[];
  itinerary: string[] | null;
}

function Chip({ label, highlighted }: { label: string; highlighted?: boolean }) {
  return (
    <span
      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 font-mono text-sm transition-colors duration-200 ${
        highlighted
          ? 'border-teal-500 bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200'
          : 'border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
      }`}
    >
      {label}
    </span>
  );
}

function Chain({ airports, highlightLast }: { airports: string[]; highlightLast?: boolean }) {
  if (airports.length === 0) {
    return <span className="text-gray-400">none yet</span>;
  }
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {airports.map((airport, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-gray-400">→</span>}
          <Chip label={airport} highlighted={highlightLast && i === airports.length - 1} />
        </span>
      ))}
    </div>
  );
}

export function ReconstructItineraryStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as ReconstructItineraryState;
  const isDone = step.action.startsWith('Done:');
  const topOfStack = state.stack[state.stack.length - 1];
  const remainingEntries = Object.entries(state.remainingGraph).filter(([, destinations]) => destinations.length > 0);

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Remaining flights (sorted, smallest destination first)
        </h3>
        <div className="flex flex-col gap-1.5">
          {remainingEntries.length === 0 ? (
            <span className="text-gray-400">none left</span>
          ) : (
            remainingEntries.map(([from, destinations]) => (
              <div key={from} className="flex flex-wrap items-center gap-1.5">
                <Chip label={from} highlighted={from === topOfStack} />
                <span className="text-gray-400">→</span>
                {destinations.map((to, i) => (
                  <Chip key={i} label={to} />
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">DFS stack (current path)</h3>
        <Chain airports={state.stack} highlightLast />
      </div>

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Backtracked so far (reverse order — flipped once the search finishes)
        </h3>
        <Chain airports={state.postOrder} />
      </div>

      {isDone && state.itinerary && (
        <div>
          <h3 className="mb-1 font-semibold text-emerald-600 dark:text-emerald-400">Final itinerary</h3>
          <div className="flex flex-wrap items-center gap-1.5">
            {state.itinerary.map((airport, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-gray-400">→</span>}
                <Chip label={airport} highlighted />
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
