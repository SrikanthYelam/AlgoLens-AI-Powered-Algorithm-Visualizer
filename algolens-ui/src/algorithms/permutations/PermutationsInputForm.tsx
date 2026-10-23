import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_NUMS = '1,2,3';
const MAX_ELEMENTS = 7;

function parseIntArray(text: string): number[] {
  return text
    .split(',')
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .map(Number);
}

export function PermutationsInputForm({ onSubmit, isLoading, initialInput }: AlgorithmInputFormProps) {
  const [text, setText] = useState(() => (initialInput as { nums?: number[] })?.nums?.join(',') ?? DEFAULT_NUMS);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nums = parseIntArray(text);

    if (nums.length === 0) {
      setError('Enter at least one number.');
      return;
    }
    if (nums.some((n) => Number.isNaN(n))) {
      setError('Each value must be an integer.');
      return;
    }
    if (nums.length > MAX_ELEMENTS) {
      setError(`Keep it to ${MAX_ELEMENTS} elements or fewer — permutations grow factorially.`);
      return;
    }
    if (new Set(nums).size !== nums.length) {
      setError('Values should be distinct.');
      return;
    }

    setError(null);
    onSubmit({ nums });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="perm-nums" className="text-body-sm font-medium text-ink-muted">
        Distinct numbers (comma-separated, max {MAX_ELEMENTS})
      </label>
      <div className="flex gap-2">
        <input
          id="perm-nums"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 input"
          placeholder={DEFAULT_NUMS}
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
