import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_ROWS = 3;
const DEFAULT_COLS = 3;
const DEFAULT_POSITIONS = '0,0\n0,1\n1,2\n1,1';
const MAX_DIMENSION = 10;

function parsePositions(text: string): number[][] {
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

export function NumberOfIslandsIIInputForm({ onSubmit, isLoading }: AlgorithmInputFormProps) {
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [text, setText] = useState(DEFAULT_POSITIONS);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!Number.isInteger(rows) || rows < 1 || rows > MAX_DIMENSION) {
      setError(`Rows must be an integer between 1 and ${MAX_DIMENSION}.`);
      return;
    }
    if (!Number.isInteger(cols) || cols < 1 || cols > MAX_DIMENSION) {
      setError(`Columns must be an integer between 1 and ${MAX_DIMENSION}.`);
      return;
    }

    const positions = parsePositions(text);
    if (positions.length === 0) {
      setError('Enter at least one position.');
      return;
    }
    for (const [r, c, ...rest] of positions) {
      if (
        rest.length > 0 ||
        !Number.isInteger(r) ||
        !Number.isInteger(c) ||
        r < 0 ||
        r >= rows ||
        c < 0 ||
        c >= cols
      ) {
        setError(`Each line must be "row,col" inside the grid (rows 0–${rows - 1}, columns 0–${cols - 1}).`);
        return;
      }
    }

    setError(null);
    onSubmit({ rows, cols, positions });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="islands2-rows" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Rows (m)
          </label>
          <input
            id="islands2-rows"
            type="number"
            min={1}
            max={MAX_DIMENSION}
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="w-24 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="islands2-cols" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Columns (n)
          </label>
          <input
            id="islands2-cols"
            type="number"
            min={1}
            max={MAX_DIMENSION}
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
            className="w-24 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
          />
        </div>
      </div>
      <label htmlFor="islands2-positions" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Land positions (one per line, "row,col", in the order they are added)
      </label>
      <textarea
        id="islands2-positions"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        className="rounded-md border border-gray-300 px-3 py-1.5 font-mono text-sm dark:border-gray-600 dark:bg-gray-800"
        placeholder={DEFAULT_POSITIONS}
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
