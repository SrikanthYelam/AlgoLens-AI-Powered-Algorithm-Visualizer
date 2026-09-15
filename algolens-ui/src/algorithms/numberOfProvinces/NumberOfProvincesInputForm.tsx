import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_MATRIX = '1,1,0\n1,1,0\n0,0,1';

function parseMatrix(text: string): number[][] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) =>
      line
        .split(',')
        .map((token) => token.trim())
        .filter((token) => token.length > 0)
        .map(Number),
    );
}

export function NumberOfProvincesInputForm({ onSubmit, isLoading }: AlgorithmInputFormProps) {
  const [text, setText] = useState(DEFAULT_MATRIX);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const isConnected = parseMatrix(text);

    if (isConnected.length === 0) {
      setError('Enter at least one row.');
      return;
    }
    const n = isConnected.length;
    for (const row of isConnected) {
      if (row.length !== n) {
        setError(`This must be a square matrix (${n}x${n}) — every row needs ${n} values.`);
        return;
      }
      if (row.some((cell) => cell !== 0 && cell !== 1)) {
        setError('Each cell must be 0 or 1.');
        return;
      }
    }

    setError(null);
    onSubmit({ isConnected });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="provinces-matrix" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Adjacency matrix (one row per line, comma-separated 0/1; square, symmetric)
      </label>
      <textarea
        id="provinces-matrix"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        className="rounded-md border border-gray-300 px-3 py-1.5 font-mono text-sm dark:border-gray-600 dark:bg-gray-800"
        placeholder={DEFAULT_MATRIX}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="self-start rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        {isLoading ? 'Running…' : 'Run'}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
