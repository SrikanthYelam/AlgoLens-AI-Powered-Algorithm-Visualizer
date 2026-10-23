import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_VALUES = '5,3,6,2,4,null,null,1';
const DEFAULT_K = '3';

function parseLevelOrderArray(text: string): (number | null)[] {
  return text
    .split(',')
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .map((token) => (token.toLowerCase() === 'null' ? null : Number(token)));
}

export function KthSmallestInputForm({ onSubmit, isLoading, initialInput }: AlgorithmInputFormProps) {
  const parsed = initialInput as { values?: (number | null)[]; k?: number } | undefined;
  const [text, setText] = useState(() =>
    parsed?.values ? parsed.values.map((v) => (v === null ? 'null' : String(v))).join(',') : DEFAULT_VALUES,
  );
  const [kText, setKText] = useState(() => (parsed?.k !== undefined ? String(parsed.k) : DEFAULT_K));
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const values = parseLevelOrderArray(text);
    const k = Number(kText);

    if (values.length === 0 || values[0] === null) {
      setError('Enter a tree with at least a root value.');
      return;
    }
    if (values.some((v) => v !== null && Number.isNaN(v))) {
      setError('Each tree value must be an integer or "null".');
      return;
    }
    if (!Number.isInteger(k) || k <= 0) {
      setError('k must be a positive integer.');
      return;
    }

    setError(null);
    onSubmit({ values, k });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="kth-smallest-values" className="text-body-sm font-medium text-ink-muted">
        BST level-order array (comma-separated; use "null" for missing nodes)
      </label>
      <input
        id="kth-smallest-values"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="input"
        placeholder={DEFAULT_VALUES}
      />

      <label htmlFor="kth-smallest-k" className="mt-1 text-body-sm font-medium text-ink-muted">
        k
      </label>
      <div className="flex gap-2">
        <input
          id="kth-smallest-k"
          value={kText}
          onChange={(e) => setKText(e.target.value)}
          className="w-24 input"
          placeholder={DEFAULT_K}
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
