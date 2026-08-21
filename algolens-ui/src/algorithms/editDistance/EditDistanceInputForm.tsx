import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_WORD1 = 'horse';
const DEFAULT_WORD2 = 'ros';
const MAX_LENGTH = 8;
const VALID_CHARS = /^[a-z]*$/;

export function EditDistanceInputForm({ onSubmit, isLoading }: AlgorithmInputFormProps) {
  const [word1, setWord1] = useState(DEFAULT_WORD1);
  const [word2, setWord2] = useState(DEFAULT_WORD2);
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
      <label htmlFor="edit-distance-word1" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Word 1 (lowercase letters, max {MAX_LENGTH})
      </label>
      <input
        id="edit-distance-word1"
        value={word1}
        onChange={(e) => setWord1(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
        placeholder={DEFAULT_WORD1}
      />

      <label htmlFor="edit-distance-word2" className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
        Word 2 (lowercase letters, max {MAX_LENGTH})
      </label>
      <div className="flex gap-2">
        <input
          id="edit-distance-word2"
          value={word2}
          onChange={(e) => setWord2(e.target.value)}
          className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
          placeholder={DEFAULT_WORD2}
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
