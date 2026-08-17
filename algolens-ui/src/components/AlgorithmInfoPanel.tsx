import { useState } from 'react';
import type { RelatedProblem } from '../algorithms/registry';

interface AlgorithmInfoPanelProps {
  pattern: string;
  timeComplexity: string;
  spaceComplexity: string;
  complexityNotes: string;
  hints: string[];
  relatedProblems: RelatedProblem[];
}

function Badge({ label, value, tone }: { label: string; value: string; tone: 'indigo' | 'emerald' | 'amber' }) {
  const toneClasses = {
    indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  }[tone];

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <span className={`rounded-full px-3 py-1 font-mono text-sm font-medium ${toneClasses}`}>{value}</span>
    </div>
  );
}

/** Reference info for the current algorithm: its pattern, complexity, progressive hints, and related problems. */
export function AlgorithmInfoPanel({
  pattern,
  timeComplexity,
  spaceComplexity,
  complexityNotes,
  hints,
  relatedProblems,
}: AlgorithmInfoPanelProps) {
  const [revealedCount, setRevealedCount] = useState(0);

  return (
    <div className="rounded-lg border border-gray-200 p-5 dark:border-gray-700">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <Badge label="Pattern" value={pattern} tone="indigo" />
        <Badge label="Time" value={timeComplexity} tone="emerald" />
        <Badge label="Space" value={spaceComplexity} tone="amber" />
      </div>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{complexityNotes}</p>

      <div className="mt-5 grid grid-cols-1 gap-6 border-t border-gray-100 pt-5 dark:border-gray-800 md:grid-cols-2">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Hints</h3>
          <ol className="mt-2 flex flex-col gap-2">
            {hints.slice(0, revealedCount).map((hint, i) => (
              <li key={i} className="step-fade text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium text-gray-400 dark:text-gray-500">{i + 1}.</span> {hint}
              </li>
            ))}
          </ol>
          {revealedCount < hints.length && (
            <button
              type="button"
              onClick={() => setRevealedCount((c) => c + 1)}
              className="mt-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {revealedCount === 0 ? 'Show hint' : 'Show next hint'} ({revealedCount}/{hints.length})
            </button>
          )}
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Related problems
          </h3>
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
