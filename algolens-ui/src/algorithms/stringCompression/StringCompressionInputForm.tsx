import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_CHARS = 'aabbccc';
const MAX_LENGTH = 40;

export function StringCompressionInputForm({ onSubmit, isLoading, initialInput }: AlgorithmInputFormProps) {
  const [chars, setChars] = useState(() => (initialInput as { chars?: string })?.chars ?? DEFAULT_CHARS);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (chars.length === 0) {
      setError('Enter at least one character.');
      return;
    }
    if (chars.length > MAX_LENGTH) {
      setError(`Use at most ${MAX_LENGTH} characters so the array stays readable.`);
      return;
    }
    if (/\s/.test(chars)) {
      setError('Characters cannot include spaces.');
      return;
    }

    setError(null);
    onSubmit({ chars });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="compression-chars" className="text-body-sm font-medium text-ink-muted">
        Characters (each character becomes one array cell)
      </label>
      <div className="flex gap-2">
        <input
          id="compression-chars"
          value={chars}
          onChange={(e) => setChars(e.target.value)}
          className="flex-1 input font-mono text-code"
          placeholder={DEFAULT_CHARS}
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
