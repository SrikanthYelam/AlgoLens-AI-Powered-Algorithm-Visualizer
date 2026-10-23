import { VizSection, VizStack } from '../../components/viz';
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
    <span className="inline-flex items-center gap-1.5 rounded-md border border-hairline-strong bg-surface-2 px-2 py-1 font-mono text-caption">
      <span className="text-ink-subtle">{label}</span>
      <span className="font-semibold text-ink">{value}</span>
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
    <VizStack>
      <VizSection title="Bars (L = left pointer, R = right pointer, ● = bar just processed; shaded blocks are trapped water)">
        <WaterBars heights={state.heights} water={state.water} roles={roles} />
      </VizSection>

      <div className="flex flex-wrap gap-2">
        <Stat label="left max" value={state.leftMax} />
        <Stat label="right max" value={state.rightMax} />
        <Stat label="water trapped" value={state.total} />
      </div>
    </VizStack>
  );
}
