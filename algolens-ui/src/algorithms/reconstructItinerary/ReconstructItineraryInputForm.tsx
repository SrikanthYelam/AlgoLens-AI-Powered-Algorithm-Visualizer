import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_TICKETS = 'MUC,LHR\nJFK,MUC\nSFO,SJC\nLHR,SFO';
const MAX_TICKETS = 20;

function parseTickets(text: string): string[][] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) =>
      line
        .split(',')
        .map((token) => token.trim())
        .filter((token) => token.length > 0),
    );
}

export function ReconstructItineraryInputForm({ onSubmit, isLoading, initialInput }: AlgorithmInputFormProps) {
  const [text, setText] = useState(() => {
    const tickets = (initialInput as { tickets?: string[][] })?.tickets;
    return tickets ? tickets.map((t) => t.join(',')).join('\n') : DEFAULT_TICKETS;
  });
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const tickets = parseTickets(text);

    if (tickets.length === 0) {
      setError('Enter at least one ticket.');
      return;
    }
    if (tickets.length > MAX_TICKETS) {
      setError(`Keep it to ${MAX_TICKETS} tickets or fewer so the itinerary stays readable.`);
      return;
    }
    if (tickets.some((t) => t.length !== 2)) {
      setError('Each line must be exactly two airport codes: "from,to".');
      return;
    }
    if (!tickets.some((t) => t[0] === 'JFK')) {
      setError('At least one ticket must depart from "JFK" — that\'s always the starting airport.');
      return;
    }

    setError(null);
    onSubmit({ tickets });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="itinerary-tickets" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Tickets (one per line, "from,to"; the itinerary always starts at JFK)
      </label>
      <textarea
        id="itinerary-tickets"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        className="rounded-md border border-gray-300 px-3 py-1.5 font-mono text-sm dark:border-gray-600 dark:bg-gray-800"
        placeholder={DEFAULT_TICKETS}
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
