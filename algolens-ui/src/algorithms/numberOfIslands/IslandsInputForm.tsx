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

export function IslandsInputForm({ onSubmit, isLoading, initialInput }: AlgorithmInputFormProps) {
  const [text, setText] = useState(() => {
    const grid = (initialInput as { grid?: number[][] })?.grid;
    return grid ? grid.map((row) => row.join(',')).join('\n') : DEFAULT_GRID;
  });
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
      <label htmlFor="islands-grid" className="text-body-sm font-medium text-ink-muted">
        Grid (one row per line, comma-separated 0/1)
      </label>
      <textarea
        id="islands-grid"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        className="input font-mono text-code"
        placeholder={DEFAULT_GRID}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="self-start btn btn-primary"
      >
        {isLoading ? 'Running…' : 'Run'}
      </button>
      {error && (
        <p className="notice">
          <span aria-hidden="true">✕ </span>
          {error}
        </p>
      )}
    </form>
  );
}
