import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.DecodeStringState (camelCase JSON). */
interface DecodeStringState {
  encoded: string;
  index: number;
  current: string;
  number: number;
  stack: { prefix: string; repeat: number }[];
  result: string;
}

function charClasses(char: string, isCurrent: boolean, isConsumed: boolean): string {
  if (isCurrent) return 'border-indigo-500 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200';
  if (char === '[' || char === ']') {
    return 'border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-700 dark:bg-violet-950/40 dark:text-violet-200';
  }
  if (/\d/.test(char)) {
    return 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200';
  }
  return isConsumed
    ? 'border-gray-300 bg-gray-100 text-gray-500 dark:border-gray-600 dark:bg-gray-800/60 dark:text-gray-400'
    : 'border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200';
}

function Quoted({ text }: { text: string }) {
  return <span className="font-mono">{text === '' ? '""' : `"${text}"`}</span>;
}

export function DecodeStringStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as DecodeStringState;
  const isDone = step.action.startsWith('Done:');

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Encoded string</h3>
        <div className="flex flex-wrap gap-1">
          {[...state.encoded].map((char, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <span
                className={`transition-colors duration-200 inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 font-mono text-sm ${charClasses(char, i === state.index, i < state.index || isDone)}`}
              >
                {char}
              </span>
              <span className="text-[10px] text-gray-400">{i}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Stack (outermost → innermost open bracket)
        </h3>
        {state.stack.length === 0 ? (
          <span className="text-gray-400">empty</span>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {state.stack.map((frame, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-md border border-violet-300 bg-violet-50 px-2 py-1 text-violet-800 dark:border-violet-700 dark:bg-violet-950/40 dark:text-violet-200"
              >
                <Quoted text={frame.prefix} /> <span>×{frame.repeat}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-gray-700 dark:text-gray-300">
          Current string: <Quoted text={state.current} />
        </p>
        {!isDone && state.number > 0 && (
          <p className="text-gray-700 dark:text-gray-300">
            Repeat count being read: <span className="font-mono font-semibold">{state.number}</span>
          </p>
        )}
        {isDone && (
          <p className="font-medium text-emerald-700 dark:text-emerald-400">
            Decoded: <Quoted text={state.result} />
          </p>
        )}
      </div>
    </div>
  );
}
