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

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="eyebrow">{label}</span>
      <span className="badge px-3 py-1 font-mono text-code">{value}</span>
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
    <div className="panel p-6">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <Badge label="Pattern" value={pattern} />
        <Badge label="Time" value={timeComplexity} />
        <Badge label="Space" value={spaceComplexity} />
      </div>
      <p className="mt-3 text-body-sm text-ink-muted">{complexityNotes}</p>

      <div className="mt-5 grid grid-cols-1 gap-6 border-t border-hairline pt-5 md:grid-cols-2">
        <div>
          <h3 className="eyebrow">Hints</h3>
          <ol className="mt-2 flex flex-col gap-2">
            {hints.slice(0, revealedCount).map((hint, i) => (
              <li key={i} className="step-fade text-body-sm text-ink-muted">
                <span className="font-mono font-medium text-ink-subtle">{i + 1}.</span> {hint}
              </li>
            ))}
          </ol>
          {revealedCount < hints.length && (
            <button
              type="button"
              onClick={() => setRevealedCount((c) => c + 1)}
              className="btn btn-secondary mt-2"
            >
              {revealedCount === 0 ? 'Show hint' : 'Show next hint'} ({revealedCount}/{hints.length})
            </button>
          )}
        </div>

        <div>
          <h3 className="eyebrow">Related problems</h3>
          <ul className="mt-2 flex flex-col gap-2">
            {relatedProblems.map((problem) => (
              <li key={problem.name} className="text-body-sm">
                <span className="font-medium text-ink">{problem.name}</span>
                <span className="text-ink-subtle"> — {problem.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
