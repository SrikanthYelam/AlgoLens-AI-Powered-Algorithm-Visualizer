import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getExamples } from '../algorithms/examples';
import { getAlgorithm } from '../algorithms/registry';
import { getCategoryStyle } from '../algorithms/categoryStyles';
import { getAlgorithmSource, runAlgorithm, regenerateExplanations } from '../api/client';
import { AlgorithmInfoPanel } from '../components/AlgorithmInfoPanel';
import { AskQuestionPanel } from '../components/AskQuestionPanel';
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
  // Label of the example last run via a preset chip; null when the last run came from the form.
  const [activeExample, setActiveExample] = useState<string | null>(null);
  // Remounts the InputForm with a specific example's values (via `key` + `initialInput`) only
  // when an example chip is clicked — a plain form submit never touches these, so hand-edited
  // field values are never clobbered by the act of running them.
  const [formResetKey, setFormResetKey] = useState(0);
  const [formInitialInput, setFormInitialInput] = useState<unknown>(undefined);
  // Bumped once per successful run (not on in-place updates like a regenerated explanation) and
  // used as StepPlayer's `key` — remounting it resets its current-step index back to 0 and clears
  // the Ask-a-Question panel's transcript, both of which should start fresh on a new run rather
  // than carrying over from whatever example/input ran before.
  const [runKey, setRunKey] = useState(0);
  // Collapses the "Try an example" + InputForm card down to a one-line input summary after a
  // successful run, since the form itself isn't needed again until the user wants to change
  // something — reclaims the vertical space it otherwise keeps occupying under the step player.
  const [isInputCollapsed, setIsInputCollapsed] = useState(false);

  // Step cap for large runs — default to 500 displayed steps, with an option to show the full run.
  const STEP_DISPLAY_CAP = 500;
  useEffect(() => {
    if (!algorithm) {
      return;
    }
    setSourceCode(null);
    setLastInput(null);
    setActiveExample(null);
    setFormInitialInput(undefined);
    setIsInputCollapsed(false);
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

  const style = getCategoryStyle(algorithm.category);
  const examples = getExamples(algorithm.id);

  async function handleSubmit(body: unknown, exampleLabel: string | null = null) {
    setIsLoading(true);
    setError(null);
    setLastInput(body);
    setActiveExample(exampleLabel);
    try {
      const response = await runAlgorithm(algorithm!.id, body);
      setFullSteps(response.steps);
      if (response.steps.length > STEP_DISPLAY_CAP) {
        setSteps(response.steps.slice(0, STEP_DISPLAY_CAP));
      } else {
        setSteps(response.steps);
      }
      setRunKey((k) => k + 1);
      setIsInputCollapsed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run algorithm.');
      setSteps(null);
      setIsInputCollapsed(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-4 pb-8 sm:px-8">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/"
            className="group inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">←</span>
            <span className="group-hover:underline">Back</span>
          </Link>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
            {algorithm.name}
          </h1>
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}
          >
            {style.icon}
            {algorithm.category}
          </span>
        </div>
        <p className="mt-1 text-gray-500 dark:text-gray-400">{algorithm.description}</p>
      </div>

      <div className={`rounded-lg border border-gray-200 border-t-4 p-4 dark:border-gray-700 ${style.borderTop}`}>
        {isInputCollapsed && lastInput !== null ? (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="truncate font-mono text-xs text-gray-500 dark:text-gray-400" title={JSON.stringify(lastInput)}>
              {activeExample ? `${activeExample} — ` : ''}Input: {JSON.stringify(lastInput)}
            </p>
            <button
              type="button"
              onClick={() => {
                setFormInitialInput(lastInput);
                setFormResetKey((k) => k + 1);
                setIsInputCollapsed(false);
              }}
              className="shrink-0 rounded-md border border-gray-300 px-3 py-1 text-xs font-medium transition-colors duration-150 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              Edit input
            </button>
          </div>
        ) : (
          <>
            {examples.length > 0 && (
              <div className="mb-4 flex flex-col gap-2 border-b border-gray-200 pb-4 dark:border-gray-700">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Try an example:</span>
                  {examples.map((example) => (
                    <button
                      key={example.label}
                      type="button"
                      onClick={() => {
                        setFormInitialInput(example.input);
                        setFormResetKey((k) => k + 1);
                        handleSubmit(example.input, example.label);
                      }}
                      disabled={isLoading}
                      aria-pressed={activeExample === example.label}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150 disabled:opacity-50 ${
                        activeExample === example.label
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800'
                      }`}
                    >
                      {example.label}
                    </button>
                  ))}
                </div>
                {activeExample && (
                  <p className="truncate font-mono text-xs text-gray-500 dark:text-gray-400" title={JSON.stringify(lastInput)}>
                    Input: {JSON.stringify(lastInput)}
                  </p>
                )}
              </div>
            )}
            <algorithm.InputForm
              key={formResetKey}
              onSubmit={(body) => handleSubmit(body)}
              isLoading={isLoading}
              initialInput={formInitialInput}
            />
          </>
        )}
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
          key={runKey}
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
          renderAskPanel={(step) => (
            <AskQuestionPanel
              algorithmId={algorithm.id}
              algorithmName={algorithm.name}
              algorithmDescription={algorithm.description}
              step={step}
            />
          )}
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
