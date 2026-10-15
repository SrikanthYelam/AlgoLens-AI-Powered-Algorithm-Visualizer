import type { AlgorithmRunResponse, AlgorithmSourceResponse, Step, SubmitSolutionResponse } from '../types/algorithm';

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

/**
 * Asks a free-form question about one step. `step` is the context ("the test case") the LLM
 * answers from; `algorithmName`/`algorithmDescription` are optional framing the registry already
 * has client-side ("the problem"). Returns null if no AI provider is configured or the call failed.
 */
export async function askQuestion(
  algorithmId: string,
  step: Step,
  question: string,
  algorithmName?: string,
  algorithmDescription?: string,
): Promise<string | null> {
  const response = await fetch(`${API_BASE_URL}/api/algorithms/${algorithmId}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, step, algorithmName, algorithmDescription }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Ask request for ${algorithmId} failed (${response.status}): ${text}`);
  }

  const payload = (await response.json()) as { answer: string | null };
  return payload.answer ?? null;
}

/**
 * Runs a user-submitted C# solution against the same input shape the algorithm's own
 * InputForm produces, and returns both the user's answer and the canonical one for comparison.
 */
export async function submitSolution(
  algorithmId: string,
  input: unknown,
  code: string,
): Promise<SubmitSolutionResponse> {
  const response = await fetch(`${API_BASE_URL}/api/algorithms/${algorithmId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input, code }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Submit request for ${algorithmId} failed (${response.status}): ${text}`);
  }

  return (await response.json()) as SubmitSolutionResponse;
}
