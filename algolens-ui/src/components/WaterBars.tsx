export type BarRole = 'left' | 'right' | 'current' | 'best';

interface WaterBarsProps {
  heights: number[];
  /** Water sitting on top of each bar, in the same units as `heights` (0 = none). */
  water: number[];
  /** Highlight role per bar index; later roles in the union win over the plain style. */
  roles?: Record<number, BarRole>;
}

const CHART_HEIGHT_PX = 160;

const ROLE_CLASSES: Record<BarRole, string> = {
  left: 'border-indigo-600 bg-indigo-500',
  right: 'border-rose-600 bg-rose-500',
  current: 'border-amber-600 bg-amber-500',
  best: 'border-emerald-600 bg-emerald-500',
};

/**
 * A bar chart with a translucent water block stacked on top of each bar. Shared by Container With
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
                  className="w-7 border border-b-0 border-sky-300 bg-sky-200/70 transition-all duration-200 dark:border-sky-700 dark:bg-sky-500/40"
                  style={{ height: scale(waterHeight) }}
                />
              )}
              <div
                className={`w-7 rounded-t-sm border transition-all duration-200 ${
                  role
                    ? ROLE_CLASSES[role]
                    : 'border-gray-400 bg-gray-300 dark:border-gray-500 dark:bg-gray-600'
                }`}
                style={{ height: Math.max(scale(height), height > 0 ? 2 : 0) }}
              />
            </div>
            <span className="font-mono text-[11px] text-gray-700 dark:text-gray-300">{height}</span>
            <span className="text-[10px] text-gray-400">{index}</span>
          </div>
        );
      })}
    </div>
  );
}
