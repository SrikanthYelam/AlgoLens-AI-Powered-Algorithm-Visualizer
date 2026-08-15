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

  // Step cap for large runs — default to 500 displayed steps, with an option to show the full run.
  const STEP_DISPLAY_CAP = 500;
  useEffect(() => {
    if (!algorithm) {
      return;
    }
    setSourceCode(null);
    getAlgorithmSource(algorithm.id)
      .then((response) => setSourceCode(response.source))
      .catch(() => setSourceCode(null));
  }, [algorithm]);

  if (!algorithm) {
    return (
      <div className="mx-auto max-w-2xl p-8">
        <p className="text-gray-700 dark:text-gray-300">Unknown algorithm: {id}</p>
        <Link to="/" className="text-indigo-600 hover:underline">
          ← Back home
        </Link>
      </div>
    );
  }

  async function handleSubmit(body: unknown) {
    setIsLoading(true);
    setError(null);
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
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-8">
      <div>
        <Link to="/" className="text-sm text-indigo-600 hover:underline">
          ← Back
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">{algorithm.name}</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">{algorithm.description}</p>
      </div>

      <algorithm.InputForm onSubmit={handleSubmit} isLoading={isLoading} />

      {error && <p className="text-sm text-red-600">{error}</p>}

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
        hints={algorithm.hints}
        relatedProblems={algorithm.relatedProblems}
      />
    </div>
  );
}
