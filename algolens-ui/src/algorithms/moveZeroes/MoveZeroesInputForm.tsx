import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_NUMS = '0,1,0,3,12';
const MAX_LENGTH = 30;

function parseIntArray(text: string): number[] {
  return text
    .split(',')
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .map(Number);
}

export function MoveZeroesInputForm({ onSubmit, isLoading }: AlgorithmInputFormProps) {
  const [text, setText] = useState(DEFAULT_NUMS);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nums = parseIntArray(text);

    if (nums.length === 0) {
      setError('Enter at least one number.');
      return;
    }
    if (nums.length > MAX_LENGTH) {
      setError(`Use at most ${MAX_LENGTH} numbers so the array stays readable.`);
      return;
    }
    if (nums.some((n) => !Number.isInteger(n))) {
      setError('Each value must be an integer.');
      return;
    }

    setError(null);
    onSubmit({ nums });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="move-zeroes-nums" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Numbers (comma-separated)
      </label>
      <div className="flex gap-2">
        <input
          id="move-zeroes-nums"
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
