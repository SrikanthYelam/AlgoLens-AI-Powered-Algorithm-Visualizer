import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.StringCompressionState (camelCase JSON). */
interface StringCompressionState {
  chars: string[];
  groupStart: number;
  groupEnd: number;
  writeStart: number;
  write: number;
  compressed: string;
}

function Cell({
  char,
  index,
  role,
  inGroup,
  pointer,
}: {
  char: string;
  index: number;
  role: 'fresh' | 'written' | 'pending';
  inGroup: boolean;
  pointer: string | null;
}) {
  const roleClasses =
    role === 'fresh'
      ? 'border-emerald-600 bg-emerald-500 text-white'
      : role === 'written'
        ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200'
        : 'border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200';

  return (
    <div className="flex flex-col items-center gap-0.5">
      <span
        className={`transition-colors duration-200 inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 font-mono text-sm ${roleClasses} ${
          inGroup ? 'ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-gray-900' : ''
        }`}
      >
        {char}
      </span>
      <span className="text-[10px] text-gray-400">{index}</span>
      <span className="h-3 text-[10px] font-medium text-indigo-600 dark:text-indigo-400">{pointer ?? ''}</span>
    </div>
  );
}

export function StringCompressionStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as StringCompressionState;
  const hasGroup = state.groupStart >= 0;
  const read = state.groupEnd + 1;

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Array (compressed in place — green is the result so far, ringed cells are the run just read)
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {state.chars.map((char, i) => {
            const role = i >= state.writeStart && i < state.write ? 'fresh' : i < state.write ? 'written' : 'pending';
            const pointers = [
              i === state.write ? 'write' : null,
              hasGroup && i === read ? 'read' : null,
            ].filter(Boolean);

            return (
              <Cell
                key={i}
                char={char}
                index={i}
                role={role}
                inGroup={hasGroup && i >= state.groupStart && i <= state.groupEnd}
                pointer={pointers.length > 0 ? pointers.join('/') : null}
              />
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Compressed so far (length {state.write})</h3>
        <div className="flex flex-wrap gap-1.5">
          {state.compressed.length === 0 ? (
            <span className="text-gray-400">nothing yet</span>
          ) : (
            [...state.compressed].map((char, i) => (
              <span
                key={i}
                className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-emerald-300 bg-emerald-50 px-2 font-mono text-sm text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200"
              >
                {char}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
