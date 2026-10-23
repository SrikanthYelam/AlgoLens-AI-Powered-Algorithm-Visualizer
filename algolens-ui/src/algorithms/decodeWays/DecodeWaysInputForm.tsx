import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_S = '226';
const MAX_LENGTH = 15;
const VALID_CHARS = /^[0-9]*$/;

export function DecodeWaysInputForm({ onSubmit, isLoading, initialInput }: AlgorithmInputFormProps) {
  const [s, setS] = useState(() => (initialInput as { s?: string })?.s ?? DEFAULT_S);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (s.length === 0) {
      setError('Enter at least one digit.');
      return;
    }
    if (!VALID_CHARS.test(s)) {
      setError('Only digits 0-9 are allowed.');
      return;
    }
    if (s.length > MAX_LENGTH) {
      setError(`Keep it to ${MAX_LENGTH} digits or fewer — the table grows fast.`);
      return;
    }

    setError(null);
    onSubmit({ s });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="decode-ways-s" className="text-body-sm font-medium text-ink-muted">
        Digit string (max {MAX_LENGTH})
      </label>
      <div className="flex gap-2">
        <input
          id="decode-ways-s"
          value={s}
          onChange={(e) => setS(e.target.value)}
          className="flex-1 input"
          placeholder={DEFAULT_S}
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
