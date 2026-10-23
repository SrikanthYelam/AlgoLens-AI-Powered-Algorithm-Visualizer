import { Cell, VizSection, VizStack, type VizState } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.IslandsState (camelCase JSON). */
interface IslandsState {
  grid: number[][];
  visited: number[][];
  islandCount: number;
  currentRow: number;
  currentCol: number;
}

export function IslandsStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as IslandsState;

  return (
    <VizStack>
      <VizSection title="Grid (1 = land, 0 = water; ✓ = land already flood-filled)">
        <div className="inline-flex flex-col gap-1">
          {state.grid.map((row, r) => (
            <div key={r} className="flex gap-1">
              {row.map((cell, c) => {
                const isCurrent = r === state.currentRow && c === state.currentCol;
                const isVisitedLand = cell === 1 && state.visited[r]?.[c] === 1;
                const cellState: VizState = isCurrent
                  ? 'current'
                  : isVisitedLand
                    ? 'found'
                    : cell === 1
                      ? 'range'
                      : 'plain';

                return <Cell key={c} value={cell} state={cellState} size="sm" />;
              })}
            </div>
          ))}
        </div>
      </VizSection>

      <p className="font-medium text-ink">Islands found: {state.islandCount}</p>
    </VizStack>
  );
}
