import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_PREORDER = '3,9,20,15,7';
const DEFAULT_INORDER = '9,3,15,20,7';
const MAX_LENGTH = 8;

function parseIntArray(text: string): number[] {
  return text
    .split(',')
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .map(Number);
}

export function ConstructBinaryTreeInputForm({ onSubmit, isLoading }: AlgorithmInputFormProps) {
  const [preorderText, setPreorderText] = useState(DEFAULT_PREORDER);
  const [inorderText, setInorderText] = useState(DEFAULT_INORDER);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const preorder = parseIntArray(preorderText);
    const inorder = parseIntArray(inorderText);

    if (preorder.length === 0 || inorder.length === 0) {
      setError('Enter at least one value in each array.');
      return;
    }
    if (preorder.some(Number.isNaN) || inorder.some(Number.isNaN)) {
      setError('Each value must be an integer.');
      return;
    }
    if (preorder.length !== inorder.length) {
      setError('preorder and inorder must be the same length.');
      return;
    }
    if (preorder.length > MAX_LENGTH) {
      setError(`Keep it to ${MAX_LENGTH} nodes or fewer — the tree grows fast.`);
      return;
    }
    const sortedPreorder = [...preorder].sort((a, b) => a - b);
    const sortedInorder = [...inorder].sort((a, b) => a - b);
    if (!sortedPreorder.every((v, i) => v === sortedInorder[i])) {
      setError('preorder and inorder must contain exactly the same values (each unique).');
      return;
    }

    setError(null);
    onSubmit({ preorder, inorder });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="cbt-preorder" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Preorder (comma-separated, max {MAX_LENGTH})
      </label>
      <input
        id="cbt-preorder"
        value={preorderText}
        onChange={(e) => setPreorderText(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
        placeholder={DEFAULT_PREORDER}
      />

      <label htmlFor="cbt-inorder" className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
        Inorder (comma-separated, max {MAX_LENGTH})
      </label>
      <div className="flex gap-2">
        <input
          id="cbt-inorder"
          value={inorderText}
          onChange={(e) => setInorderText(e.target.value)}
          className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
          placeholder={DEFAULT_INORDER}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Running…' : 'Run'}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
