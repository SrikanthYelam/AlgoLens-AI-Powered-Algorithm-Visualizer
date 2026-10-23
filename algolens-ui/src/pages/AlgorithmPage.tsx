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
        <p className="text-ink-muted">Unknown algorithm: {id}</p>
        <Link to="/" className="text-accent-hover hover:underline">
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
    <div className="mx-auto flex max-w-content flex-col gap-6 px-4 pt-6 pb-12 sm:px-8">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/"
            className="group inline-flex items-center gap-1 text-body-sm font-medium text-accent-hover"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">←</span>
            <span className="group-hover:underline">Back</span>
          </Link>
          <span className="text-ink-tertiary" aria-hidden="true">/</span>
          <h1 className="text-headline font-semibold text-ink">
            {algorithm.name}
          </h1>
          <span className={`badge ${style.text}`}>
            {style.icon}
            {algorithm.category}
          </span>
        </div>
        <p className="mt-2 text-body text-ink-muted">{algorithm.description}</p>
      </div>

      <div className="panel p-6">
        {isInputCollapsed && lastInput !== null ? (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="truncate font-mono text-caption text-ink-subtle" title={JSON.stringify(lastInput)}>
              {activeExample ? `${activeExample} — ` : ''}Input: {JSON.stringify(lastInput)}
            </p>
            <button
              type="button"
              onClick={() => {
                setFormInitialInput(lastInput);
                setFormResetKey((k) => k + 1);
                setIsInputCollapsed(false);
              }}
              className="btn btn-secondary btn-sm shrink-0"
            >
              Edit input
            </button>
          </div>
        ) : (
          <>
            {examples.length > 0 && (
              <div className="mb-4 flex flex-col gap-2 border-b border-hairline pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-body-sm font-medium text-ink-muted">Try an example:</span>
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
                      className="pill"
                    >
                      {example.label}
                    </button>
                  ))}
                </div>
                {activeExample && (
                  <p className="truncate font-mono text-caption text-ink-subtle" title={JSON.stringify(lastInput)}>
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
        <p className="notice">
          <span aria-hidden="true">✕ </span>
          {error}
        </p>
      )}

      {fullSteps && fullSteps.length > STEP_DISPLAY_CAP && (
        <div className="notice flex flex-wrap items-center gap-3 border-l-4 border-l-accent">
          The run produced a large number of steps ({fullSteps.length}). Showing the first {STEP_DISPLAY_CAP} steps for performance.
          <button
            type="button"
            onClick={() => setSteps(fullSteps)}
            className="btn btn-primary btn-sm"
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
