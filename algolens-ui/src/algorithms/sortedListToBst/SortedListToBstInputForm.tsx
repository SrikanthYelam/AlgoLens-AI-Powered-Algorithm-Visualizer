import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_VALUES = '-10,-3,0,5,9';
const MAX_LENGTH = 8;

function parseIntArray(text: string): number[] {
  return text
    .split(',')
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .map(Number);
}

export function SortedListToBstInputForm({ onSubmit, isLoading }: AlgorithmInputFormProps) {
  const [text, setText] = useState(DEFAULT_VALUES);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const values = parseIntArray(text);

    if (values.length > MAX_LENGTH) {
      setError(`Keep it to ${MAX_LENGTH} values or fewer — the tree grows fast.`);
      return;
    }
    if (values.some(Number.isNaN)) {
      setError('Each value must be an integer.');
      return;
    }
    for (let i = 1; i < values.length; i++) {
      if (values[i] <= values[i - 1]) {
        setError('Values must be sorted in strictly ascending order — this is a sorted list.');
        return;
      }
    }

    setError(null);
    onSubmit({ values });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="sorted-list-values" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Sorted list (comma-separated, ascending, max {MAX_LENGTH})
      </label>
      <div className="flex gap-2">
        <input
          id="sorted-list-values"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
          placeholder={DEFAULT_VALUES}
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
