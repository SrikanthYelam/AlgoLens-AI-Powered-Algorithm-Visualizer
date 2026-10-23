import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_BOARD_SIZE = 4;
const MAX_BOARD_SIZE = 9;

export function NQueensInputForm({ onSubmit, isLoading, initialInput }: AlgorithmInputFormProps) {
  const [boardSize, setBoardSize] = useState((initialInput as { boardSize?: number })?.boardSize ?? DEFAULT_BOARD_SIZE);
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
      <label htmlFor="nqueens-size" className="text-body-sm font-medium text-ink-muted">
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
          className="w-24 input"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary"
        >
          {isLoading ? 'Running…' : 'Run'}
        </button>
      </div>
      {error && (
        <p className="notice">
          <span aria-hidden="true">✕ </span>
          {error}
        </p>
      )}
    </form>
  );
}
