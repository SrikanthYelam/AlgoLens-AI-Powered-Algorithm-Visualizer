import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_CAPACITY = 2;
const DEFAULT_OPERATIONS = 'put 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nput 4 4\nget 1\nget 3\nget 4';
const MAX_CAPACITY = 10;
const MAX_OPERATIONS = 20;

interface ParsedOperation {
  op: string;
  key: number;
  value?: number;
}

function parseOperations(text: string): { operations: ParsedOperation[] } | { error: string } {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return { error: 'Enter at least one operation.' };
  }
  if (lines.length > MAX_OPERATIONS) {
    return { error: `Keep it to ${MAX_OPERATIONS} operations or fewer.` };
  }

  const operations: ParsedOperation[] = [];
  for (const line of lines) {
    const tokens = line.split(/\s+/);
    const op = tokens[0]?.toLowerCase();

    if (op === 'get' && tokens.length === 2 && Number.isInteger(Number(tokens[1]))) {
      operations.push({ op: 'get', key: Number(tokens[1]) });
      continue;
    }
    if (op === 'put' && tokens.length === 3 && Number.isInteger(Number(tokens[1])) && Number.isInteger(Number(tokens[2]))) {
      operations.push({ op: 'put', key: Number(tokens[1]), value: Number(tokens[2]) });
      continue;
    }
    return { error: `Invalid line "${line}" — use "get key" or "put key value".` };
  }

  return { operations };
}

export function LruCacheInputForm({ onSubmit, isLoading, initialInput }: AlgorithmInputFormProps) {
  const parsed = initialInput as { capacity?: number; operations?: ParsedOperation[] } | undefined;
  const [capacity, setCapacity] = useState(() => parsed?.capacity ?? DEFAULT_CAPACITY);
  const [text, setText] = useState(() =>
    parsed?.operations
      ? parsed.operations.map((o) => (o.op === 'get' ? `get ${o.key}` : `put ${o.key} ${o.value}`)).join('\n')
      : DEFAULT_OPERATIONS,
  );
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!Number.isInteger(capacity) || capacity < 1 || capacity > MAX_CAPACITY) {
      setError(`Capacity must be an integer between 1 and ${MAX_CAPACITY}.`);
      return;
    }

    const parsed = parseOperations(text);
    if ('error' in parsed) {
      setError(parsed.error);
      return;
    }

    setError(null);
    onSubmit({ capacity, operations: parsed.operations });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="lru-capacity" className="text-body-sm font-medium text-ink-muted">
        Capacity (max {MAX_CAPACITY})
      </label>
      <input
        id="lru-capacity"
        type="number"
        min={1}
        max={MAX_CAPACITY}
        value={capacity}
        onChange={(e) => setCapacity(Number(e.target.value))}
        className="w-24 input"
      />
      <label htmlFor="lru-operations" className="text-body-sm font-medium text-ink-muted">
        Operations (one per line, "get key" or "put key value", max {MAX_OPERATIONS})
      </label>
      <textarea
        id="lru-operations"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={9}
        className="input font-mono text-code"
        placeholder={DEFAULT_OPERATIONS}
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
