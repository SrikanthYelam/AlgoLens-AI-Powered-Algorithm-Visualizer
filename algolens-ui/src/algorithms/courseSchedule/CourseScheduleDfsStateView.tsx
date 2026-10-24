import { GraphDiagram, type GraphEdge } from '../../components/graphs';
import { Cell, Chain, Empty, Legend, VizSection, VizStack, Verdict, type VizState } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.CourseScheduleDfsState (camelCase JSON). */
interface CourseScheduleDfsState {
  numCourses: number;
  color: number[];
  path: number[];
  currentCourse: number;
  canFinish: boolean;
}

const COLOR_STATE: VizState[] = ['plain', 'comparing', 'visited'];

export function CourseScheduleDfsStateView({ step, input }: AlgorithmStateViewProps) {
  const state = step.state as CourseScheduleDfsState;
  const isDone = step.action.startsWith('Done:');
  const prerequisites = (input as { prerequisites?: number[][] } | undefined)?.prerequisites ?? [];

  // Edges between consecutive courses on the recursion path are the ones the DFS is walking right now.
  const onPath = new Set(state.path.slice(1).map((course, i) => `${state.path[i]}>${course}`));
  const edges: GraphEdge[] = prerequisites.map(([course, pre]) => ({
    from: pre,
    to: course,
    state: onPath.has(`${pre}>${course}`) ? 'active' : state.color[pre] === 2 ? 'dim' : 'plain',
  }));

  return (
    <VizStack>
      <VizSection
        title={
          <>
            Prerequisite graph · unvisited (plain) <Legend state="comparing">visiting (on the path)</Legend>{' '}
            <Legend state="visited">fully explored</Legend> <Legend state="current">current</Legend>
          </>
        }
      >
        <GraphDiagram
          directed
          edges={edges}
          nodes={state.color.map((colorCode, course) => ({
            id: course,
            state: course === state.currentCourse ? 'current' : COLOR_STATE[colorCode],
          }))}
        />
      </VizSection>

      <VizSection title="Recursion path">
        {state.path.length === 0 ? (
          <Empty>empty</Empty>
        ) : (
          <Chain>
            {state.path.map((course, i) => (
              <Cell key={i} value={course} state="comparing" />
            ))}
          </Chain>
        )}
      </VizSection>

      {isDone && (
        <Verdict ok={state.canFinish}>
          {state.canFinish
            ? `No cycle found — all ${state.numCourses} courses can be finished.`
            : 'A cycle was found — cannot finish.'}
        </Verdict>
      )}
    </VizStack>
  );
}
