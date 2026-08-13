import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_S = '()())()';
const MAX_LENGTH = 10;
const VALID_CHARS = /^[a-z()]*$/;

export function RemoveInvalidParenthesesInputForm({ onSubmit, isLoading }: AlgorithmInputFormProps) {
  const [s, setS] = useState(DEFAULT_S);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!VALID_CHARS.test(s)) {
      setError('Only lowercase letters, \'(\' and \')\' are allowed.');
      return;
    }
    if (s.length > MAX_LENGTH) {
      setError(`Keep it to ${MAX_LENGTH} characters or fewer — the search space grows fast.`);
      return;
    }

    setError(null);
    onSubmit({ s });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="rip-s" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        String (lowercase letters and parentheses, max {MAX_LENGTH})
      </label>
      <div className="flex gap-2">
        <input
          id="rip-s"
          value={s}
          onChange={(e) => setS(e.target.value)}
          className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
          placeholder={DEFAULT_S}
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
