import { StackView } from '../../components/structures';
import { VizSection, VizStack } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';
import { previousStepOf } from '../../utils/history';

/** Mirrors AlgoLens.Core.Models.HistogramState (camelCase JSON). `highlights` here are bar indices, not values. */
interface HistogramState {
  heights: number[];
  currentIndex: number;
  stack: number[];
  maxArea: number;
}

const MAX_BAR_HEIGHT_PX = 140;
const BAR_W = 32;
const GAP = 6;
const LABEL_H = 54; // height + index + pointer labels under each bar

export function HistogramStateView({ step, history }: AlgorithmStateViewProps) {
  const state = step.state as HistogramState;
  const prev = previousStepOf(history)?.state as HistogramState | undefined;
  const highlighted = new Set(step.highlights);
  const maxHeight = Math.max(...state.heights, 1);
  const scale = (h: number) => Math.max(4, (h / maxHeight) * MAX_BAR_HEIGHT_PX);
  const onStack = new Set(state.stack);

  // A step can pop several bars (and push the current one). Each popped bar's rectangle runs from
  // the bar below it on the previous stack (exclusive) up to the current index (exclusive).
  const rects = (prev?.stack ?? [])
    .map((index, pos) => ({ index, pos }))
    .filter(({ index }) => !state.stack.includes(index))
    .map(({ index, pos }) => {
      const left = pos > 0 ? prev!.stack[pos - 1] + 1 : 0;
      const width = state.currentIndex - left;
      return { left, width, height: state.heights[index], area: state.heights[index] * width };
    });

  const toItem = (index: number) => ({
    id: index,
    node: (
      <>
        bar {index} · h={state.heights[index]}
      </>
    ),
  });

  return (
    <VizStack>
      <div className="flex flex-wrap items-start gap-x-10 gap-y-4">
        <VizSection title="Histogram (dashed box = rectangle just closed, ringed bars are on the stack)">
          <div className="relative overflow-x-auto pt-6" style={{ height: MAX_BAR_HEIGHT_PX + LABEL_H + 24 }}>
            <div className="relative flex items-end" style={{ gap: GAP, height: MAX_BAR_HEIGHT_PX + LABEL_H }}>
              {state.heights.map((height, i) => (
                <div key={i} className="flex flex-col items-center" style={{ width: BAR_W }}>
                  <div
                    className={`w-full rounded-t-xs border transition-colors duration-200 ${
                      highlighted.has(String(i))
                        ? 'border-state-current-border bg-state-current-bg'
                        : i === state.currentIndex
                          ? 'border-dashed border-state-comparing-border bg-state-comparing-bg'
                          : onStack.has(i)
                            ? 'border-accent-hover bg-state-range-bg'
                            : 'border-viz-bar-border bg-viz-bar'
                    }`}
                    style={{ height: scale(height) }}
                  />
                  <span className="mt-1 font-mono text-caption text-ink">{height}</span>
                  <span className="font-mono text-caption text-ink-subtle">{i}</span>
                  <span className="h-4 font-mono text-caption leading-none text-accent-hover">
                    {i === state.currentIndex ? '▲ i' : ''}
                  </span>
                </div>
              ))}
              {rects.map((rect) => (
                <div
                  key={rect.left + ':' + rect.height}
                  aria-label={`rectangle ${rect.height} by ${rect.width}`}
                  className="pointer-events-none absolute border-2 border-dashed border-accent-hover"
                  style={{
                    left: rect.left * (BAR_W + GAP) - 2,
                    width: rect.width * (BAR_W + GAP) - GAP + 4,
                    bottom: LABEL_H,
                    height: scale(rect.height),
                  }}
                >
                  <span className="absolute -top-5 left-0 whitespace-nowrap font-mono text-caption text-accent-hover">
                    {rect.height} × {rect.width} = {rect.area}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </VizSection>

        <VizSection title="Stack (bar indices, increasing heights)">
          <StackView items={state.stack.map(toItem)} prevItems={prev?.stack.map(toItem)} />
        </VizSection>
      </div>

      <p className="font-medium text-ink">Max area so far: {state.maxArea}</p>
    </VizStack>
  );
}
