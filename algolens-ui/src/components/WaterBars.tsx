export type BarRole = 'left' | 'right' | 'current' | 'best';

interface WaterBarsProps {
  heights: number[];
  /** Water sitting on top of each bar, in the same units as `heights` (0 = none). */
  water: number[];
  /** Highlight role per bar index; later roles in the union win over the plain style. */
  roles?: Record<number, BarRole>;
}

const CHART_HEIGHT_PX = 160;

// Each role pairs a fill/border style with a text marker under the bar, so roles never rely on color.
const ROLE_CLASSES: Record<BarRole, string> = {
  left: 'border-state-current-border bg-state-current-bg',
  right: 'border-dashed border-state-comparing-border bg-state-comparing-bg',
  current: 'border-ink bg-ink-muted',
  best: 'border-state-found-border bg-state-found-bg',
};

const ROLE_MARKERS: Record<BarRole, string> = {
  left: 'L',
  right: 'R',
  current: '●',
  best: '✓',
};

/**
 * A bar chart with a water block stacked on top of each bar. Shared by Container With
 * Most Water and Trapping Rain Water, which differ only in where the water goes.
 */
export function WaterBars({ heights, water, roles = {} }: WaterBarsProps) {
  const max = Math.max(1, ...heights);
  const scale = (value: number) => (value / max) * CHART_HEIGHT_PX;

  return (
    <div className="flex items-end gap-1 overflow-x-auto pb-1">
      {heights.map((height, index) => {
        const role = roles[index];
        const waterHeight = water[index] ?? 0;

        return (
          <div key={index} className="flex w-7 shrink-0 flex-col items-center gap-0.5">
            <div className="flex flex-col justify-end" style={{ height: CHART_HEIGHT_PX }}>
              {waterHeight > 0 && (
                <div
                  className="w-7 border border-b-0 border-accent-focus bg-viz-water transition-all duration-200"
                  style={{ height: scale(waterHeight) }}
                />
              )}
              <div
                className={`w-7 rounded-t-xs border transition-all duration-200 ${
                  role ? ROLE_CLASSES[role] : 'border-viz-bar-border bg-viz-bar'
                }`}
                style={{ height: Math.max(scale(height), height > 0 ? 2 : 0) }}
              />
            </div>
            <span className="font-mono text-caption text-ink">{height}</span>
            <span className="font-mono text-caption text-ink-subtle">{index}</span>
            <span className="h-4 font-mono text-caption font-medium text-accent-hover">
              {role ? ROLE_MARKERS[role] : ''}
            </span>
          </div>
        );
      })}
    </div>
  );
}
