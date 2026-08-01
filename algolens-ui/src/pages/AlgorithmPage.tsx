import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAlgorithm } from '../algorithms/registry';
import { getAlgorithmSource, runAlgorithm } from '../api/client';
import { CodePanel } from '../components/CodePanel';
import { StepPlayer } from '../components/StepPlayer';
import type { Step } from '../types/algorithm';

export function AlgorithmPage() {
  const { id } = useParams<{ id: string }>();
  const algorithm = id ? getAlgorithm(id) : undefined;

  const [steps, setSteps] = useState<Step[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sourceCode, setSourceCode] = useState<string | null>(null);

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
      setSteps(response.steps);
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
        />
      )}
    </div>
  );
}
