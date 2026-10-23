import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_NUMS = '10,9,2,5,3,7,101,18';
const MAX_ELEMENTS = 10;

function parseIntArray(text: string): number[] {
  return text
    .split(',')
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .map(Number);
}

export function LongestIncreasingSubsequenceInputForm({ onSubmit, isLoading, initialInput }: AlgorithmInputFormProps) {
  const [numsText, setNumsText] = useState(() => (initialInput as { nums?: number[] })?.nums?.join(',') ?? DEFAULT_NUMS);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nums = parseIntArray(numsText);

    if (nums.length === 0) {
      setError('Enter at least one number.');
      return;
    }
    if (nums.some((n) => Number.isNaN(n))) {
      setError('Each value must be an integer.');
      return;
    }
    if (nums.length > MAX_ELEMENTS) {
      setError(`Keep it to ${MAX_ELEMENTS} elements or fewer — the comparison count grows fast.`);
      return;
    }

    setError(null);
    onSubmit({ nums });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="lis-nums" className="text-body-sm font-medium text-ink-muted">
        Numbers (comma-separated, max {MAX_ELEMENTS})
      </label>
      <div className="flex gap-2">
        <input
          id="lis-nums"
          value={numsText}
          onChange={(e) => setNumsText(e.target.value)}
          className="flex-1 input"
          placeholder={DEFAULT_NUMS}
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
