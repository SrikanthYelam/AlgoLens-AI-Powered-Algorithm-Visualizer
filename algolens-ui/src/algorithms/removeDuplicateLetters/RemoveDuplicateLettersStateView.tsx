import { StackView } from '../../components/structures';
import { Cell, CellRow, VizSection, VizStack, Verdict, type VizState } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';
import { previousStepOf } from '../../utils/history';

/** Mirrors AlgoLens.Core.Models.RemoveDuplicateLettersState (camelCase JSON). */
interface RemoveDuplicateLettersState {
  s: string;
  index: number;
  char: string | null;
  remainingCount: Record<string, number>;
  stack: string[];
  skipped: boolean;
  result: string | null;
}

// A character is never in the stack twice at once, so its own value is a stable id across steps.
const toItem = (char: string) => ({ id: char, node: <span className="font-mono text-code">{char}</span> });

export function RemoveDuplicateLettersStateView({ step, history }: AlgorithmStateViewProps) {
  const state = step.state as RemoveDuplicateLettersState;
  const prev = previousStepOf(history)?.state as RemoveDuplicateLettersState | undefined;
  const isDone = step.action.startsWith('Done:');

  const charState = (i: number): VizState => {
    if (i === state.index) return 'current';
    if (i < state.index || isDone) return 'visited';
    return 'plain';
  };

  // Sorted alphabetically so the row doesn't reorder from step to step.
  const counts = Object.entries(state.remainingCount).sort(([a], [b]) => a.localeCompare(b));

  return (
    <VizStack>
      <VizSection title="String (▲ = character being read)">
        <CellRow gap="sm">
          {[...state.s].map((char, i) => (
            <Cell
              key={i}
              value={char}
              size="sm"
              index={i}
              pointer={i === state.index && !isDone ? 'i' : ''}
              state={charState(i)}
            />
          ))}
        </CellRow>
      </VizSection>

      <div className="flex flex-wrap items-start gap-x-10 gap-y-4">
        <VizSection title="Result so far (bottom to top; stays as small as possible)">
          <StackView items={state.stack.map(toItem)} prevItems={prev?.stack.map(toItem)} />
        </VizSection>

        <VizSection title="Occurrences remaining after this index">
          <CellRow>
            {counts.map(([char, count]) => (
              <Cell key={char} value={`${char}:${count}`} wide state={char === state.char ? 'current' : 'plain'} />
            ))}
          </CellRow>
        </VizSection>
      </div>

      {!isDone && state.char && (
        <p className="text-ink-muted">
          {state.skipped ? (
            <>
              <span className="font-mono text-ink">'{state.char}'</span> is already in the result — skip this occurrence.
            </>
          ) : (
            <>
              Push <span className="font-mono text-ink">'{state.char}'</span>.
            </>
          )}
        </p>
      )}

      {isDone && <Verdict ok>Result: "{state.result}".</Verdict>}
    </VizStack>
  );
}
