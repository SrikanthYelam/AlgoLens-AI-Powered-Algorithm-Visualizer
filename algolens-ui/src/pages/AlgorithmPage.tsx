import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAlgorithm } from '../algorithms/registry';
import { getAlgorithmSource, runAlgorithm, regenerateExplanations } from '../api/client';
import { AlgorithmInfoPanel } from '../components/AlgorithmInfoPanel';
import { CodePanel } from '../components/CodePanel';
import { StepPlayer } from '../components/StepPlayer';
import type { Step } from '../types/algorithm';

export function AlgorithmPage() {
  const { id } = useParams<{ id: string }>();
  const algorithm = id ? getAlgorithm(id) : undefined;

  const [fullSteps, setFullSteps] = useState<Step[] | null>(null);
  const [steps, setSteps] = useState<Step[] | null>(null); // displayed steps (may be truncated for performance)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sourceCode, setSourceCode] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState<unknown | null>(null);

  // Step cap for large runs — default to 500 displayed steps, with an option to show the full run.
  const STEP_DISPLAY_CAP = 500;
  useEffect(() => {
    if (!algorithm) {
      return;
    }
    setSourceCode(null);
    setLastInput(null);
    getAlgorithmSource(algorithm.id)
      .then((response) => setSourceCode(response.source))
      .catch(() => setSourceCode(null));
  }, [algorithm]);

  if (!algorithm) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-8">
        <p className="text-gray-700 dark:text-gray-300">Unknown algorithm: {id}</p>
        <Link to="/" className="text-indigo-600 hover:underline dark:text-indigo-400">
          ← Back home
        </Link>
      </div>
    );
  }

  async function handleSubmit(body: unknown) {
    setIsLoading(true);
    setError(null);
    setLastInput(body);
    try {
      const response = await runAlgorithm(algorithm!.id, body);
      setFullSteps(response.steps);
      if (response.steps.length > STEP_DISPLAY_CAP) {
        setSteps(response.steps.slice(0, STEP_DISPLAY_CAP));
      } else {
        setSteps(response.steps);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run algorithm.');
      setSteps(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-8">
      <div>
        <Link
          to="/"
          className="group inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">←</span>
          <span className="group-hover:underline">Back</span>
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
            {algorithm.name}
          </h1>
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {algorithm.category}
          </span>
        </div>
        <p className="mt-1 text-gray-500 dark:text-gray-400">{algorithm.description}</p>
      </div>

      <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
        <algorithm.InputForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      {fullSteps && fullSteps.length > STEP_DISPLAY_CAP && (
        <div className="rounded-md border-l-4 border-yellow-400 bg-yellow-50 p-3 text-sm dark:bg-yellow-900/30">
          The run produced a large number of steps ({fullSteps.length}). Showing the first {STEP_DISPLAY_CAP} steps for performance.
          <button
            type="button"
            onClick={() => setSteps(fullSteps)}
            className="ml-3 rounded-md bg-indigo-600 px-2 py-1 text-white text-sm hover:bg-indigo-500"
          >
            Show full run
          </button>
        </div>
      )}

      {steps && (
        <StepPlayer
          steps={steps}
          renderState={(step) => <algorithm.StateView step={step} />}
          renderCode={
            sourceCode
              ? (step) => (
                  <CodePanel
                    source={sourceCode}
                    highlightStart={step.sourceLineStart}
                    highlightEnd={step.sourceLineEnd}
                    algorithmId={algorithm.id}
                    judgeSignature={algorithm.judgeSignature}
                    input={lastInput}
                  />
                )
              : undefined
          }
          regenerateExplanation={async (index) => {
            // Regenerate explanation for a single step — call API with only that step.
            const current = steps[index];
            try {
              const texts = await regenerateExplanations(algorithm.id, [current]);
              return texts[0] ?? null;
            } catch (e) {
              console.error('Failed to regenerate explanation', e);
              return null;
            }
          }}
          onUpdateExplanation={(index, explanation) => {
            setSteps((s) => {
              if (!s) return s;
              const copy = s.slice();
              copy[index] = { ...copy[index], explanation };
              return copy;
            });
            // Also update fullSteps if present and truncated
            setFullSteps((fs) => {
              if (!fs) return fs;
              const copy = fs.slice();
              // find the corresponding global index — if truncated, index matches; otherwise do nothing
              if (copy.length >= index + 1) copy[index] = { ...copy[index], explanation };
              return copy;
            });
          }}
        />
      )}

      <AlgorithmInfoPanel
        pattern={algorithm.pattern}
        timeComplexity={algorithm.timeComplexity}
        spaceComplexity={algorithm.spaceComplexity}
        complexityNotes={algorithm.complexityNotes}
        hints={algorithm.hints}
        relatedProblems={algorithm.relatedProblems}
      />
    </div>
  );
}
