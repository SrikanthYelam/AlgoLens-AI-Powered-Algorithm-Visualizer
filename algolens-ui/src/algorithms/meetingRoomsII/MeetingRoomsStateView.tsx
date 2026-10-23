import { Cell, CellRow, Empty, VizSection, VizStack } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.MeetingRoomsState (camelCase JSON). */
interface MeetingRoomsState {
  sortedIntervals: number[][];
  currentIndex: number;
  heap: number[];
  roomsInUse: number;
  maxRooms: number;
}

export function MeetingRoomsStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as MeetingRoomsState;

  return (
    <VizStack>
      <VizSection title="Meetings (sorted by start time)">
        <CellRow>
          {state.sortedIntervals.map(([start, end], i) => (
            <Cell key={i} value={`[${start},${end}]`} state={i === state.currentIndex ? 'current' : 'plain'} />
          ))}
        </CellRow>
      </VizSection>

      <VizSection title="Rooms in use (end times, earliest first)">
        <CellRow>
          {state.heap.length === 0 ? (
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
