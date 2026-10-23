import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_EDGES = '1,2\n2,3\n3,4\n1,4\n1,5';

function parseEdges(text: string): number[][] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) =>
      line
        .split(',')
        .map((token) => token.trim())
        .filter((token) => token.length > 0)
        .map(Number),
    );
}

export function RedundantConnectionInputForm({ onSubmit, isLoading, initialInput }: AlgorithmInputFormProps) {
  const [text, setText] = useState(() => {
    const edges = (initialInput as { edges?: number[][] })?.edges;
    return edges ? edges.map((edge) => edge.join(',')).join('\n') : DEFAULT_EDGES;
  });
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const edges = parseEdges(text);

    if (edges.length === 0) {
      setError('Enter at least one edge.');
      return;
    }
    for (const edge of edges) {
      if (edge.length !== 2 || edge.some((v) => Number.isNaN(v) || v < 1)) {
        setError('Each line must be two positive integers, e.g. "1,2".');
        return;
      }
    }

    setError(null);
    onSubmit({ edges });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="redundant-edges" className="text-body-sm font-medium text-ink-muted">
        Edges (one per line, "u,v"; nodes numbered from 1)
      </label>
      <textarea
        id="redundant-edges"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        className="input font-mono text-code"
        placeholder={DEFAULT_EDGES}
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
