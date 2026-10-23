import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_VALUES = '-10,-3,0,5,9';
const MAX_LENGTH = 8;

function parseIntArray(text: string): number[] {
  return text
    .split(',')
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .map(Number);
}

export function SortedListToBstInputForm({ onSubmit, isLoading, initialInput }: AlgorithmInputFormProps) {
  const [text, setText] = useState(() => (initialInput as { values?: number[] })?.values?.join(',') ?? DEFAULT_VALUES);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const values = parseIntArray(text);

    if (values.length > MAX_LENGTH) {
      setError(`Keep it to ${MAX_LENGTH} values or fewer — the tree grows fast.`);
      return;
    }
    if (values.some(Number.isNaN)) {
      setError('Each value must be an integer.');
      return;
    }
    for (let i = 1; i < values.length; i++) {
      if (values[i] <= values[i - 1]) {
        setError('Values must be sorted in strictly ascending order — this is a sorted list.');
        return;
      }
    }

    setError(null);
    onSubmit({ values });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="sorted-list-values" className="text-body-sm font-medium text-ink-muted">
        Sorted list (comma-separated, ascending, max {MAX_LENGTH})
      </label>
      <div className="flex gap-2">
        <input
          id="sorted-list-values"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 input"
          placeholder={DEFAULT_VALUES}
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
