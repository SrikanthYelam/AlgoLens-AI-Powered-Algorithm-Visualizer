import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_NUM_COURSES = '4';
const DEFAULT_PREREQUISITES = '1,0\n2,0\n3,1\n3,2';

function parsePrerequisites(text: string): number[][] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) =>
      line
        .split(',')
        .map((token) => token.trim())
        .filter((token) => token.length > 0)
        .map(Number),
    );
}

export function CourseScheduleInputForm({ onSubmit, isLoading, initialInput }: AlgorithmInputFormProps) {
  const parsed = initialInput as { numCourses?: number; prerequisites?: number[][] } | undefined;
  const [numCoursesText, setNumCoursesText] = useState(() =>
    parsed?.numCourses !== undefined ? String(parsed.numCourses) : DEFAULT_NUM_COURSES,
  );
  const [prerequisitesText, setPrerequisitesText] = useState(() =>
    parsed?.prerequisites ? parsed.prerequisites.map((pair) => pair.join(',')).join('\n') : DEFAULT_PREREQUISITES,
  );
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const numCourses = Number(numCoursesText);
    if (!Number.isInteger(numCourses) || numCourses < 0) {
      setError('Number of courses must be a non-negative integer.');
      return;
    }

    const prerequisites = parsePrerequisites(prerequisitesText);
    for (const pair of prerequisites) {
      if (pair.length !== 2 || pair.some((n) => Number.isNaN(n))) {
        setError('Each prerequisite line must be exactly two comma-separated numbers: course,prerequisite.');
        return;
      }
      if (pair.some((n) => n < 0 || n >= numCourses)) {
        setError(`Course numbers must be between 0 and ${Math.max(numCourses - 1, 0)}.`);
        return;
      }
    }

    setError(null);
    onSubmit({ numCourses, prerequisites });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="course-schedule-num-courses" className="text-body-sm font-medium text-ink-muted">
        Number of courses
      </label>
      <input
        id="course-schedule-num-courses"
        value={numCoursesText}
        onChange={(e) => setNumCoursesText(e.target.value)}
        className="w-32 input"
        placeholder={DEFAULT_NUM_COURSES}
      />

      <label htmlFor="course-schedule-prerequisites" className="mt-2 text-body-sm font-medium text-ink-muted">
        Prerequisites (one pair per line: course,prerequisite)
      </label>
      <textarea
        id="course-schedule-prerequisites"
        value={prerequisitesText}
        onChange={(e) => setPrerequisitesText(e.target.value)}
        rows={4}
        className="input font-mono text-code"
        placeholder={DEFAULT_PREREQUISITES}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="self-start btn btn-primary"
      >
        {isLoading ? 'Running…' : 'Run'}
      </button>
      {error && (
        <p className="notice">
          <span aria-hidden="true">✕ </span>
          {error}
        </p>
      )}
    </form>
  );
}
