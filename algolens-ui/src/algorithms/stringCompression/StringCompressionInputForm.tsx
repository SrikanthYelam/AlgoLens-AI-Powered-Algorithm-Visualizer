import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_CHARS = 'aabbccc';
const MAX_LENGTH = 40;

export function StringCompressionInputForm({ onSubmit, isLoading }: AlgorithmInputFormProps) {
  const [chars, setChars] = useState(DEFAULT_CHARS);
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
      <label htmlFor="compression-chars" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Characters (each character becomes one array cell)
      </label>
      <div className="flex gap-2">
        <input
          id="compression-chars"
          value={chars}
          onChange={(e) => setChars(e.target.value)}
          className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 font-mono text-sm dark:border-gray-600 dark:bg-gray-800"
          placeholder={DEFAULT_CHARS}
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
