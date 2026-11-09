import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_S = 'cbacdcbc';
const MAX_LENGTH = 20;
const VALID_CHARS = /^[a-z]*$/;

export function RemoveDuplicateLettersInputForm({ onSubmit, isLoading, initialInput }: AlgorithmInputFormProps) {
  const [s, setS] = useState(() => (initialInput as { s?: string })?.s ?? DEFAULT_S);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (s.length === 0) {
      setError('Enter at least one character.');
      return;
    }
    if (!VALID_CHARS.test(s)) {
      setError('Only lowercase letters are allowed.');
      return;
    }
    if (s.length > MAX_LENGTH) {
      setError(`Keep it to ${MAX_LENGTH} characters or fewer so the stack stays readable.`);
      return;
    }

    setError(null);
    onSubmit({ s });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="remove-dup-letters-s" className="text-body-sm font-medium text-ink-muted">
        String (lowercase letters, max {MAX_LENGTH})
      </label>
      <div className="flex gap-2">
        <input
          id="remove-dup-letters-s"
          value={s}
          onChange={(e) => setS(e.target.value)}
          className="flex-1 input font-mono text-code"
          placeholder={DEFAULT_S}
        />
        <button type="submit" disabled={isLoading} className="btn btn-primary">
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
