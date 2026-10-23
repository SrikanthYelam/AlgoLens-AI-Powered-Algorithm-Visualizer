import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_ENCODED = '3[a2[c]]';
const MAX_INPUT_LENGTH = 40;
const MAX_DECODED_LENGTH = 200;
const MAX_REPEAT = 300;

/**
 * Checks the encoded string is well-formed (the real problem guarantees this, and the backend
 * assumes it) and that its decoded form stays small enough to read. Tracks the decoded length of
 * each open nesting level instead of building the string, so a hostile "300[300[300[a]]]" is
 * rejected without ever being expanded.
 */
function validate(s: string): string | null {
  if (s.length === 0) return 'Enter an encoded string.';
  if (s.length > MAX_INPUT_LENGTH) return `Use at most ${MAX_INPUT_LENGTH} characters.`;
  if (!/^[a-zA-Z0-9[\]]+$/.test(s)) return 'Use only letters, digits, and square brackets.';

  const levelLengths = [0];
  const repeats: number[] = [];
  let digits = '';

  for (const c of s) {
    if (/\d/.test(c)) {
      digits += c;
    } else if (c === '[') {
      if (digits === '') return 'Every "[" needs a repeat count right before it, like 3[a].';
      const repeat = Number(digits);
      if (repeat < 1 || repeat > MAX_REPEAT) return `Repeat counts must be between 1 and ${MAX_REPEAT}.`;
      repeats.push(repeat);
      levelLengths.push(0);
      digits = '';
    } else {
      if (digits !== '') return 'A repeat count must be followed by "[".';
      if (c === ']') {
        if (levelLengths.length === 1) return 'Unmatched "]".';
        const inner = levelLengths.pop()!;
        levelLengths[levelLengths.length - 1] += inner * repeats.pop()!;
      } else {
        levelLengths[levelLengths.length - 1] += 1;
      }
    }
  }

  if (digits !== '') return 'A repeat count must be followed by "[".';
  if (levelLengths.length !== 1) return 'Unmatched "[".';
  if (levelLengths[0] > MAX_DECODED_LENGTH) {
    return `That decodes to ${levelLengths[0]} characters — keep it under ${MAX_DECODED_LENGTH} so it stays readable.`;
  }
  return null;
}

export function DecodeStringInputForm({ onSubmit, isLoading, initialInput }: AlgorithmInputFormProps) {
  const [text, setText] = useState(() => (initialInput as { s?: string })?.s ?? DEFAULT_ENCODED);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const problem = validate(text);
    if (problem) {
      setError(problem);
      return;
    }

    setError(null);
    onSubmit({ s: text });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="decode-string-s" className="text-body-sm font-medium text-ink-muted">
        Encoded string (k[text] repeats text k times; brackets can nest)
      </label>
      <div className="flex gap-2">
        <input
          id="decode-string-s"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 input font-mono text-code"
          placeholder={DEFAULT_ENCODED}
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
