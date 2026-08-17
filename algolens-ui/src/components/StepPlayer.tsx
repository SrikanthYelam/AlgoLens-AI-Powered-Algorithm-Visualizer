import { useEffect, useState, type ReactNode } from 'react';
import type { Step } from '../types/algorithm';

const PLAYBACK_INTERVAL_MS = 900; // base interval at 1x speed

interface StepPlayerProps {
  steps: Step[];
  /** Renders the algorithm-specific `state` snapshot for the given step. */
  renderState: (step: Step) => ReactNode;
  /** Renders the algorithm's source code, highlighted for the given step. Optional. */
  renderCode?: (step: Step) => ReactNode;
  /** Optional callback to regenerate an explanation for a single step. Should return the new explanation or null. */
  regenerateExplanation?: (index: number) => Promise<string | null>;
  /** Optional callback invoked when an explanation is regenerated to update parent state. */
  onUpdateExplanation?: (index: number, explanation: string | null) => void;
}

export function StepPlayer({ steps, renderState, renderCode, regenerateExplanation, onUpdateExplanation }: StepPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(() => {
    try {
      const s = localStorage.getItem('stepPlayerSpeed');
      return s ? Number(s) : 1;
    } catch {
      return 1;
    }
  });
  const [loop, setLoop] = useState<boolean>(false);
  const [isRegenerating, setIsRegenerating] = useState<Record<number, boolean>>({});

  const lastIndex = steps.length - 1;
  const currentStep = steps[currentIndex];

  useEffect(() => {
    try {
      localStorage.setItem('stepPlayerSpeed', String(speed));
    } catch {}
  }, [speed]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const effectiveInterval = Math.max(50, Math.round(PLAYBACK_INTERVAL_MS / speed));

    const timer = setTimeout(() => {
      setCurrentIndex((i) => {
        if (i < lastIndex) return i + 1;
        if (loop) return 0;
        setIsPlaying(false);
        return i;
      });
    }, effectiveInterval);

    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, lastIndex, speed, loop]);

  // Keyboard shortcuts: Space = play/pause, ArrowLeft/Right = prev/next, Home/End = first/last
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      // don't intercept typing in inputs
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.code === 'ArrowLeft') {
        setCurrentIndex((i) => Math.max(0, i - 1));
      } else if (e.code === 'ArrowRight') {
        setCurrentIndex((i) => Math.min(lastIndex, i + 1));
      } else if (e.code === 'Home') {
        setCurrentIndex(0);
      } else if (e.code === 'End') {
        setCurrentIndex(lastIndex);
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lastIndex]);

  if (steps.length === 0 || !currentStep) {
    return <p className="text-gray-500 dark:text-gray-400">No steps to show.</p>;
  }

  return (
    <div className={renderCode ? 'grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start' : undefined}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentIndex(0)}
            disabled={currentIndex === 0}
            className="rounded-md border border-gray-300 px-2 py-1 text-sm font-medium disabled:opacity-40 dark:border-gray-600"
            aria-label="First step"
          >
            ⏮ First
          </button>

          <button
            type="button"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium transition-colors duration-150 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent dark:border-gray-600 dark:hover:bg-gray-800"
            aria-label={"← Prev"}
          >
            ← Prev
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-indigo-500"
            aria-pressed={isPlaying}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>

          <button
            type="button"
            onClick={() => setCurrentIndex((i) => Math.min(lastIndex, i + 1))}
            disabled={currentIndex === lastIndex}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium transition-colors duration-150 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent dark:border-gray-600 dark:hover:bg-gray-800"
            aria-label={"Next →"}
          >
            Next →
          </button>

          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            Step {currentIndex + 1} of {steps.length}
          </span>

          <button
            type="button"
            onClick={() => setCurrentIndex(lastIndex)}
            disabled={currentIndex === lastIndex}
            className="rounded-md border border-gray-300 px-2 py-1 text-sm font-medium disabled:opacity-40 dark:border-gray-600"
            aria-label={"Last ⏭"}
          >
            Last ⏭
          </button>

          <div className="ml-auto flex items-center gap-3">
            <label className="text-sm text-gray-600 dark:text-gray-300">Speed</label>
            <select
              value={String(speed)}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="rounded-md border border-gray-300 px-2 py-1 text-sm bg-white dark:bg-gray-800 dark:border-gray-600"
              aria-label="Playback speed"
            >
              <option value={0.25}>0.25x</option>
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={4}>4x</option>
            </select>

            <button
              type="button"
              onClick={() => setLoop((l) => !l)}
              className={`rounded-md px-2 py-1 text-sm font-medium ${loop ? 'bg-green-600 text-white' : 'border border-gray-300 dark:border-gray-600'}`}
              aria-pressed={loop}
              aria-label="Toggle loop"
            >
              {loop ? 'Looping' : 'Loop Off'}
            </button>

            <span className="text-sm text-gray-500 dark:text-gray-400">Step {currentIndex + 1} / {steps.length}</span>
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={lastIndex}
          value={currentIndex}
          onChange={(e) => setCurrentIndex(Number(e.target.value))}
          className="w-full accent-indigo-600"
          aria-label="Step position"
        />

        <div
          key={currentStep.stepNumber}
          className="step-fade rounded-lg border border-gray-200 p-4 dark:border-gray-700"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="font-mono text-sm text-gray-800 dark:text-gray-200">{currentStep.action}</p>

            <div className="flex flex-col items-end gap-2">
              <button
                type="button"
                onClick={async () => {
                  if (!regenerateExplanation || !onUpdateExplanation) return;
                  setIsRegenerating((s) => ({ ...s, [currentIndex]: true }));
                  try {
                    const text = await regenerateExplanation(currentIndex);
                    onUpdateExplanation(currentIndex, text ?? null);
                  } catch (e) {
                    // ignore — parent will surface errors if needed
                    onUpdateExplanation(currentIndex, null);
                  } finally {
                    setIsRegenerating((s) => ({ ...s, [currentIndex]: false }));
                  }
                }}
                disabled={!regenerateExplanation}
                className="rounded-md border border-gray-300 px-2 py-1 text-xs font-medium disabled:opacity-40"
                aria-label="Regenerate explanation"
              >
                {isRegenerating[currentIndex] ? 'Regenerating…' : 'Regenerate explanation'}
              </button>
              <span className="text-xs text-gray-500 dark:text-gray-400">Step {currentIndex + 1}</span>
            </div>
          </div>

          <p className="mt-2 text-sm italic text-gray-500 dark:text-gray-400">
            {currentStep.explanation ?? 'No AI explanation available for this step.'}
          </p>
        </div>

        <div key={`state-${currentStep.stepNumber}`} className="step-fade">
          {renderState(currentStep)}
        </div>
      </div>

      {renderCode && <div>{renderCode(currentStep)}</div>}
    </div>
  );
}
