import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_INPUT = '3,9,20,null,null,15,7';

function parseLevelOrderArray(text: string): (number | null)[] {
  return text
    .split(',')
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .map((token) => (token.toLowerCase() === 'null' ? null : Number(token)));
}

export function TreeInputForm({ onSubmit, isLoading }: AlgorithmInputFormProps) {
  const [text, setText] = useState(DEFAULT_INPUT);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const values = parseLevelOrderArray(text);

    if (values.length === 0) {
      setError('Enter at least one value.');
      return;
    }
    if (values.some((v) => v !== null && Number.isNaN(v))) {
      setError('Each value must be an integer or "null".');
      return;
    }

    setError(null);
    onSubmit({ values });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="tree-values" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Level-order array (comma-separated; use "null" for missing nodes)
      </label>
      <div className="flex gap-2">
        <input
          id="tree-values"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
          placeholder={DEFAULT_INPUT}
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
