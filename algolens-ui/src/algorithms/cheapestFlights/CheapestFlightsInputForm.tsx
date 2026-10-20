import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_N = '4';
const DEFAULT_FLIGHTS = '0,1,100\n1,2,100\n2,0,100\n1,3,600\n2,3,200';
const DEFAULT_SRC = '0';
const DEFAULT_DST = '3';
const DEFAULT_K = '1';

function parseFlights(text: string): number[][] {
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

export function CheapestFlightsInputForm({ onSubmit, isLoading, initialInput }: AlgorithmInputFormProps) {
  const parsed = initialInput as
    | { n?: number; flights?: number[][]; src?: number; dst?: number; k?: number }
    | undefined;
  const [nText, setNText] = useState(() => (parsed?.n !== undefined ? String(parsed.n) : DEFAULT_N));
  const [flightsText, setFlightsText] = useState(() =>
    parsed?.flights ? parsed.flights.map((f) => f.join(',')).join('\n') : DEFAULT_FLIGHTS,
  );
  const [srcText, setSrcText] = useState(() => (parsed?.src !== undefined ? String(parsed.src) : DEFAULT_SRC));
  const [dstText, setDstText] = useState(() => (parsed?.dst !== undefined ? String(parsed.dst) : DEFAULT_DST));
  const [kText, setKText] = useState(() => (parsed?.k !== undefined ? String(parsed.k) : DEFAULT_K));
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const n = Number(nText);
    const src = Number(srcText);
    const dst = Number(dstText);
    const k = Number(kText);
    const flights = parseFlights(flightsText);

    if (!Number.isInteger(n) || n < 1) {
      setError('Number of cities must be a positive integer.');
      return;
    }
    if (flights.some((f) => f.length !== 3 || f.some((v) => Number.isNaN(v)))) {
      setError('Each flight line must be exactly three comma-separated numbers: from,to,price.');
      return;
    }
    if (flights.some((f) => f[0] < 0 || f[0] >= n || f[1] < 0 || f[1] >= n)) {
      setError(`City numbers in flights must be between 0 and ${n - 1}.`);
      return;
    }
    if (!Number.isInteger(src) || !Number.isInteger(dst) || src < 0 || src >= n || dst < 0 || dst >= n) {
      setError(`src and dst must be integers between 0 and ${n - 1}.`);
      return;
    }
    if (src === dst) {
      setError('src and dst must be different cities.');
      return;
    }
    if (!Number.isInteger(k) || k < 0 || k >= n) {
      setError(`k must be an integer between 0 and ${n - 1}.`);
      return;
    }

    setError(null);
    onSubmit({ n, flights, src, dst, k });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="flights-n" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Number of cities (n)
      </label>
      <input
        id="flights-n"
        value={nText}
        onChange={(e) => setNText(e.target.value)}
        className="w-32 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
        placeholder={DEFAULT_N}
      />

      <label htmlFor="flights-list" className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        Flights (one per line: from,to,price)
      </label>
      <textarea
        id="flights-list"
        value={flightsText}
        onChange={(e) => setFlightsText(e.target.value)}
        rows={4}
        className="rounded-md border border-gray-300 px-3 py-1.5 font-mono text-sm dark:border-gray-600 dark:bg-gray-800"
        placeholder={DEFAULT_FLIGHTS}
      />

      <div className="mt-2 flex gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="flights-src" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            src
          </label>
          <input
            id="flights-src"
            value={srcText}
            onChange={(e) => setSrcText(e.target.value)}
            className="w-20 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
            placeholder={DEFAULT_SRC}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="flights-dst" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            dst
          </label>
          <input
            id="flights-dst"
            value={dstText}
            onChange={(e) => setDstText(e.target.value)}
            className="w-20 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
            placeholder={DEFAULT_DST}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="flights-k" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            k (max stops)
          </label>
          <input
            id="flights-k"
            value={kText}
            onChange={(e) => setKText(e.target.value)}
            className="w-20 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
            placeholder={DEFAULT_K}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="self-end rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Running…' : 'Run'}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
