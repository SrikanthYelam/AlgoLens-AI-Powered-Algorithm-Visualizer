import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_BOARD_SIZE = 4;
const MAX_BOARD_SIZE = 9;

export function NQueensInputForm({ onSubmit, isLoading }: AlgorithmInputFormProps) {
  const [boardSize, setBoardSize] = useState(DEFAULT_BOARD_SIZE);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!Number.isInteger(boardSize) || boardSize < 1 || boardSize > MAX_BOARD_SIZE) {
      setError(`Board size must be an integer between 1 and ${MAX_BOARD_SIZE}.`);
      return;
    }

    setError(null);
    onSubmit({ boardSize });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="nqueens-size" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Board size (N × N, max {MAX_BOARD_SIZE})
      </label>
      <div className="flex gap-2">
        <input
          id="nqueens-size"
          type="number"
          min={1}
          max={MAX_BOARD_SIZE}
          value={boardSize}
          onChange={(e) => setBoardSize(Number(e.target.value))}
          className="w-24 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
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
