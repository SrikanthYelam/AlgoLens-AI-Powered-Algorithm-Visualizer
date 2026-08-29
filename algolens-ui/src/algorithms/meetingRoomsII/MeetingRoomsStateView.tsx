import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.MeetingRoomsState (camelCase JSON). */
interface MeetingRoomsState {
  sortedIntervals: number[][];
  currentIndex: number;
  heap: number[];
  roomsInUse: number;
  maxRooms: number;
}

function Box({ label, highlighted, muted }: { label: string; highlighted: boolean; muted?: boolean }) {
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

export function MeetingRoomsStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as MeetingRoomsState;

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Meetings (sorted by start time)</h3>
        <div className="flex flex-wrap gap-1.5">
          {state.sortedIntervals.map(([start, end], i) => (
            <Box key={i} label={`[${start},${end}]`} highlighted={i === state.currentIndex} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Rooms in use (end times, earliest first)
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {state.heap.length === 0 ? (
            <span className="text-gray-400">none</span>
          ) : (
            state.heap.map((end, i) => <Box key={i} label={String(end)} highlighted={i === 0} />)
          )}
        </div>
      </div>

      <p className="font-medium text-gray-700 dark:text-gray-300">
        Rooms in use now: {state.roomsInUse} — max so far: {state.maxRooms}
      </p>
    </div>
  );
}
