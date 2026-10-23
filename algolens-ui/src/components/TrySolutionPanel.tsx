import { useEffect, useState } from 'react';
import { submitSolution } from '../api/client';
import { deepEqual, deepEqualIgnoringOrder } from '../utils/compareAnswers';
import type { SubmitSolutionResponse } from '../types/algorithm';

interface TrySolutionPanelProps {
  algorithmId: string;
  judgeSignature: string;
  input: unknown | null;
}

function skeletonFor(judgeSignature: string): string {
  // A multi-line judgeSignature is already a complete skeleton (e.g. Encode and Decode Strings,
  // where the user implements two methods), so don't wrap it in one more body.
  if (judgeSignature.includes('\n')) {
    return judgeSignature;
  }
  return `${judgeSignature}\n{\n    // your code here\n}`;
}

/**
 * Lets the user paste their own C# solution and run it against the same input they last ran
 * the canonical algorithm with, comparing outputs. Executes server-side via in-process Roslyn
 * scripting with a soft timeout only — not a real sandbox, see README's Pending Enhancements.
 */
export function TrySolutionPanel({ algorithmId, judgeSignature, input }: TrySolutionPanelProps) {
  const [code, setCode] = useState(() => skeletonFor(judgeSignature));
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<SubmitSolutionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset the editor and any previous result when navigating to a different algorithm —
  // AlgorithmPage stays mounted across route param changes, so state wouldn't otherwise reset.
  useEffect(() => {
    setCode(skeletonFor(judgeSignature));
    setResult(null);
    setError(null);
  }, [algorithmId, judgeSignature]);

  const canRun = input !== null && code.trim().length > 0 && !isRunning;

  async function handleRun() {
    if (!canRun) {
      return;
    }
    setIsRunning(true);
    setError(null);
    setResult(null);
    try {
      const response = await submitSolution(algorithmId, input, code);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run your solution.');
    } finally {
      setIsRunning(false);
    }
  }

  const exactMatch = result?.ranSuccessfully ? deepEqual(result.yourAnswer, result.expectedAnswer) : false;
  const orderInsensitiveMatch = result?.ranSuccessfully
    ? deepEqualIgnoringOrder(result.yourAnswer, result.expectedAnswer)
    : false;

  return (
    <div className="p-4">
      <p className="text-body-sm text-ink-muted">
        Implement the method below and run it against the same input you last ran above.
      </p>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        rows={8}
        className="input mt-3 bg-canvas p-3 font-mono text-code"
      />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleRun}
          disabled={!canRun}
          className="btn btn-primary"
        >
          {isRunning ? 'Running…' : 'Run My Code'}
        </button>
        {input === null && (
          <span className="text-body-sm text-ink-subtle">Run the algorithm above first.</span>
        )}
      </div>

      {error && (
        <p className="notice mt-3">
          <span aria-hidden="true">✕ </span>
          {error}
        </p>
      )}

      {result && !result.compileSucceeded && (
        <div className="notice mt-3">
          <p className="font-medium">
            <span aria-hidden="true">✕ </span>Compile errors:
          </p>
          <ul className="mt-1 list-inside list-disc space-y-1 font-mono text-caption">
            {result.compileErrors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {result && result.compileSucceeded && !result.ranSuccessfully && (
        <p className="notice mt-3 font-mono">
          <span aria-hidden="true">✕ </span>
          {result.runtimeError}
        </p>
      )}

      {result && result.ranSuccessfully && (
        <div className="mt-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`badge border px-3 py-1 text-body-sm font-medium ${
                exactMatch
                  ? 'border-state-found-border bg-state-found-bg text-state-found-ink'
                  : 'border-state-visited-border bg-state-visited-bg text-state-visited-ink'
              }`}
            >
              <span aria-hidden="true">{exactMatch ? '✓' : '≠'}</span>
              {exactMatch ? 'Exact match' : 'Not an exact match'}
            </span>
            {!exactMatch && (
              <span
                className={`badge border px-3 py-1 text-body-sm font-medium ${
                  orderInsensitiveMatch
                    ? 'border-state-found-border bg-state-found-bg text-state-found-ink'
                    : 'border-dashed border-state-discarded-border bg-state-discarded-bg text-state-discarded-ink'
                }`}
              >
                <span aria-hidden="true">{orderInsensitiveMatch ? '≈' : '✕'}</span>
                {orderInsensitiveMatch ? 'Matches ignoring order' : 'Does not match'}
              </span>
            )}
            <span className="font-mono text-caption text-ink-subtle">{result.elapsedMilliseconds}ms</span>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <p className="eyebrow">Your output</p>
              <pre className="mt-1 overflow-x-auto rounded-md border border-hairline bg-canvas p-2 font-mono text-caption text-ink">
                {JSON.stringify(result.yourAnswer, null, 2)}
              </pre>
            </div>
            <div>
              <p className="eyebrow">Expected output</p>
              <pre className="mt-1 overflow-x-auto rounded-md border border-hairline bg-canvas p-2 font-mono text-caption text-ink">
                {JSON.stringify(result.expectedAnswer, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      <p className="mt-4 text-caption text-ink-subtle">
        Runs on the server with a soft timeout only — local development use for now, see README.
      </p>
    </div>
  );
}
