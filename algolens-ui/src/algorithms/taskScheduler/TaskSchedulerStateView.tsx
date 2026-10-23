import { Cell, CellRow, Empty, VizSection, VizStack } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.TaskSchedulerState (camelCase JSON). */
interface TaskSchedulerState {
  timeline: string[];
  remainingCounts: Record<string, number>;
  cooldownUntil: Record<string, number>;
  currentTick: number;
}

export function TaskSchedulerStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as TaskSchedulerState;

  const remainingEntries = Object.entries(state.remainingCounts).sort(([a], [b]) => a.localeCompare(b));
  const onCooldown = Object.entries(state.cooldownUntil)
    .filter(([, availableAt]) => availableAt > state.currentTick)
    .sort(([, a], [, b]) => a - b);

  return (
    <VizStack>
      <VizSection title="Timeline">
        <CellRow>
          {state.timeline.map((entry, i) => (
            <Cell
              key={i}
              value={entry === 'idle' ? '·' : entry}
              state={i === state.currentTick ? 'current' : entry === 'idle' ? 'visited' : 'plain'}
            />
          ))}
        </CellRow>
      </VizSection>

      <VizSection title="Remaining counts">
        <CellRow>
          {remainingEntries.length === 0 ? (
            <Empty>none</Empty>
          ) : (
            remainingEntries.map(([task, count]) => (
              <Cell key={task} value={`${task}:${count}`} state={count === 0 ? 'visited' : 'plain'} />
            ))
          )}
        </CellRow>
      </VizSection>

      <VizSection title="On cooldown until">
        <CellRow>
          {onCooldown.length === 0 ? (
            <Empty>none</Empty>
          ) : (
            onCooldown.map(([task, availableAt]) => <Cell key={task} value={`${task}→${availableAt}`} />)
          )}
        </CellRow>
      </VizSection>
    </VizStack>
  );
}
