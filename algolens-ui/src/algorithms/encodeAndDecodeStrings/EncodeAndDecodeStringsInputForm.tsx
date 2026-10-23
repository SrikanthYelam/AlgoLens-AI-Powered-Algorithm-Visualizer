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

export function EncodeAndDecodeStringsInputForm({ onSubmit, isLoading, initialInput }: AlgorithmInputFormProps) {
  const [text, setText] = useState(() => (initialInput as { strs?: string[] })?.strs?.join('\n') ?? DEFAULT_TEXT);
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
      <label htmlFor="encode-decode-strs" className="text-body-sm font-medium text-ink-muted">
        Strings (one per line — any characters are fine, including "#" and digits; an empty line is an empty string)
      </label>
      <textarea
        id="encode-decode-strs"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        className="input font-mono text-code"
        placeholder={DEFAULT_TEXT}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="self-start btn btn-primary"
      >
        {isLoading ? 'Running…' : 'Run'}
      </button>
      {error && (
        <p className="notice">
          <span aria-hidden="true">✕ </span>
          {error}
        </p>
      )}
    </form>
  );
}
