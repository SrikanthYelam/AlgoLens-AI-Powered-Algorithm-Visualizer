import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_NUMS = '1,2,3';
const MAX_ELEMENTS = 8;

function parseIntArray(text: string): number[] {
  return text
    .split(',')
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .map(Number);
}

export function SubsetsInputForm({ onSubmit, isLoading }: AlgorithmInputFormProps) {
  const [text, setText] = useState(DEFAULT_NUMS);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nums = parseIntArray(text);

    if (nums.some((n) => Number.isNaN(n))) {
      setError('Each value must be an integer.');
      return;
    }
    if (nums.length > MAX_ELEMENTS) {
      setError(`Keep it to ${MAX_ELEMENTS} elements or fewer — the number of subsets doubles per element.`);
      return;
    }

    setError(null);
    onSubmit({ nums });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="subsets-nums" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Numbers (comma-separated, max {MAX_ELEMENTS})
      </label>
      <div className="flex gap-2">
        <input
          id="subsets-nums"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
          placeholder={DEFAULT_NUMS}
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
