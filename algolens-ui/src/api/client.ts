import type { AlgorithmRunResponse, AlgorithmSourceResponse } from '../types/algorithm';

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

/** Fetches the algorithm's own C# source text, for display alongside its step animation. */
export async function getAlgorithmSource(algorithmId: string): Promise<AlgorithmSourceResponse> {
  const response = await fetch(`${API_BASE_URL}/api/algorithms/${algorithmId}/source`);

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Request for ${algorithmId} source failed (${response.status}): ${text}`);
  }

  return (await response.json()) as AlgorithmSourceResponse;
}

/** Regenerates explanations for the provided steps via the API. Returns an array of explanation strings (may contain nulls). */
export async function regenerateExplanations(
  algorithmId: string,
  steps: unknown[],
): Promise<Array<string | null>> {
  const response = await fetch(`${API_BASE_URL}/api/algorithms/${algorithmId}/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ steps }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Explain request for ${algorithmId} failed (${response.status}): ${text}`);
  }

  const payload = (await response.json()) as { explanations: Array<string | null> };
  return payload.explanations ?? [];
}
