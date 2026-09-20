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
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Bars (
          <span className="text-indigo-600 dark:text-indigo-400">left</span> /{' '}
          <span className="text-rose-600 dark:text-rose-400">right</span> pointers
          {!isDone && state.bestLeft >= 0 ? (
            <>
              , <span className="text-emerald-600 dark:text-emerald-400">best so far</span>
            </>
          ) : null}
          )
        </h3>
        <WaterBars heights={state.heights} water={water} roles={roles} />
      </div>

      {hasContainer && (
        <p className="font-mono text-gray-700 dark:text-gray-300">
          {isDone ? 'Best container' : 'This container'}: width {state.right - state.left} × height {level} ={' '}
          <span className="font-semibold">{state.area}</span>
        </p>
      )}
      <p className="font-medium text-gray-700 dark:text-gray-300">Max area so far: {state.maxArea}</p>
    </div>
  );
}
