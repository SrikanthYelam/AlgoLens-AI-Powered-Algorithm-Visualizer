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

function Box({ label, highlighted, muted }: { label: string; highlighted: boolean; muted: boolean }) {
  return (
    <span
      className={`transition-colors duration-200 inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 font-mono text-sm ${
        highlighted
          ? 'border-indigo-500 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200'
          : muted
            ? 'border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500'
            : 'border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
      }`}
    >
      {label}
    </span>
  );
}

export function CourseScheduleKahnStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as CourseScheduleKahnState;
  const taken = new Set(state.order);
  const isDone = step.action.startsWith('Done:');

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Courses (in-degree)</h3>
        <div className="flex flex-wrap gap-1.5">
          {state.inDegree.map((degree, course) => (
            <Box
              key={course}
              label={`${course}:${degree}`}
              highlighted={course === state.currentCourse}
              muted={taken.has(course)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Queue</h3>
        <div className="flex flex-wrap gap-1.5">
          {state.queue.length === 0 ? (
            <span className="text-gray-400">empty</span>
          ) : (
            state.queue.map((course, i) => <Box key={i} label={String(course)} highlighted={false} muted={false} />)
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Topological order ({state.order.length}/{state.numCourses})
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {state.order.length === 0 ? (
            <span className="text-gray-400">none yet</span>
          ) : (
            state.order.map((course, i) => <Box key={i} label={String(course)} highlighted={false} muted={false} />)
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
          {state.canFinish ? 'All courses scheduled — no cycle.' : 'A cycle exists — cannot finish.'}
        </p>
      )}
    </div>
  );
}
