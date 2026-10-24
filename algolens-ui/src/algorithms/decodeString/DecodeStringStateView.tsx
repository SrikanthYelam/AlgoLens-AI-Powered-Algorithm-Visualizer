import { StackView } from '../../components/structures';
import { Cell, CellRow, VizSection, VizStack, type VizState } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';
import { previousStepOf } from '../../utils/history';

/** Mirrors AlgoLens.Core.Models.DecodeStringState (camelCase JSON). */
interface DecodeStringFrame {
  prefix: string;
  repeat: number;
}

interface DecodeStringState {
  encoded: string;
  index: number;
  current: string;
  number: number;
  stack: DecodeStringFrame[];
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

function Frame({ frame }: { frame: DecodeStringFrame }) {
  return (
    <>
      <Quoted text={frame.prefix} /> × {frame.repeat}
    </>
  );
}

// Depth + content identify a frame across steps.
const toItem = (frame: DecodeStringFrame, depth: number) => ({
  id: `${depth}:${frame.prefix}:${frame.repeat}`,
  node: <Frame frame={frame} />,
});

export function DecodeStringStateView({ step, history }: AlgorithmStateViewProps) {
  const state = step.state as DecodeStringState;
  const prev = previousStepOf(history)?.state as DecodeStringState | undefined;
  const isDone = step.action.startsWith('Done:');
  // A frame was popped this step: current = prefix + (string built inside the brackets) × repeat.
  const popped = prev && prev.stack.length > state.stack.length ? prev.stack[prev.stack.length - 1] : null;

  return (
    <VizStack>
      <VizSection title="Encoded string (▲ = character being read)">
        <CellRow gap="sm">
          {[...state.encoded].map((char, i) => (
            <Cell
              key={i}
              value={char}
              size="sm"
              index={i}
              pointer={i === state.index && !isDone ? 'i' : ''}
              state={charState(char, i === state.index, i < state.index || isDone)}
            />
          ))}
        </CellRow>
      </VizSection>

      <div className="flex flex-wrap items-start gap-x-10 gap-y-4">
        <VizSection title="Stack (saved frames: prefix × repeat)">
          <StackView items={state.stack.map(toItem)} prevItems={prev?.stack.map(toItem)} />
        </VizSection>

        <VizSection title="String being built">
          <div className="flex flex-col gap-2">
            <p className="text-subhead text-ink">
              <Quoted text={state.current} />
            </p>
            {!isDone && state.number > 0 && (
              <p className="text-ink-muted">
                reading repeat count: <span className="font-mono font-semibold text-ink">{state.number}</span>
              </p>
            )}
            {popped && prev && (
              <p className="rounded-md border border-dashed border-state-comparing-border bg-state-comparing-bg px-3 py-2 font-mono text-code text-ink">
                <Quoted text={popped.prefix} /> + <Quoted text={prev.current} /> × {popped.repeat} →{' '}
                <Quoted text={state.current} />
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
        </VizSection>
      </div>
    </VizStack>
  );
}
