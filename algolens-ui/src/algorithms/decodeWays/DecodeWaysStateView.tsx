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

function DigitChip({ value, highlighted }: { value: string; highlighted: boolean }) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border font-mono text-sm transition-colors duration-200 ${
        highlighted
          ? 'border-indigo-500 bg-indigo-400 text-white'
          : 'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200'
      }`}
    >
      {value}
    </span>
  );
}

function TableBox({ index, value, role }: { index: number; value: number; role: 'target' | 'source' | 'plain' }) {
  const roleClasses =
    role === 'target'
      ? 'border-indigo-500 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200'
      : role === 'source'
        ? 'border-emerald-400 bg-emerald-50 text-emerald-800 dark:border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-200'
        : 'border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200';

  return (
    <div className="flex flex-col items-center gap-0.5">
      <span
        className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 font-mono text-sm transition-colors duration-200 ${roleClasses}`}
      >
        {value}
      </span>
      <span className="text-[10px] text-gray-400">dp[{index}]</span>
    </div>
  );
}

export function DecodeWaysStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as DecodeWaysState;
  const sourceIndex = state.isValid ? state.index - state.segment.length : null;
  const segmentStart = state.index - state.segment.length;

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Input string</h3>
        {state.s.length === 0 ? (
          <span className="text-gray-400">empty</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {[...state.s].map((c, i) => (
              <DigitChip key={i} value={c} highlighted={i >= segmentStart && i < state.index} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          dp table (dp[k] = ways to decode the first k characters)
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {state.table.map((value, index) => (
            <TableBox
              key={index}
              index={index}
              value={value}
              role={index === state.index ? 'target' : index === sourceIndex ? 'source' : 'plain'}
            />
          ))}
        </div>
      </div>

      {state.index > 0 && (
        <p className="text-gray-600 dark:text-gray-300">
          {state.isValid ? (
            <>
              Segment <span className="font-mono font-semibold">'{state.segment}'</span> is a valid code: dp[
              {state.index}] += dp[{sourceIndex}] ({state.contribution}) → {state.table[state.index]}.
            </>
          ) : (
            <>
              No valid single or double-digit code ends here — dp[{state.index}] stays{' '}
              <span className="font-mono font-semibold">0</span>.
            </>
          )}
        </p>
      )}
    </div>
  );
}
