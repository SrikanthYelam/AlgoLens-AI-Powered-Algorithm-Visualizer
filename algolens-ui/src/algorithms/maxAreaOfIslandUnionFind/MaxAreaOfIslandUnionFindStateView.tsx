import { Cell, CellRow, Empty, EntryCell, VizSection, VizStack } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.MaxAreaOfIslandUnionFindState (camelCase JSON). */
interface MaxAreaOfIslandUnionFindState {
  rows: number;
  cols: number;
  parent: number[];
  size: number[];
  currentRow: number;
  currentCol: number;
  maxArea: number;
}

function findRoot(parent: number[], cell: number): number {
  let root = cell;
  while (parent[root] !== root) {
    root = parent[root];
  }
  return root;
}

// Same letter-per-root labelling as Number of Islands II, so a merge shows as two letters becoming one.
function islandLetter(root: number): string {
  return String.fromCharCode(65 + (root % 26));
}

export function MaxAreaOfIslandUnionFindStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as MaxAreaOfIslandUnionFindState;
  const hasCurrent = state.currentRow >= 0;
  const currentRoot = hasCurrent ? findRoot(state.parent, state.currentRow * state.cols + state.currentCol) : -1;
  const roots = state.parent.flatMap((p, i) => (p === i ? [i] : []));

  return (
    <VizStack>
      <VizSection title="Grid (letter = island id, · = water or not yet scanned, ringed = cell being scanned)">
        <div className="inline-flex flex-col gap-1">
          {Array.from({ length: state.rows }, (_, r) => (
            <div key={r} className="flex gap-1">
              {Array.from({ length: state.cols }, (_, c) => {
                const cell = r * state.cols + c;
                const isLand = state.parent[cell] !== -1;
                const root = isLand ? findRoot(state.parent, cell) : -1;

                return (
                  <Cell
                    key={c}
                    size="sm"
                    value={isLand ? islandLetter(root) : '·'}
                    state={!isLand ? 'plain' : root === currentRoot ? 'current' : 'range'}
                    ring={r === state.currentRow && c === state.currentCol}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </VizSection>

      <VizSection title="Island areas (size at each root)">
        <CellRow>
          {roots.length === 0 ? (
            <Empty>—</Empty>
          ) : (
            roots.map((root) => (
              <EntryCell
                key={root}
                entryKey={islandLetter(root)}
                value={state.size[root]}
                state={state.size[root] === state.maxArea ? 'found' : root === currentRoot ? 'current' : 'plain'}
              />
            ))
          )}
        </CellRow>
      </VizSection>

      <p className="font-medium text-ink">Max area so far: {state.maxArea}</p>
    </VizStack>
  );
}
