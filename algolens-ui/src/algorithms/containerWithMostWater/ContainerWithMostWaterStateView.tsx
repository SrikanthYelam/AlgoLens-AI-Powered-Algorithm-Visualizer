import { VizSection, VizStack } from '../../components/viz';
import { WaterBars, type BarRole } from '../../components/WaterBars';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.ContainerWithMostWaterState (camelCase JSON). */
interface ContainerWithMostWaterState {
  heights: number[];
  left: number;
  right: number;
  area: number;
  maxArea: number;
  bestLeft: number;
  bestRight: number;
}

export function ContainerWithMostWaterStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as ContainerWithMostWaterState;
  const hasContainer = state.left >= 0 && state.right > state.left;
  const isDone = step.action.startsWith('Done:');

  // Water fills each bar's gap up to the container's height (the shorter of the two walls).
  const level = hasContainer ? Math.min(state.heights[state.left], state.heights[state.right]) : 0;
  const water = state.heights.map((h, i) =>
    hasContainer && i > state.left && i < state.right && h < level ? level - h : 0,
  );

  const roles: Record<number, BarRole> = {};
  if (!isDone && state.bestLeft >= 0) {
    roles[state.bestLeft] = 'best';
    roles[state.bestRight] = 'best';
  }
  if (hasContainer) {
    roles[state.left] = isDone ? 'best' : 'left';
    roles[state.right] = isDone ? 'best' : 'right';
  }

  return (
    <VizStack>
      <VizSection title={`Bars (L = left pointer, R = right pointer${!isDone && state.bestLeft >= 0 ? ', ✓ = best so far' : ''})`}>
        <WaterBars
          heights={state.heights}
          water={water}
          roles={roles}
          levels={hasContainer && level > 0 ? [{ value: level, label: 'water level (shorter wall)', side: 'right' }] : []}
        />
      </VizSection>

      {hasContainer && (
        <p className="font-mono text-ink-muted">
          {isDone ? 'Best container' : 'This container'}: width {state.right - state.left} × height {level} ={' '}
          <span className="font-semibold">{state.area}</span>
        </p>
      )}
      <p className="font-medium text-ink">Max area so far: {state.maxArea}</p>
    </VizStack>
  );
}
