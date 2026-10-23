import { Cell, CellRow, Chain, Empty, Legend, VizSection, VizStack, Verdict, type VizState } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.CourseScheduleDfsState (camelCase JSON). */
interface CourseScheduleDfsState {
  numCourses: number;
  color: number[];
  path: number[];
  currentCourse: number;
  canFinish: boolean;
}

const COLOR_LABEL = ['unvisited', 'visiting', 'visited'];
const COLOR_STATE: VizState[] = ['plain', 'comparing', 'visited'];

export function CourseScheduleDfsStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as CourseScheduleDfsState;
  const isDone = step.action.startsWith('Done:');

  return (
    <VizStack>
      <VizSection
        title={
          <>
            Courses · unvisited (plain) <Legend state="comparing">visiting</Legend> <Legend state="visited">visited</Legend>{' '}
            ringed = current
          </>
        }
      >
        <CellRow>
          {state.color.map((colorCode, course) => (
            <Cell
              key={course}
              value={course}
              state={COLOR_STATE[colorCode]}
              ring={course === state.currentCourse}
              title={COLOR_LABEL[colorCode]}
            />
          ))}
        </CellRow>
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
