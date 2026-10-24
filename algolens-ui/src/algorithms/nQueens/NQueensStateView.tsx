import { VizSection, VizStack } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.NQueensState (camelCase JSON). */
interface NQueensState {
  boardSize: number;
  queenColumns: number[];
  solutions: number[][];
}

export function NQueensStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as NQueensState;
  const highlighted = new Set(step.highlights);

  // Squares in later rows that an already-placed queen attacks (same column or either diagonal).
  const attacked = new Set<string>();
  state.queenColumns.forEach((queenCol, queenRow) => {
    for (let r = queenRow + 1; r < state.boardSize; r++) {
      for (let c = 0; c < state.boardSize; c++) {
        if (c === queenCol || Math.abs(c - queenCol) === r - queenRow) attacked.add(`${r},${c}`);
      }
    }
  });

  return (
    <VizStack>
      <VizSection title="Board (dashed square = position being tried, × = attacked by a queen above)">
        <div className="inline-flex flex-col gap-1">
          {Array.from({ length: state.boardSize }, (_, row) => (
            <div key={row} className="flex gap-1">
              {Array.from({ length: state.boardSize }, (_, col) => {
                const hasQueen = row < state.queenColumns.length && state.queenColumns[row] === col;
                const isCurrent = highlighted.has(`${row},${col}`);
                const isAttacked = !hasQueen && !isCurrent && attacked.has(`${row},${col}`);

                return (
                  <span
                    key={col}
                    className={`flex h-9 w-9 items-center justify-center rounded-xs border text-body-lg transition-colors duration-200 ${
                      isCurrent
                        ? 'border-dashed border-state-comparing-border bg-state-comparing-bg text-ink'
                        : (row + col) % 2 === 0
                          ? 'border-hairline bg-surface-3 text-ink'
                          : 'border-hairline bg-surface-1 text-ink'
                    } ${isAttacked ? 'text-ink-subtle' : ''}`}
                  >
                    {hasQueen ? '♛' : isAttacked ? '×' : ''}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </VizSection>

      <p className="font-medium text-ink">Solutions found: {state.solutions.length}</p>
    </VizStack>
  );
}
