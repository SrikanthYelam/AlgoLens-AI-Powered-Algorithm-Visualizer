import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_VALUES = '5,3,6,2,4,null,null,1';
const DEFAULT_K = '3';

function parseLevelOrderArray(text: string): (number | null)[] {
  return text
    .split(',')
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .map((token) => (token.toLowerCase() === 'null' ? null : Number(token)));
}

export function KthSmallestInputForm({ onSubmit, isLoading }: AlgorithmInputFormProps) {
  const [text, setText] = useState(DEFAULT_VALUES);
  const [kText, setKText] = useState(DEFAULT_K);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const values = parseLevelOrderArray(text);
    const k = Number(kText);

    if (values.length === 0 || values[0] === null) {
      setError('Enter a tree with at least a root value.');
      return;
    }
    if (values.some((v) => v !== null && Number.isNaN(v))) {
      setError('Each tree value must be an integer or "null".');
      return;
    }
    if (!Number.isInteger(k) || k <= 0) {
      setError('k must be a positive integer.');
      return;
    }

    setError(null);
    onSubmit({ values, k });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="kth-smallest-values" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        BST level-order array (comma-separated; use "null" for missing nodes)
      </label>
      <input
        id="kth-smallest-values"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
        placeholder={DEFAULT_VALUES}
      />

      <label htmlFor="kth-smallest-k" className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
        k
      </label>
      <div className="flex gap-2">
        <input
          id="kth-smallest-k"
          value={kText}
          onChange={(e) => setKText(e.target.value)}
          className="w-24 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
          placeholder={DEFAULT_K}
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
