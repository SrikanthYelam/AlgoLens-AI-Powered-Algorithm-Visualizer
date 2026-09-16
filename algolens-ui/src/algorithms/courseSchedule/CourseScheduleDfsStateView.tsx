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

function ColorBox({ course, colorCode, highlighted }: { course: number; colorCode: number; highlighted: boolean }) {
  const palette =
    colorCode === 1
      ? 'border-amber-500 bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200'
      : colorCode === 2
        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300'
        : 'border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200';

  return (
    <span
      className={`transition-colors duration-200 inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 font-mono text-sm ${palette} ${
        highlighted ? 'ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-gray-900' : ''
      }`}
      title={COLOR_LABEL[colorCode]}
    >
      {course}
    </span>
  );
}

export function CourseScheduleDfsStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as CourseScheduleDfsState;
  const isDone = step.action.startsWith('Done:');

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Courses (gray = unvisited, amber = visiting, green = visited)
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {state.color.map((colorCode, course) => (
            <ColorBox key={course} course={course} colorCode={colorCode} highlighted={course === state.currentCourse} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Recursion path</h3>
        <div className="flex flex-wrap items-center gap-1.5">
          {state.path.length === 0 ? (
            <span className="text-gray-400">empty</span>
          ) : (
            state.path.map((course, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-gray-400">→</span>}
                <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-amber-500 bg-amber-100 px-2 font-mono text-sm text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                  {course}
                </span>
              </span>
            ))
          )}
        </div>
      </div>

      {isDone && (
        <p
          className={
            state.canFinish
              ? 'font-medium text-emerald-600 dark:text-emerald-400'
              : 'font-medium text-rose-600 dark:text-rose-400'
          }
        >
          {state.canFinish ? `No cycle found — all ${state.numCourses} courses can be finished.` : 'A cycle was found — cannot finish.'}
        </p>
      )}
    </div>
  );
}
