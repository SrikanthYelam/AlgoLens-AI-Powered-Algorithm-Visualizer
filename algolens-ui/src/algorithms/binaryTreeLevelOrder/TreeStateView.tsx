import { Cell, CellRow, Empty, VizSection, VizStack } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.TreeTraversalState (camelCase JSON). */
interface TreeTraversalState {
  queue: (number | null)[];
  completedLevels: number[][];
  currentLevelInProgress: number[];
}

export function TreeStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as TreeTraversalState;
  const highlighted = new Set(step.highlights);

  return (
    <VizStack>
      <VizSection title="Queue">
        <CellRow>
          {state.queue.length === 0 ? (
            <Empty>empty</Empty>
          ) : (
            state.queue.map((value, i) => (
              <Cell
                key={i}
                value={value === null ? '·' : value}
                state={value !== null && highlighted.has(String(value)) ? 'current' : 'plain'}
              />
            ))
          )}
        </CellRow>
      </VizSection>

      {state.currentLevelInProgress.length > 0 && (
        <VizSection title="Current level (in progress)">
          <CellRow>
            {state.currentLevelInProgress.map((value, i) => (
              <Cell key={i} value={value} state={highlighted.has(String(value)) ? 'current' : 'plain'} />
            ))}
          </CellRow>
        </VizSection>
      )}

      <VizSection title="Completed levels">
        {state.completedLevels.length === 0 ? (
          <Empty>none yet</Empty>
        ) : (
          <div className="flex flex-col gap-1.5">
            {state.completedLevels.map((level, i) => (
              <div key={i} className="flex flex-wrap items-center gap-1.5">
                <span className="w-16 shrink-0 font-mono text-caption text-ink-subtle">Level {i}</span>
                {level.map((value, j) => (
                  <Cell key={j} value={value} state={highlighted.has(String(value)) ? 'current' : 'visited'} />
                ))}
              </div>
            ))}
          </div>
        )}
      </VizSection>
    </VizStack>
  );
}
