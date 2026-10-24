import { Cell, CellRow, Legend, VizSection, VizStack } from '../../components/viz';
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
  const tasks = [...new Set([...Object.keys(state.remainingCounts), ...Object.keys(state.cooldownUntil)])].sort();
  const horizon = Math.max(state.timeline.length, ...Object.values(state.cooldownUntil), 1);
  const ticks = Array.from({ length: horizon }, (_, k) => k);

  return (
    <VizStack>
      <VizSection
        title={
          <>
            CPU timeline · one lane per task · <Legend state="range">task ran</Legend>{' '}
            <Legend state="comparing">cooling down</Legend> <Legend state="visited">idle tick</Legend>
          </>
        }
      >
        <div className="flex flex-col gap-1 overflow-x-auto p-1">
          <div className="flex items-center gap-1.5">
            <span className="w-20 shrink-0 font-mono text-caption text-ink-subtle">tick</span>
            <CellRow gap="sm">
              {ticks.map((k) => (
                <Cell
                  key={k}
                  size="sm"
                  header
                  value={k}
                  pointer={k === state.currentTick ? 'now' : ''}
                />
              ))}
            </CellRow>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-20 shrink-0 font-mono text-caption text-ink-subtle">CPU</span>
            <CellRow gap="sm">
              {ticks.map((k) => {
                const entry = state.timeline[k];
                return (
                  <Cell
                    key={k}
                    size="sm"
                    value={entry === undefined ? '' : entry === 'idle' ? '·' : entry}
                    state={k === state.currentTick ? 'current' : entry === 'idle' ? 'visited' : 'plain'}
                    unused={entry === undefined}
                  />
                );
              })}
            </CellRow>
          </div>

          {tasks.map((task) => {
            const lastRun = state.timeline.lastIndexOf(task);
            const availableAt = state.cooldownUntil[task] ?? 0;
            return (
              <div key={task} className="flex items-center gap-1.5">
                <span className="w-20 shrink-0 font-mono text-code text-ink">
                  {task} <span className="text-caption text-ink-subtle">×{state.remainingCounts[task] ?? 0}</span>
                </span>
                <CellRow gap="sm">
                  {ticks.map((k) => {
                    const ran = state.timeline[k] === task;
                    const cooling = !ran && k > lastRun && k < availableAt && lastRun >= 0;
                    return (
                      <Cell
                        key={k}
                        size="sm"
                        value={ran ? task : cooling ? '⏳' : ''}
                        state={ran ? 'range' : cooling ? 'comparing' : 'plain'}
                        unused={!ran && !cooling}
                      />
                    );
                  })}
                </CellRow>
              </div>
            );
          })}
        </div>
      </VizSection>
    </VizStack>
  );
}
