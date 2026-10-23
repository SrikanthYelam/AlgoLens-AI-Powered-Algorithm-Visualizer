import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_HEIGHTS = '2,1,5,6,2,3';

function parseIntArray(text: string): number[] {
  return text
    .split(',')
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .map(Number);
}

export function HistogramInputForm({ onSubmit, isLoading, initialInput }: AlgorithmInputFormProps) {
  const [text, setText] = useState(() => (initialInput as { heights?: number[] })?.heights?.join(',') ?? DEFAULT_HEIGHTS);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const heights = parseIntArray(text);

    if (heights.length === 0) {
      setError('Enter at least one bar height.');
      return;
    }
    if (heights.some((h) => Number.isNaN(h) || h < 0)) {
      setError('Each height must be a non-negative integer.');
      return;
    }

    setError(null);
    onSubmit({ heights });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="hist-heights" className="text-body-sm font-medium text-ink-muted">
        Bar heights (comma-separated)
      </label>
      <div className="flex gap-2">
        <input
          id="hist-heights"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 input"
          placeholder={DEFAULT_HEIGHTS}
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
}
