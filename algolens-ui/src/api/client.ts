import type { AlgorithmRunResponse } from '../types/algorithm';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5119';

/**
 * Runs the given algorithm on the backend and returns its captured step sequence.
 * `body` is algorithm-specific (e.g. `{ values: [...] }` for the tree traversal).
 */
export async function runAlgorithm(
  algorithmId: string,
  body: unknown,
): Promise<AlgorithmRunResponse> {
  const response = await fetch(`${API_BASE_URL}/api/algorithms/${algorithmId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Request to ${algorithmId} failed (${response.status}): ${text}`);
  }

  return (await response.json()) as AlgorithmRunResponse;
}
