import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_DIGITS = '23';
const MAX_DIGITS = 5;
const VALID_DIGITS = /^[2-9]*$/;

export function LetterCombinationsInputForm({ onSubmit, isLoading, initialInput }: AlgorithmInputFormProps) {
  const [digits, setDigits] = useState(() => (initialInput as { digits?: string })?.digits ?? DEFAULT_DIGITS);
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
      <label htmlFor="phone-digits" className="text-body-sm font-medium text-ink-muted">
        Phone digits (2-9 only, max {MAX_DIGITS})
      </label>
      <div className="flex gap-2">
        <input
          id="phone-digits"
          value={digits}
          onChange={(e) => setDigits(e.target.value.trim())}
          className="flex-1 input"
          placeholder={DEFAULT_DIGITS}
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
