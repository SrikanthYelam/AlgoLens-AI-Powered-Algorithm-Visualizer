import { Cell, CellRow, Empty, STATE_CLASSES, VizSection, VizStack } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';
import { previousStepOf } from '../../utils/history';

/** Mirrors AlgoLens.Core.Models.MeetingRoomsState (camelCase JSON). */
interface MeetingRoomsState {
  sortedIntervals: number[][];
  currentIndex: number;
  heap: number[];
  roomsInUse: number;
  maxRooms: number;
}

const LABEL_W = 76;
const ROW_H = 30;
const AXIS_H = 22;

export function MeetingRoomsStateView({ step, history }: AlgorithmStateViewProps) {
  const state = step.state as MeetingRoomsState;
  const prev = previousStepOf(history)?.state as MeetingRoomsState | undefined;
  const maxEnd = Math.max(1, ...state.sortedIntervals.map(([, end]) => end));
  const unit = Math.max(8, Math.min(28, Math.floor(440 / maxEnd)));
  const tickEvery = Math.ceil(maxEnd / 20);
  const now = state.sortedIntervals[state.currentIndex]?.[0];

  // A room freed this step: an end time that was in the previous heap but is gone now.
  const remaining = [...state.heap];
  const freed = (prev?.heap ?? []).filter((end) => {
    const at = remaining.indexOf(end);
    if (at === -1) return true;
    remaining.splice(at, 1);
    return false;
  });

  return (
    <VizStack>
      <VizSection title="Meetings on a time axis (the vertical line is the current meeting's start)">
        <div className="overflow-x-auto pb-2">
          <div
            className="relative"
            style={{ width: LABEL_W + maxEnd * unit + 8, height: AXIS_H + state.sortedIntervals.length * ROW_H }}
          >
            {Array.from({ length: Math.floor(maxEnd / tickEvery) + 1 }, (_, i) => i * tickEvery).map((t) => (
              <span
                key={t}
                className="absolute font-mono text-caption text-ink-subtle"
                style={{ left: LABEL_W + t * unit - 4, top: 0 }}
              >
                {t}
              </span>
            ))}
            {state.sortedIntervals.map(([start, end], i) => (
              <div key={i} className="absolute flex items-center" style={{ top: AXIS_H + i * ROW_H, height: ROW_H - 4, left: 0 }}>
                <span className="font-mono text-caption text-ink-muted" style={{ width: LABEL_W }}>
                  [{start},{end}]
                </span>
                <span
                  className={`absolute h-full rounded-xs border transition-colors duration-200 ${
                    i === state.currentIndex ? STATE_CLASSES.current : i < state.currentIndex ? STATE_CLASSES.range : STATE_CLASSES.plain
                  }`}
                  style={{ left: LABEL_W + start * unit, width: Math.max(4, (end - start) * unit) }}
                />
              </div>
            ))}
            {now !== undefined && (
              <span
                aria-hidden="true"
                className="absolute w-0.5 bg-accent-hover"
                style={{ left: LABEL_W + now * unit - 1, top: AXIS_H - 4, bottom: 0 }}
              />
            )}
          </div>
        </div>
      </VizSection>

      <VizSection title="Rooms in use (the end time of each one, earliest first — the earliest is reused first)">
        <CellRow>
          {freed.map((end, i) => (
            <div key={`freed-${i}`} className="flex flex-col items-center gap-0.5 opacity-70 line-through">
              <Cell value={String(end)} state="discarded" />
              <span className="text-caption no-underline">✕ freed</span>
            </div>
          ))}
          {state.heap.length === 0 && freed.length === 0 ? (
            <Empty>none</Empty>
          ) : (
            state.heap.map((end, i) => <Cell key={i} value={String(end)} state={i === 0 ? 'current' : 'plain'} />)
          )}
        </CellRow>
      </VizSection>

      <p className="font-medium text-ink">
        Rooms in use now: {state.roomsInUse} — max so far: {state.maxRooms}
      </p>
    </VizStack>
  );
}
