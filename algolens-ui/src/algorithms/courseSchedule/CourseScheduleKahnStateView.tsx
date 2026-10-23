import { Cell, CellRow, Empty, Legend, VizSection, VizStack, Verdict } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.CourseScheduleKahnState (camelCase JSON). */
interface CourseScheduleKahnState {
  numCourses: number;
  inDegree: number[];
  queue: number[];
  order: number[];
  currentCourse: number;
  canFinish: boolean;
}

export function CourseScheduleKahnStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as CourseScheduleKahnState;
  const taken = new Set(state.order);
  const isDone = step.action.startsWith('Done:');

  return (
    <VizStack>
      <VizSection
        title={
          <>
            Courses (in-degree) · <Legend state="current">current</Legend> <Legend state="visited">already ordered</Legend>
          </>
        }
      >
        <CellRow>
          {state.inDegree.map((degree, course) => (
            <Cell
              key={course}
              value={`${course}:${degree}`}
              state={course === state.currentCourse ? 'current' : taken.has(course) ? 'visited' : 'plain'}
            />
          ))}
        </CellRow>
      </VizSection>

      <VizSection title="Queue">
        <CellRow>
          {state.queue.length === 0 ? (
            <Empty>empty</Empty>
          ) : (
            state.queue.map((course, i) => <Cell key={i} value={String(course)} />)
          )}
        </CellRow>
      </VizSection>

      <VizSection title={`Topological order (${state.order.length}/${state.numCourses})`}>
        <CellRow>
          {state.order.length === 0 ? (
            <Empty>none yet</Empty>
          ) : (
            state.order.map((course, i) => <Cell key={i} value={String(course)} />)
          )}
        </CellRow>
      </VizSection>

      {isDone && (
        <Verdict ok={state.canFinish}>
          {state.canFinish ? 'All courses scheduled — no cycle.' : 'A cycle exists — cannot finish.'}
        </Verdict>
      )}
    </VizStack>
  );
}
