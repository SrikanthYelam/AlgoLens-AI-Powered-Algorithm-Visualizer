import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_N = 4;
const DEFAULT_K = 2;

export function CombinationsInputForm({ onSubmit, isLoading, initialInput }: AlgorithmInputFormProps) {
  const parsed = initialInput as { n?: number; k?: number } | undefined;
  const [n, setN] = useState(parsed?.n ?? DEFAULT_N);
  const [k, setK] = useState(parsed?.k ?? DEFAULT_K);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!Number.isInteger(n) || n < 1) {
      setError('n must be a positive integer.');
      return;
    }
    if (!Number.isInteger(k) || k < 1 || k > n) {
      setError(`k must be an integer between 1 and ${n}.`);
      return;
    }

    setError(null);
    onSubmit({ n, k });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="comb-n" className="text-body-sm font-medium text-ink-muted">
            n (choose from 1..n)
          </label>
          <input
            id="comb-n"
            type="number"
            min={1}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-24 input"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="comb-k" className="text-body-sm font-medium text-ink-muted">
            k (group size)
          </label>
          <input
            id="comb-k"
            type="number"
            min={1}
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            className="w-24 input"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="self-end btn btn-primary"
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
