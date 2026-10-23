import { Cell, CellRow, Empty, VizSection, VizStack } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.HistogramState (camelCase JSON). `highlights` here are bar indices, not values. */
interface HistogramState {
  heights: number[];
  currentIndex: number;
  stack: number[];
  maxArea: number;
}

const MAX_BAR_HEIGHT_PX = 140;

export function HistogramStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as HistogramState;
  const highlighted = new Set(step.highlights);
  const maxHeight = Math.max(...state.heights, 1);

  return (
    <VizStack>
      <VizSection title="Histogram (solid = bar being popped, dashed = current index)">
        <div className="flex items-end gap-1.5" style={{ height: MAX_BAR_HEIGHT_PX }}>
          {state.heights.map((height, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className={`w-8 rounded-t-xs border transition-colors duration-200 ${
                  highlighted.has(String(i))
                    ? 'border-state-current-border bg-state-current-bg'
                    : i === state.currentIndex
                      ? 'border-dashed border-state-comparing-border bg-state-comparing-bg'
                      : 'border-viz-bar-border bg-viz-bar'
                }`}
                style={{ height: Math.max(4, (height / maxHeight) * MAX_BAR_HEIGHT_PX) }}
              />
              <span className="font-mono text-caption text-ink-muted">{height}</span>
            </div>
          ))}
        </div>
      </VizSection>

      <VizSection title="Stack (bottom → top, indices)">
        <CellRow>
          {state.stack.length === 0 ? <Empty>empty</Empty> : state.stack.map((index, i) => <Cell key={i} value={index} />)}
        </CellRow>
      </VizSection>

      <p className="font-medium text-ink">Max area so far: {state.maxArea}</p>
    </VizStack>
  );
}
