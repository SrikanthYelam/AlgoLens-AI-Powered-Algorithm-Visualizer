import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_N = 3;
const MAX_N = 5;

export function GenerateParenthesesInputForm({ onSubmit, isLoading }: AlgorithmInputFormProps) {
  const [n, setN] = useState(DEFAULT_N);
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
      <label htmlFor="gp-n" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Number of pairs (n, max {MAX_N})
      </label>
      <div className="flex gap-2">
        <input
          id="gp-n"
          type="number"
          min={1}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
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
