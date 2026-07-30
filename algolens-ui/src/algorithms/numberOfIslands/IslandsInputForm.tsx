import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_GRID = '1,1,0,0,0\n1,1,0,0,0\n0,0,1,0,0\n0,0,0,1,1';

function parseGrid(text: string): number[][] {
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

export function IslandsInputForm({ onSubmit, isLoading }: AlgorithmInputFormProps) {
  const [text, setText] = useState(DEFAULT_GRID);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const grid = parseGrid(text);

    if (grid.length === 0) {
      setError('Enter at least one row.');
      return;
    }
    const cols = grid[0].length;
    for (const row of grid) {
      if (row.length !== cols) {
        setError('Every row must have the same number of columns.');
        return;
      }
      if (row.some((cell) => cell !== 0 && cell !== 1)) {
        setError('Each cell must be 0 (water) or 1 (land).');
        return;
      }
    }

    setError(null);
    onSubmit({ grid });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="islands-grid" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Grid (one row per line, comma-separated 0/1)
      </label>
      <textarea
        id="islands-grid"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        className="rounded-md border border-gray-300 px-3 py-1.5 font-mono text-sm dark:border-gray-600 dark:bg-gray-800"
        placeholder={DEFAULT_GRID}
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
