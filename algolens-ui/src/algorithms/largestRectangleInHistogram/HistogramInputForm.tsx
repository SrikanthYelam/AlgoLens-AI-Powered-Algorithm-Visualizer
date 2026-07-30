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

export function HistogramInputForm({ onSubmit, isLoading }: AlgorithmInputFormProps) {
  const [text, setText] = useState(DEFAULT_HEIGHTS);
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
      <label htmlFor="hist-heights" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Bar heights (comma-separated)
      </label>
      <div className="flex gap-2">
        <input
          id="hist-heights"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
          placeholder={DEFAULT_HEIGHTS}
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
