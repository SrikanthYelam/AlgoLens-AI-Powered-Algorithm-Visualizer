export type BarRole = 'left' | 'right' | 'current' | 'best';

export interface BarLevel {
  /** Height, in the same units as the bars. */
  value: number;
  label: string;
  /** Which end of the chart the label sits at (keeps two close levels from overlapping). */
  side?: 'left' | 'right';
}

interface WaterBarsProps {
  heights: number[];
  /** Water sitting on top of each bar, in the same units as `heights` (0 = none). */
  water: number[];
  /** Highlight role per bar index; later roles in the union win over the plain style. */
  roles?: Record<number, BarRole>;
  /** Dashed horizontal reference lines across the chart (running maxima, water level). */
  levels?: BarLevel[];
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
export function WaterBars({ heights, water, roles = {}, levels = [] }: WaterBarsProps) {
  const max = Math.max(1, ...heights);
  const scale = (value: number) => (value / max) * CHART_HEIGHT_PX;

  return (
    <div className="relative flex items-end gap-1 overflow-x-auto pb-1">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0" style={{ height: CHART_HEIGHT_PX }}>
        {levels.map((level) => (
          <div
            key={level.label}
            className="absolute inset-x-0 border-t border-dashed border-accent-hover"
            style={{ bottom: scale(level.value) }}
          >
            <span
              className={`absolute -top-4 whitespace-nowrap bg-canvas px-1 font-mono text-caption text-accent-hover ${
                level.side === 'right' ? 'right-0' : 'left-0'
              }`}
            >
              {level.label} = {level.value}
            </span>
          </div>
        ))}
      </div>
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
            <span className="flex h-7 flex-col items-center font-mono text-caption leading-none font-medium text-accent-hover">
              {role ? (
                <>
                  <span aria-hidden="true">▲</span>
                  <span>{ROLE_MARKERS[role]}</span>
                </>
              ) : null}
            </span>
          </div>
        );
      })}
    </div>
  );
}
