import { GraphDiagram, type GraphEdge } from '../../components/graphs';
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

export function CourseScheduleKahnStateView({ step, input }: AlgorithmStateViewProps) {
  const state = step.state as CourseScheduleKahnState;
  const taken = new Set(state.order);
  const queued = new Set(state.queue);
  const isDone = step.action.startsWith('Done:');
  const prerequisites = (input as { prerequisites?: number[][] } | undefined)?.prerequisites ?? [];

  // [course, prerequisite]: the arrow runs prerequisite → course; edges leaving the current course are being relaxed.
  const edges: GraphEdge[] = prerequisites.map(([course, pre]) => ({
    from: pre,
    to: course,
    state: pre === state.currentCourse ? 'active' : taken.has(pre) ? 'dim' : 'plain',
  }));

  return (
    <VizStack>
      <VizSection
        title={
          <>
            Prerequisite graph (arrow = must come first) · <Legend state="current">current</Legend>{' '}
            <Legend state="comparing">in queue</Legend> <Legend state="visited">ordered</Legend> · number under a node = unmet prerequisites
          </>
        }
      >
        <GraphDiagram
          directed
          edges={edges}
          nodes={state.inDegree.map((degree, course) => ({
            id: course,
            sub: `in ${degree}`,
            state: course === state.currentCourse ? 'current' : taken.has(course) ? 'visited' : queued.has(course) ? 'comparing' : 'plain',
          }))}
        />
      </VizSection>

      <VizSection title="Queue (courses with no unmet prerequisites)">
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
