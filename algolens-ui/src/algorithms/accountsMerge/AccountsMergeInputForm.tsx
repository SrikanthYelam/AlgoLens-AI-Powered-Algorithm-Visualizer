import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_ACCOUNTS =
  'John,johnsmith@mail.com,john_newyork@mail.com\n' +
  'John,johnsmith@mail.com,john00@mail.com\n' +
  'Mary,mary@mail.com\n' +
  'John,johnnybravo@mail.com';

function parseAccounts(text: string): string[][] {
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

export function AccountsMergeInputForm({ onSubmit, isLoading }: AlgorithmInputFormProps) {
  const [text, setText] = useState(DEFAULT_ACCOUNTS);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const accounts = parseAccounts(text);

    if (accounts.length === 0) {
      setError('Enter at least one account.');
      return;
    }
    if (accounts.some((account) => account.length < 2)) {
      setError('Each account needs a name followed by at least one email.');
      return;
    }

    setError(null);
    onSubmit({ accounts });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="accounts-list" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Accounts (one per line, "name,email1,email2,...")
      </label>
      <textarea
        id="accounts-list"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        className="rounded-md border border-gray-300 px-3 py-1.5 font-mono text-sm dark:border-gray-600 dark:bg-gray-800"
        placeholder={DEFAULT_ACCOUNTS}
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
