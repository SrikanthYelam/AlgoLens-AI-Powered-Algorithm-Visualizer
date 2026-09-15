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

export function RedundantConnectionInputForm({ onSubmit, isLoading }: AlgorithmInputFormProps) {
  const [text, setText] = useState(DEFAULT_EDGES);
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
      <label htmlFor="redundant-edges" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Edges (one per line, "u,v"; nodes numbered from 1)
      </label>
      <textarea
        id="redundant-edges"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        className="rounded-md border border-gray-300 px-3 py-1.5 font-mono text-sm dark:border-gray-600 dark:bg-gray-800"
        placeholder={DEFAULT_EDGES}
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
