import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const MAX_BARS = 30;

function parseIntArray(text: string): number[] {
  return text
    .split(',')
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .map(Number);
}

/**
 * Container With Most Water and Trapping Rain Water both take a `{ heights }` body — the same
 * shape Largest Rectangle in Histogram uses — and differ only in default example and how few bars
 * make sense, so one form is built twice rather than duplicated.
 */
function createHeightsInputForm(inputId: string, defaultText: string, minBars: number) {
  return function HeightsInputForm({ onSubmit, isLoading, initialInput }: AlgorithmInputFormProps) {
    const [text, setText] = useState(() => (initialInput as { heights?: number[] })?.heights?.join(',') ?? defaultText);
    const [error, setError] = useState<string | null>(null);

    function handleSubmit(e: FormEvent) {
      e.preventDefault();
      const heights = parseIntArray(text);

      if (heights.length < minBars) {
        setError(minBars === 1 ? 'Enter at least one bar height.' : `Enter at least ${minBars} bar heights.`);
        return;
      }
      if (heights.length > MAX_BARS) {
        setError(`Use at most ${MAX_BARS} bars so the chart stays readable.`);
        return;
      }
      if (heights.some((h) => !Number.isInteger(h) || h < 0)) {
        setError('Each height must be a non-negative integer.');
        return;
      }

      setError(null);
      onSubmit({ heights });
    }

    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <label htmlFor={inputId} className="text-body-sm font-medium text-ink-muted">
          Bar heights (comma-separated)
        </label>
        <div className="flex gap-2">
          <input
            id={inputId}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 input"
            placeholder={defaultText}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? 'Running…' : 'Run'}
          </button>
        </div>
        {error && (
        <p className="notice">
          <span aria-hidden="true">✕ </span>
          {error}
        </p>
      )}
      </form>
    );
  };
}

export const ContainerInputForm = createHeightsInputForm('container-heights', '1,8,6,2,5,4,8,3,7', 2);
export const TrappingRainWaterInputForm = createHeightsInputForm('trapping-heights', '0,1,0,2,1,0,1,3,2,1,2,1', 1);
