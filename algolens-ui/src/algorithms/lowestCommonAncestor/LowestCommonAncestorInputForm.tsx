import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_VALUES = '3,5,1,6,2,0,8,null,null,7,4';
const DEFAULT_P = '5';
const DEFAULT_Q = '1';

function parseLevelOrderArray(text: string): (number | null)[] {
  return text
    .split(',')
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .map((token) => (token.toLowerCase() === 'null' ? null : Number(token)));
}

export function LowestCommonAncestorInputForm({ onSubmit, isLoading }: AlgorithmInputFormProps) {
  const [text, setText] = useState(DEFAULT_VALUES);
  const [pText, setPText] = useState(DEFAULT_P);
  const [qText, setQText] = useState(DEFAULT_Q);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const values = parseLevelOrderArray(text);
    const p = Number(pText);
    const q = Number(qText);

    if (values.length === 0 || values[0] === null) {
      setError('Enter a tree with at least a root value.');
      return;
    }
    if (values.some((v) => v !== null && Number.isNaN(v))) {
      setError('Each tree value must be an integer or "null".');
      return;
    }
    if (Number.isNaN(p) || Number.isNaN(q)) {
      setError('p and q must be integers.');
      return;
    }
    if (!values.includes(p) || !values.includes(q)) {
      setError('Both p and q must be values that appear in the tree.');
      return;
    }

    setError(null);
    onSubmit({ values, p, q });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="lca-values" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Tree level-order array (comma-separated; use "null" for missing nodes)
      </label>
      <input
        id="lca-values"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
        placeholder={DEFAULT_VALUES}
      />

      <div className="mt-1 flex gap-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="lca-p" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            p
          </label>
          <input
            id="lca-p"
            value={pText}
            onChange={(e) => setPText(e.target.value)}
            className="w-20 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
            placeholder={DEFAULT_P}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="lca-q" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            q
          </label>
          <input
            id="lca-q"
            value={qText}
            onChange={(e) => setQText(e.target.value)}
            className="w-20 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
            placeholder={DEFAULT_Q}
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
