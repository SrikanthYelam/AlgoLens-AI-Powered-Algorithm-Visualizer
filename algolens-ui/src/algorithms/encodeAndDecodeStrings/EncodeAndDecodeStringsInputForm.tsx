import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_TEXT = 'lint\ncode\nlove\nyou';
const MAX_STRINGS = 8;
const MAX_STRING_LENGTH = 20;

/** One string per line; an empty line is an empty string, but a final newline is ignored. */
function parseStrings(text: string): string[] {
  const lines = text.replace(/\r/g, '').split('\n');
  if (lines.length > 1 && lines[lines.length - 1] === '') {
    lines.pop();
  }
  return lines;
}

export function EncodeAndDecodeStringsInputForm({ onSubmit, isLoading }: AlgorithmInputFormProps) {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const strs = parseStrings(text);

    if (text.length === 0) {
      setError('Enter at least one string.');
      return;
    }
    if (strs.length > MAX_STRINGS) {
      setError(`Use at most ${MAX_STRINGS} strings.`);
      return;
    }
    if (strs.some((s) => s.length > MAX_STRING_LENGTH)) {
      setError(`Each string can be at most ${MAX_STRING_LENGTH} characters.`);
      return;
    }

    setError(null);
    onSubmit({ strs });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="encode-decode-strs" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Strings (one per line — any characters are fine, including "#" and digits; an empty line is an empty string)
      </label>
      <textarea
        id="encode-decode-strs"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        className="rounded-md border border-gray-300 px-3 py-1.5 font-mono text-sm dark:border-gray-600 dark:bg-gray-800"
        placeholder={DEFAULT_TEXT}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="self-start rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        {isLoading ? 'Running…' : 'Run'}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
