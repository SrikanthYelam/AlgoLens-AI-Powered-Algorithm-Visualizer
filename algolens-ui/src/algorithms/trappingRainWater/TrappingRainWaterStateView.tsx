import { WaterBars, type BarRole } from '../../components/WaterBars';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.TrappingRainWaterState (camelCase JSON). */
interface TrappingRainWaterState {
  heights: number[];
  left: number;
  right: number;
  leftMax: number;
  rightMax: number;
  current: number;
  water: number[];
  total: number;
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-gray-50 px-2 py-1 font-mono text-xs dark:border-gray-600 dark:bg-gray-800">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-semibold text-gray-800 dark:text-gray-100">{value}</span>
    </span>
  );
}

export function TrappingRainWaterStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as TrappingRainWaterState;
  const isDone = step.action.startsWith('Done:');

  const roles: Record<number, BarRole> = {};
  if (!isDone) {
    // Pointers now rest on the next unprocessed bars; the bar just handled is highlighted on top.
    if (state.left >= 0) roles[state.left] = 'left';
    if (state.right >= 0) roles[state.right] = 'right';
    if (state.current >= 0) roles[state.current] = 'current';
  }

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Bars (
          <span className="text-indigo-600 dark:text-indigo-400">left</span> /{' '}
          <span className="text-rose-600 dark:text-rose-400">right</span> pointers,{' '}
          <span className="text-amber-600 dark:text-amber-400">bar just processed</span>; blue is trapped water)
        </h3>
        <WaterBars heights={state.heights} water={state.water} roles={roles} />
      </div>

      <div className="flex flex-wrap gap-2">
        <Stat label="left max" value={state.leftMax} />
        <Stat label="right max" value={state.rightMax} />
        <Stat label="water trapped" value={state.total} />
      </div>
    </div>
  );
}
