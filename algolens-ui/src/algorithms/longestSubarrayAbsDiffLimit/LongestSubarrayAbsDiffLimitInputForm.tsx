import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_NUMS = '10,1,2,4,7,2';
const DEFAULT_LIMIT = 5;

function parseIntArray(text: string): number[] {
  return text
    .split(',')
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .map(Number);
}

export function LongestSubarrayAbsDiffLimitInputForm({ onSubmit, isLoading, initialInput }: AlgorithmInputFormProps) {
  const parsed = initialInput as { nums?: number[]; limit?: number } | undefined;
  const [numsText, setNumsText] = useState(() => parsed?.nums?.join(',') ?? DEFAULT_NUMS);
  const [limit, setLimit] = useState(() => parsed?.limit ?? DEFAULT_LIMIT);
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
    if (!Number.isInteger(limit) || limit < 0) {
      setError('Limit must be a non-negative integer.');
      return;
    }

    setError(null);
    onSubmit({ nums, limit });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="lsad-nums" className="text-body-sm font-medium text-ink-muted">
        Numbers (comma-separated)
      </label>
      <input
        id="lsad-nums"
        value={numsText}
        onChange={(e) => setNumsText(e.target.value)}
        className="input"
        placeholder={DEFAULT_NUMS}
      />

      <label htmlFor="lsad-limit" className="mt-1 text-body-sm font-medium text-ink-muted">
        Limit
      </label>
      <div className="flex gap-2">
        <input
          id="lsad-limit"
          type="number"
          min={0}
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="w-24 input"
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
