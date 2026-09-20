import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.MoveZeroesState (camelCase JSON). */
interface MoveZeroesState {
  nums: number[];
  read: number;
  write: number;
}

type Zone = 'settled' | 'zeros' | 'pending';

function Cell({
  value,
  index,
  zone,
  isRead,
  pointer,
}: {
  value: number;
  index: number;
  zone: Zone;
  isRead: boolean;
  pointer: string | null;
}) {
  const zoneClasses =
    zone === 'settled'
      ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200'
      : zone === 'zeros'
        ? 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200'
        : 'border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200';

  return (
    <div className="flex flex-col items-center gap-0.5">
      <span
        className={`transition-colors duration-200 inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 font-mono text-sm ${zoneClasses} ${
          isRead ? 'ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-gray-900' : ''
        }`}
      >
        {value}
      </span>
      <span className="text-[10px] text-gray-400">{index}</span>
      <span className="h-3 text-[10px] font-medium text-indigo-600 dark:text-indigo-400">{pointer ?? ''}</span>
    </div>
  );
}

export function MoveZeroesStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as MoveZeroesState;

  return (
    <div className="flex flex-col gap-3 text-sm">
      <h3 className="font-semibold text-gray-700 dark:text-gray-300">
        Array (
        <span className="text-emerald-600 dark:text-emerald-400">green</span> = non-zeros gathered so far,{' '}
        <span className="text-amber-600 dark:text-amber-400">amber</span> = zeros already passed, ringed = being read)
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {state.nums.map((value, i) => {
          const zone: Zone = i < state.write ? 'settled' : state.read < 0 || i <= state.read ? 'zeros' : 'pending';
          const pointers = [i === state.write ? 'write' : null, i === state.read ? 'read' : null].filter(Boolean);

          return (
            <Cell
              key={i}
              value={value}
              index={i}
              zone={zone}
              isRead={i === state.read}
              pointer={pointers.length > 0 ? pointers.join('/') : null}
            />
          );
        })}
      </div>
    </div>
  );
}
