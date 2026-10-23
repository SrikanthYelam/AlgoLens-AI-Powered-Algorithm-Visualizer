import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_N = 3;
const MAX_N = 5;

export function GenerateParenthesesInputForm({ onSubmit, isLoading, initialInput }: AlgorithmInputFormProps) {
  const [n, setN] = useState((initialInput as { n?: number })?.n ?? DEFAULT_N);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!Number.isInteger(n) || n < 1) {
      setError('n must be a positive integer.');
      return;
    }
    if (n > MAX_N) {
      setError(`Keep n to ${MAX_N} or fewer — the number of combinations grows quickly.`);
      return;
    }

    setError(null);
    onSubmit({ n });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="gp-n" className="text-body-sm font-medium text-ink-muted">
        Number of pairs (n, max {MAX_N})
      </label>
      <div className="flex gap-2">
        <input
          id="gp-n"
          type="number"
          min={1}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
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
