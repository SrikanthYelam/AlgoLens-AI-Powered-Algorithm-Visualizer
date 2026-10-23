import { Cell, CellRow, Empty, VizSection, VizStack, type VizState } from '../../components/viz';
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

function charState(char: string, isCurrent: boolean, isConsumed: boolean): VizState {
  if (isCurrent) return 'current';
  if (char === '[' || char === ']') return 'comparing';
  if (/\d/.test(char)) return 'range';
  return isConsumed ? 'visited' : 'plain';
}

function Quoted({ text }: { text: string }) {
  return <span className="font-mono">{text === '' ? '""' : `"${text}"`}</span>;
}

export function DecodeStringStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as DecodeStringState;
  const isDone = step.action.startsWith('Done:');

  return (
    <VizStack>
      <VizSection title="Encoded string (dashed = bracket, tinted = digit)">
        <CellRow gap="sm">
          {[...state.encoded].map((char, i) => (
            <Cell
              key={i}
              value={char}
              size="sm"
              index={i}
              state={charState(char, i === state.index, i < state.index || isDone)}
            />
          ))}
        </CellRow>
      </VizSection>

      <VizSection title="Stack (outermost → innermost open bracket)">
        {state.stack.length === 0 ? (
          <Empty>empty</Empty>
        ) : (
          <CellRow>
            {state.stack.map((frame, i) => (
              <Cell
                key={i}
                state="range"
                value={
                  <span className="inline-flex items-center gap-1 py-1">
                    <Quoted text={frame.prefix} /> <span>×{frame.repeat}</span>
                  </span>
                }
              />
            ))}
          </CellRow>
        )}
      </VizSection>

      <div className="flex flex-col gap-1">
        <p className="text-ink-muted">
          Current string: <Quoted text={state.current} />
        </p>
        {!isDone && state.number > 0 && (
          <p className="text-ink-muted">
            Repeat count being read: <span className="font-mono font-semibold text-ink">{state.number}</span>
          </p>
        )}
        {isDone && (
          <p className="font-medium text-ink">
            <span aria-hidden="true" className="text-success">
              ✓{' '}
            </span>
            Decoded: <Quoted text={state.result} />
          </p>
        )}
      </div>
    </VizStack>
  );
}
