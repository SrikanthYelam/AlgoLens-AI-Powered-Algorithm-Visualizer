import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_TEXT1 = 'abcde';
const DEFAULT_TEXT2 = 'ace';
const MAX_LENGTH = 8;
const VALID_CHARS = /^[a-z]*$/;

export function LongestCommonSubsequenceInputForm({ onSubmit, isLoading, initialInput }: AlgorithmInputFormProps) {
  const parsed = initialInput as { text1?: string; text2?: string } | undefined;
  const [text1, setText1] = useState(() => parsed?.text1 ?? DEFAULT_TEXT1);
  const [text2, setText2] = useState(() => parsed?.text2 ?? DEFAULT_TEXT2);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (text1.length === 0 || text2.length === 0) {
      setError('Enter at least one character for each string.');
      return;
    }
    if (!VALID_CHARS.test(text1) || !VALID_CHARS.test(text2)) {
      setError('Only lowercase letters are allowed.');
      return;
    }
    if (text1.length > MAX_LENGTH || text2.length > MAX_LENGTH) {
      setError(`Keep each string to ${MAX_LENGTH} characters or fewer — the table grows fast.`);
      return;
    }

    setError(null);
    onSubmit({ text1, text2 });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="lcs-text1" className="text-body-sm font-medium text-ink-muted">
        Text 1 (lowercase letters, max {MAX_LENGTH})
      </label>
      <input
        id="lcs-text1"
        value={text1}
        onChange={(e) => setText1(e.target.value)}
        className="input"
        placeholder={DEFAULT_TEXT1}
      />

      <label htmlFor="lcs-text2" className="mt-1 text-body-sm font-medium text-ink-muted">
        Text 2 (lowercase letters, max {MAX_LENGTH})
      </label>
      <div className="flex gap-2">
        <input
          id="lcs-text2"
          value={text2}
          onChange={(e) => setText2(e.target.value)}
          className="flex-1 input"
          placeholder={DEFAULT_TEXT2}
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
