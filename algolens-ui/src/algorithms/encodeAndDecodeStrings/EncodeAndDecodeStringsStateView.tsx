import { Cell, CellRow, Empty, Legend, VizSection, VizStack, type VizState } from '../../components/viz';
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

// Decode zones: length digits (tinted), the # separator (solid), the string itself (dashed).
function zoneOf(i: number, state: EncodeAndDecodeStringsState): VizState {
  if (state.phase === 'encode' || state.cursor < 0) {
    // Encoding, or the finished decode: nothing is being read any more.
    return state.phase === 'encode' ? 'plain' : 'visited';
  }
  if (i < state.cursor) return 'visited';
  if (state.hashIndex >= 0 && i === state.hashIndex) return 'current';
  if (state.hashIndex >= 0 && i > state.hashIndex && state.contentEnd >= 0 && i < state.contentEnd) return 'comparing';
  if (i >= state.cursor && (state.hashIndex < 0 || i < state.hashIndex)) return 'range';
  return 'plain';
}

function Strings({ items, empty }: { items: string[]; empty: string }) {
  if (items.length === 0) return <Empty>{empty}</Empty>;
  return (
    <CellRow>
      {items.map((item, i) => (
        <Cell key={i} value={item === '' ? '""' : `"${item}"`} size="sm" />
      ))}
    </CellRow>
  );
}

export function EncodeAndDecodeStringsStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as EncodeAndDecodeStringsState;
  const isDecoding = state.phase === 'decode';

  return (
    <VizStack>
      <VizSection title="Original strings">
        <Strings items={state.strings} empty="none" />
      </VizSection>

      <VizSection
        title={
          isDecoding ? (
            <>
              Encoded string — <Legend state="range">length digits</Legend> <Legend state="current">#</Legend>{' '}
              <Legend state="comparing">string</Legend>
            </>
          ) : (
            'Encoded string (built so far)'
          )
        }
      >
        {state.encoded.length === 0 ? (
          <Empty>empty</Empty>
        ) : (
          <CellRow gap="sm">
            {[...state.encoded].map((char, i) => (
              <Cell
                key={i}
                value={char === ' ' ? '␣' : char}
                size="sm"
                index={i}
                state={zoneOf(i, state)}
                pointer={
                  (isDecoding && i === state.cursor ? 'i' : '') +
                  (isDecoding && i === state.hashIndex ? (i === state.cursor ? '/j' : 'j') : '')
                }
              />
            ))}
          </CellRow>
        )}
      </VizSection>

      {isDecoding && (
        <VizSection title="Decoded so far">
          <Strings items={state.decoded} empty="none yet" />
        </VizSection>
      )}
    </VizStack>
  );
}
