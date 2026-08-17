import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.TaskSchedulerState (camelCase JSON). */
interface TaskSchedulerState {
  timeline: string[];
  remainingCounts: Record<string, number>;
  cooldownUntil: Record<string, number>;
  currentTick: number;
}

function Box({ label, highlighted, muted }: { label: string; highlighted: boolean; muted: boolean }) {
  return (
    <span
      className={`transition-colors duration-200 inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 font-mono text-sm ${
        highlighted
          ? 'border-indigo-500 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200'
          : muted
            ? 'border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500'
            : 'border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
      }`}
    >
      {label}
    </span>
  );
}

export function TaskSchedulerStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as TaskSchedulerState;

  const remainingEntries = Object.entries(state.remainingCounts).sort(([a], [b]) => a.localeCompare(b));
  const onCooldown = Object.entries(state.cooldownUntil)
    .filter(([, availableAt]) => availableAt > state.currentTick)
    .sort(([, a], [, b]) => a - b);

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Timeline</h3>
        <div className="flex flex-wrap gap-1.5">
          {state.timeline.map((entry, i) => (
            <Box
              key={i}
              label={entry === 'idle' ? '·' : entry}
              highlighted={i === state.currentTick}
              muted={entry === 'idle'}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Remaining counts</h3>
        <div className="flex flex-wrap gap-1.5">
          {remainingEntries.length === 0 ? (
            <span className="text-gray-400">none</span>
          ) : (
            remainingEntries.map(([task, count]) => (
              <Box key={task} label={`${task}:${count}`} highlighted={false} muted={count === 0} />
            ))
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">On cooldown until</h3>
        <div className="flex flex-wrap gap-1.5">
          {onCooldown.length === 0 ? (
            <span className="text-gray-400">none</span>
          ) : (
            onCooldown.map(([task, availableAt]) => (
              <Box key={task} label={`${task}→${availableAt}`} highlighted={false} muted={false} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
