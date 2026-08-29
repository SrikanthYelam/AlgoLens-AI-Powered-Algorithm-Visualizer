import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_INTERVALS = '0,30\n5,10\n15,20';
const MAX_INTERVALS = 8;

function parseIntervals(text: string): number[][] {
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

export function MeetingRoomsInputForm({ onSubmit, isLoading }: AlgorithmInputFormProps) {
  const [text, setText] = useState(DEFAULT_INTERVALS);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const intervals = parseIntervals(text);

    if (intervals.length === 0) {
      setError('Enter at least one meeting.');
      return;
    }
    if (intervals.length > MAX_INTERVALS) {
      setError(`Keep it to ${MAX_INTERVALS} meetings or fewer — the timeline grows fast.`);
      return;
    }
    for (const interval of intervals) {
      if (interval.length !== 2 || interval.some(Number.isNaN)) {
        setError('Each line must be "start,end".');
        return;
      }
      if (interval[0] > interval[1]) {
        setError('Each meeting\'s start must be at or before its end.');
        return;
      }
    }

    setError(null);
    onSubmit({ intervals });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="meeting-rooms-intervals" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Meetings (one "start,end" per line, max {MAX_INTERVALS})
      </label>
      <textarea
        id="meeting-rooms-intervals"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        className="rounded-md border border-gray-300 px-3 py-1.5 font-mono text-sm dark:border-gray-600 dark:bg-gray-800"
        placeholder={DEFAULT_INTERVALS}
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
