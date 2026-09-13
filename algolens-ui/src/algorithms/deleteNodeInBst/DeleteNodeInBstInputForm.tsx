import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_VALUES = '5,3,6,2,4,null,7';
const DEFAULT_KEY = '3';

function parseLevelOrderArray(text: string): (number | null)[] {
  return text
    .split(',')
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .map((token) => (token.toLowerCase() === 'null' ? null : Number(token)));
}

export function DeleteNodeInBstInputForm({ onSubmit, isLoading }: AlgorithmInputFormProps) {
  const [text, setText] = useState(DEFAULT_VALUES);
  const [keyText, setKeyText] = useState(DEFAULT_KEY);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const values = parseLevelOrderArray(text);
    const key = Number(keyText);

    if (values.length === 0 || values[0] === null) {
      setError('Enter a tree with at least a root value.');
      return;
    }
    if (values.some((v) => v !== null && Number.isNaN(v))) {
      setError('Each tree value must be an integer or "null".');
      return;
    }
    if (!Number.isInteger(key)) {
      setError('key must be an integer.');
      return;
    }

    setError(null);
    onSubmit({ values, key });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="delete-node-values" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        BST level-order array (comma-separated; use "null" for missing nodes)
      </label>
      <input
        id="delete-node-values"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
        placeholder={DEFAULT_VALUES}
      />

      <label htmlFor="delete-node-key" className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
        Key to delete
      </label>
      <div className="flex gap-2">
        <input
          id="delete-node-key"
          value={keyText}
          onChange={(e) => setKeyText(e.target.value)}
          className="w-24 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
          placeholder={DEFAULT_KEY}
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
