import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_DIGITS = '23';
const MAX_DIGITS = 5;
const VALID_DIGITS = /^[2-9]*$/;

export function LetterCombinationsInputForm({ onSubmit, isLoading }: AlgorithmInputFormProps) {
  const [digits, setDigits] = useState(DEFAULT_DIGITS);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (digits.length === 0) {
      setError('Enter at least one digit.');
      return;
    }
    if (!VALID_DIGITS.test(digits)) {
      setError('Digits must be between 2 and 9 (no 0 or 1 — they have no letters).');
      return;
    }
    if (digits.length > MAX_DIGITS) {
      setError(`Keep it to ${MAX_DIGITS} digits or fewer — the number of combinations grows fast.`);
      return;
    }

    setError(null);
    onSubmit({ digits });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="phone-digits" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Phone digits (2-9 only, max {MAX_DIGITS})
      </label>
      <div className="flex gap-2">
        <input
          id="phone-digits"
          value={digits}
          onChange={(e) => setDigits(e.target.value.trim())}
          className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
          placeholder={DEFAULT_DIGITS}
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
