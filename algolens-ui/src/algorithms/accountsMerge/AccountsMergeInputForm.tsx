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

export function AccountsMergeInputForm({ onSubmit, isLoading, initialInput }: AlgorithmInputFormProps) {
  const [text, setText] = useState(() => {
    const accounts = (initialInput as { accounts?: string[][] })?.accounts;
    return accounts ? accounts.map((account) => account.join(',')).join('\n') : DEFAULT_ACCOUNTS;
  });
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
      <label htmlFor="accounts-list" className="text-body-sm font-medium text-ink-muted">
        Accounts (one per line, "name,email1,email2,...")
      </label>
      <textarea
        id="accounts-list"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        className="input font-mono text-code"
        placeholder={DEFAULT_ACCOUNTS}
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
