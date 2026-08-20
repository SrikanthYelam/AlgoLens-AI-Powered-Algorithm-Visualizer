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
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Implement the method below and run it against the same input you last ran above.
      </p>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        rows={8}
        className="mt-3 w-full rounded-md border border-gray-300 bg-gray-50 p-3 font-mono text-sm text-gray-800 focus:border-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
      />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleRun}
          disabled={!canRun}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRunning ? 'Running…' : 'Run My Code'}
        </button>
        {input === null && (
          <span className="text-sm text-gray-500 dark:text-gray-400">Run the algorithm above first.</span>
        )}
      </div>

      {error && (
        <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      {result && !result.compileSucceeded && (
        <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          <p className="font-medium">Compile errors:</p>
          <ul className="mt-1 list-inside list-disc space-y-1 font-mono text-xs">
            {result.compileErrors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {result && result.compileSucceeded && !result.ranSuccessfully && (
        <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 font-mono text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {result.runtimeError}
        </p>
      )}

      {result && result.ranSuccessfully && (
        <div className="mt-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                exactMatch
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              {exactMatch ? 'Exact match' : 'Not an exact match'}
            </span>
            {!exactMatch && (
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  orderInsensitiveMatch
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                }`}
              >
                {orderInsensitiveMatch ? 'Matches ignoring order' : 'Does not match'}
              </span>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400">{result.elapsedMilliseconds}ms</span>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Your output
              </p>
              <pre className="mt-1 overflow-x-auto rounded-md border border-gray-200 bg-gray-50 p-2 font-mono text-xs text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
                {JSON.stringify(result.yourAnswer, null, 2)}
              </pre>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Expected output
              </p>
              <pre className="mt-1 overflow-x-auto rounded-md border border-gray-200 bg-gray-50 p-2 font-mono text-xs text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
                {JSON.stringify(result.expectedAnswer, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
        Runs on the server with a soft timeout only — local development use for now, see README.
      </p>
    </div>
  );
}
