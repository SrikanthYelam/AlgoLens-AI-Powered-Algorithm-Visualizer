import { useEffect, useState, type ReactNode } from 'react';
import type { Step } from '../types/algorithm';

const PLAYBACK_INTERVAL_MS = 900;

interface StepPlayerProps {
  steps: Step[];
  /** Renders the algorithm-specific `state` snapshot for the given step. */
  renderState: (step: Step) => ReactNode;
}

export function StepPlayer({ steps, renderState }: StepPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const lastIndex = steps.length - 1;
  const currentStep = steps[currentIndex];

  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    if (currentIndex >= lastIndex) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => setCurrentIndex((i) => i + 1), PLAYBACK_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, lastIndex]);

  if (steps.length === 0 || !currentStep) {
    return <p className="text-gray-500 dark:text-gray-400">No steps to show.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium disabled:opacity-40 dark:border-gray-600"
        >
          ← Prev
        </button>
        <button
          type="button"
          onClick={() => setIsPlaying((p) => !p)}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          type="button"
          onClick={() => setCurrentIndex((i) => Math.min(lastIndex, i + 1))}
          disabled={currentIndex === lastIndex}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium disabled:opacity-40 dark:border-gray-600"
        >
          Next →
        </button>
        <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
          Step {currentIndex + 1} of {steps.length}
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={lastIndex}
        value={currentIndex}
        onChange={(e) => setCurrentIndex(Number(e.target.value))}
        className="w-full"
        aria-label="Step position"
      />

      <div className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
        <p className="font-mono text-sm text-gray-800 dark:text-gray-200">{currentStep.action}</p>
        <p className="mt-2 text-sm italic text-gray-500 dark:text-gray-400">
          {currentStep.explanation ?? 'No AI explanation available for this step.'}
        </p>
      </div>

      <div>{renderState(currentStep)}</div>
    </div>
  );
}
