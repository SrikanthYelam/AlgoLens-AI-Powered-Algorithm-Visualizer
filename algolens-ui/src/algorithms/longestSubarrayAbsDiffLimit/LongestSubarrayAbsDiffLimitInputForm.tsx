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

export function LongestSubarrayAbsDiffLimitInputForm({ onSubmit, isLoading }: AlgorithmInputFormProps) {
  const [numsText, setNumsText] = useState(DEFAULT_NUMS);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
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
      <label htmlFor="lsad-nums" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Numbers (comma-separated)
      </label>
      <input
        id="lsad-nums"
        value={numsText}
        onChange={(e) => setNumsText(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
        placeholder={DEFAULT_NUMS}
      />

      <label htmlFor="lsad-limit" className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
        Limit
      </label>
      <div className="flex gap-2">
        <input
          id="lsad-limit"
          type="number"
          min={0}
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="w-24 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Running…' : 'Run'}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
