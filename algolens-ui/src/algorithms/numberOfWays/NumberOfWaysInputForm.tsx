import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_N = '7';
const DEFAULT_ROADS = '0,6,7\n0,1,2\n1,2,3\n1,3,3\n6,3,3\n3,5,1\n6,5,1\n2,5,1\n0,4,5\n4,6,2';
const MAX_ROADS = 30;

function parseRoads(text: string): number[][] {
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

export function NumberOfWaysInputForm({ onSubmit, isLoading, initialInput }: AlgorithmInputFormProps) {
  const parsed = initialInput as { n?: number; roads?: number[][] } | undefined;
  const [nText, setNText] = useState(() => (parsed?.n !== undefined ? String(parsed.n) : DEFAULT_N));
  const [roadsText, setRoadsText] = useState(() =>
    parsed?.roads ? parsed.roads.map((r) => r.join(',')).join('\n') : DEFAULT_ROADS,
  );
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const n = Number(nText);
    const roads = parseRoads(roadsText);

    if (!Number.isInteger(n) || n < 1) {
      setError('Number of intersections must be a positive integer.');
      return;
    }
    if (roads.length > MAX_ROADS) {
      setError(`Keep it to ${MAX_ROADS} roads or fewer so the graph stays readable.`);
      return;
    }
    if (roads.some((r) => r.length !== 3 || r.some((v) => Number.isNaN(v)))) {
      setError('Each road line must be exactly three comma-separated numbers: u,v,time.');
      return;
    }
    if (roads.some((r) => r[0] < 0 || r[0] >= n || r[1] < 0 || r[1] >= n)) {
      setError(`Intersection numbers in roads must be between 0 and ${n - 1}.`);
      return;
    }
    if (roads.some((r) => r[2] < 1)) {
      setError('Each road\'s travel time must be a positive integer.');
      return;
    }
    if (n > 1 && roads.length === 0) {
      setError('Enter at least one road connecting the intersections.');
      return;
    }

    setError(null);
    onSubmit({ n, roads });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="ways-n" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Number of intersections (n) — travel is always from 0 to n − 1
      </label>
      <input
        id="ways-n"
        value={nText}
        onChange={(e) => setNText(e.target.value)}
        className="w-32 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
        placeholder={DEFAULT_N}
      />

      <label htmlFor="ways-roads" className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        Roads (one per line, bidirectional: u,v,time)
      </label>
      <textarea
        id="ways-roads"
        value={roadsText}
        onChange={(e) => setRoadsText(e.target.value)}
        rows={6}
        className="rounded-md border border-gray-300 px-3 py-1.5 font-mono text-sm dark:border-gray-600 dark:bg-gray-800"
        placeholder={DEFAULT_ROADS}
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
