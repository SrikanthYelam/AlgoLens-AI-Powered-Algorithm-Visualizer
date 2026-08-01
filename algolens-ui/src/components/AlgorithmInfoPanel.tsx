import { useState } from 'react';
import type { RelatedProblem } from '../algorithms/registry';

interface AlgorithmInfoPanelProps {
  pattern: string;
  hints: string[];
  relatedProblems: RelatedProblem[];
}

/** Reference info for the current algorithm: its pattern, progressive hints, and related problems. */
export function AlgorithmInfoPanel({ pattern, hints, relatedProblems }: AlgorithmInfoPanelProps) {
  const [revealedCount, setRevealedCount] = useState(0);

  return (
    <div className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Pattern</span>
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
          {pattern}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Hints</h3>
          <ol className="mt-2 flex flex-col gap-2">
            {hints.slice(0, revealedCount).map((hint, i) => (
              <li key={i} className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium text-gray-400 dark:text-gray-500">{i + 1}.</span> {hint}
              </li>
            ))}
          </ol>
          {revealedCount < hints.length && (
            <button
              type="button"
              onClick={() => setRevealedCount((c) => c + 1)}
              className="mt-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {revealedCount === 0 ? 'Show hint' : 'Show next hint'} ({revealedCount}/{hints.length})
            </button>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Related problems</h3>
          <ul className="mt-2 flex flex-col gap-2">
            {relatedProblems.map((problem) => (
              <li key={problem.name} className="text-sm">
                <span className="font-medium text-gray-800 dark:text-gray-200">{problem.name}</span>
                <span className="text-gray-500 dark:text-gray-400"> — {problem.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
