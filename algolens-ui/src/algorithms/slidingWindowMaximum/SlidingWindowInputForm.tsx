import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_NUMS = '1,3,-1,-3,5,3,6,7';
const DEFAULT_WINDOW_SIZE = 3;

function parseIntArray(text: string): number[] {
  return text
    .split(',')
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .map(Number);
}

export function SlidingWindowInputForm({ onSubmit, isLoading }: AlgorithmInputFormProps) {
  const [numsText, setNumsText] = useState(DEFAULT_NUMS);
  const [windowSize, setWindowSize] = useState(DEFAULT_WINDOW_SIZE);
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
    if (!Number.isInteger(windowSize) || windowSize < 1 || windowSize > nums.length) {
      setError(`Window size must be an integer between 1 and ${nums.length}.`);
      return;
    }

    setError(null);
    onSubmit({ nums, windowSize });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="sw-nums" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Numbers (comma-separated)
      </label>
      <input
        id="sw-nums"
        value={numsText}
        onChange={(e) => setNumsText(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
        placeholder={DEFAULT_NUMS}
      />

      <label htmlFor="sw-window" className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
        Window size
      </label>
      <div className="flex gap-2">
        <input
          id="sw-window"
          type="number"
          min={1}
          value={windowSize}
          onChange={(e) => setWindowSize(Number(e.target.value))}
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
