import { Cell, CellRow, Empty, VizSection, VizStack } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.NumberOfIslandsIIState (camelCase JSON). */
interface NumberOfIslandsIIState {
  rows: number;
  cols: number;
  parent: number[];
  currentRow: number;
  currentCol: number;
  islandCount: number;
  counts: number[];
}

function findRoot(parent: number[], cell: number): number {
  let root = cell;
  while (parent[root] !== root) {
    root = parent[root];
  }
  return root;
}

// An island is identified by a letter derived from its root cell, so two islands merging is
// visible as two letters becoming one — no per-island color needed.
function islandLetter(root: number): string {
  return String.fromCharCode(65 + (root % 26));
}

export function NumberOfIslandsIIStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as NumberOfIslandsIIState;

  return (
    <VizStack>
      <VizSection title="Grid (letter = island id, · = water, ringed = position just added)">
        <div className="inline-flex flex-col gap-1">
          {Array.from({ length: state.rows }, (_, r) => (
            <div key={r} className="flex gap-1">
              {Array.from({ length: state.cols }, (_, c) => {
                const cell = r * state.cols + c;
                const isLand = state.parent[cell] !== -1;
                const isCurrent = r === state.currentRow && c === state.currentCol;

                return (
                  <Cell
                    key={c}
                    size="sm"
                    value={isLand ? islandLetter(findRoot(state.parent, cell)) : '·'}
                    state={isLand ? 'range' : 'plain'}
                    ring={isCurrent}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </VizSection>

      <p className="font-medium text-ink">Islands right now: {state.islandCount}</p>

      <VizSection title="Answer so far (island count after each addition)">
        <CellRow>
          {state.counts.length === 0 ? (
            <Empty>—</Empty>
          ) : (
            state.counts.map((count, index) => <Cell key={index} value={count} state="visited" size="sm" />)
          )}
        </CellRow>
      </VizSection>
    </VizStack>
  );
}
