import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.EncodeAndDecodeStringsState (camelCase JSON). */
interface EncodeAndDecodeStringsState {
  phase: 'encode' | 'decode';
  strings: string[];
  encoded: string;
  cursor: number;
  hashIndex: number;
  contentEnd: number;
  decoded: string[];
}

type Zone = 'plain' | 'consumed' | 'length' | 'hash' | 'content';

const ZONE_CLASSES: Record<Zone, string> = {
  plain: 'border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200',
  consumed:
    'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200',
  length: 'border-amber-400 bg-amber-100 text-amber-900 dark:border-amber-600 dark:bg-amber-900/40 dark:text-amber-100',
  hash: 'border-indigo-500 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200',
  content: 'border-sky-400 bg-sky-100 text-sky-900 dark:border-sky-600 dark:bg-sky-900/40 dark:text-sky-100',
};

function zoneOf(i: number, state: EncodeAndDecodeStringsState): Zone {
  if (state.phase === 'encode' || state.cursor < 0) {
    // Encoding, or the finished decode: nothing is being read any more.
    return state.phase === 'encode' ? 'plain' : 'consumed';
  }
  if (i < state.cursor) return 'consumed';
  if (state.hashIndex >= 0 && i === state.hashIndex) return 'hash';
  if (state.hashIndex >= 0 && i > state.hashIndex && state.contentEnd >= 0 && i < state.contentEnd) return 'content';
  if (i >= state.cursor && (state.hashIndex < 0 || i < state.hashIndex)) return 'length';
  return 'plain';
}

function Chips({ items, empty }: { items: string[]; empty: string }) {
  if (items.length === 0) return <span className="text-gray-400">{empty}</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <span
          key={i}
          className="inline-flex h-8 items-center rounded-md border border-gray-300 bg-gray-50 px-2 font-mono text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        >
          {item === '' ? '""' : `"${item}"`}
        </span>
      ))}
    </div>
  );
}

export function EncodeAndDecodeStringsStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as EncodeAndDecodeStringsState;
  const isDecoding = state.phase === 'decode';

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Original strings</h3>
        <Chips items={state.strings} empty="none" />
      </div>

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          {isDecoding ? (
            <>
              Encoded string — <span className="text-amber-600 dark:text-amber-400">length digits</span>,{' '}
              <span className="text-indigo-600 dark:text-indigo-400">#</span>,{' '}
              <span className="text-sky-600 dark:text-sky-400">string</span>
            </>
          ) : (
            'Encoded string (built so far)'
          )}
        </h3>
        {state.encoded.length === 0 ? (
          <span className="text-gray-400">empty</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {[...state.encoded].map((char, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <span
                  className={`transition-colors duration-200 inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-1.5 font-mono text-sm ${ZONE_CLASSES[zoneOf(i, state)]}`}
                >
                  {char === ' ' ? '␣' : char}
                </span>
                <span className="text-[10px] text-gray-400">{i}</span>
                <span className="h-3 text-[10px] font-medium text-indigo-600 dark:text-indigo-400">
                  {isDecoding && i === state.cursor ? 'i' : ''}
                  {isDecoding && i === state.hashIndex ? (i === state.cursor ? '/j' : 'j') : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {isDecoding && (
        <div>
          <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Decoded so far</h3>
          <Chips items={state.decoded} empty="none yet" />
        </div>
      )}
    </div>
  );
}
