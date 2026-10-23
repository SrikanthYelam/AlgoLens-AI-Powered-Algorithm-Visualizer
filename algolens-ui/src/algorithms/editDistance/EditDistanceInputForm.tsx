import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_WORD1 = 'horse';
const DEFAULT_WORD2 = 'ros';
const MAX_LENGTH = 8;
const VALID_CHARS = /^[a-z]*$/;

export function EditDistanceInputForm({ onSubmit, isLoading, initialInput }: AlgorithmInputFormProps) {
  const parsed = initialInput as { word1?: string; word2?: string } | undefined;
  const [word1, setWord1] = useState(() => parsed?.word1 ?? DEFAULT_WORD1);
  const [word2, setWord2] = useState(() => parsed?.word2 ?? DEFAULT_WORD2);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!VALID_CHARS.test(word1) || !VALID_CHARS.test(word2)) {
      setError('Only lowercase letters are allowed.');
      return;
    }
    if (word1.length > MAX_LENGTH || word2.length > MAX_LENGTH) {
      setError(`Keep each word to ${MAX_LENGTH} characters or fewer — the table grows fast.`);
      return;
    }

    setError(null);
    onSubmit({ word1, word2 });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="edit-distance-word1" className="text-body-sm font-medium text-ink-muted">
        Word 1 (lowercase letters, max {MAX_LENGTH})
      </label>
      <input
        id="edit-distance-word1"
        value={word1}
        onChange={(e) => setWord1(e.target.value)}
        className="input"
        placeholder={DEFAULT_WORD1}
      />

      <label htmlFor="edit-distance-word2" className="mt-1 text-body-sm font-medium text-ink-muted">
        Word 2 (lowercase letters, max {MAX_LENGTH})
      </label>
      <div className="flex gap-2">
        <input
          id="edit-distance-word2"
          value={word2}
          onChange={(e) => setWord2(e.target.value)}
          className="flex-1 input"
          placeholder={DEFAULT_WORD2}
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
