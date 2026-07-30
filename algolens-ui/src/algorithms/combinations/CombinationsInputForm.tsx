import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_N = 4;
const DEFAULT_K = 2;

export function CombinationsInputForm({ onSubmit, isLoading }: AlgorithmInputFormProps) {
  const [n, setN] = useState(DEFAULT_N);
  const [k, setK] = useState(DEFAULT_K);
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
          <label htmlFor="comb-n" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            n (choose from 1..n)
          </label>
          <input
            id="comb-n"
            type="number"
            min={1}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-24 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="comb-k" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            k (group size)
          </label>
          <input
            id="comb-k"
            type="number"
            min={1}
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            className="w-24 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="self-end rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Running…' : 'Run'}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
