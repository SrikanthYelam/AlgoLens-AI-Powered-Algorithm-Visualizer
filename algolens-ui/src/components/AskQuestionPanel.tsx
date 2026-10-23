import { useRef, useState, type FormEvent } from 'react';
import { askQuestion } from '../api/client';
import type { Step } from '../types/algorithm';

interface AskQuestionPanelProps {
  algorithmId: string;
  algorithmName: string;
  algorithmDescription: string;
  /** The step the next question is anchored to — typically the player's current step. */
  step: Step;
}

interface QaEntry {
  id: number;
  stepNumber: number;
  question: string;
  status: 'pending' | 'answered' | 'error';
  answer: string | null;
  error: string | null;
}

/**
 * Lets the user ask a free-form question about whatever step they're currently looking at. Each
 * entry remembers the step it was asked against, but the panel itself is never remounted on step
 * change (same convention `renderCode`'s wrapper uses) — so earlier Q&A stays visible as the user
 * keeps stepping through the run, rather than being wiped every time the step advances.
 */
export function AskQuestionPanel({ algorithmId, algorithmName, algorithmDescription, step }: AskQuestionPanelProps) {
  const [question, setQuestion] = useState('');
  const [entries, setEntries] = useState<QaEntry[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const nextId = useRef(0);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || isAsking) {
      return;
    }

    const id = nextId.current++;
    setEntries((prev) => [
      { id, stepNumber: step.stepNumber, question: trimmed, status: 'pending', answer: null, error: null },
      ...prev,
    ]);
    setQuestion('');
    setIsAsking(true);
    try {
      const answer = await askQuestion(algorithmId, step, trimmed, algorithmName, algorithmDescription);
      setEntries((prev) => prev.map((entry) => (entry.id === id ? { ...entry, status: 'answered', answer } : entry)));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get an answer.';
      setEntries((prev) => prev.map((entry) => (entry.id === id ? { ...entry, status: 'error', error: message } : entry)));
    } finally {
      setIsAsking(false);
    }
  }

  return (
    <div className="panel p-6">
      <h3 className="eyebrow">Ask a question about this step</h3>
      <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={`e.g. "Why did this happen?" or "What would change if the input were different?"`}
          className="input flex-1"
          aria-label="Your question"
        />
        <button
          type="submit"
          disabled={isAsking || !question.trim()}
          className="btn btn-primary shrink-0"
        >
          {isAsking ? 'Asking…' : 'Ask'}
        </button>
      </form>

      {entries.length > 0 && (
        <div className="mt-3 flex flex-col gap-3">
          {entries.map((entry) => (
            <div key={entry.id} className="border-t border-hairline pt-3 first:border-t-0 first:pt-0">
              <p className="text-body-sm font-medium text-ink">
                {entry.question}
                <span className="ml-2 font-mono text-caption font-normal text-ink-subtle">
                  — step {entry.stepNumber + 1}
                </span>
              </p>
              {entry.status === 'pending' && (
                <p className="mt-1 text-body-sm italic text-ink-subtle">Thinking…</p>
              )}
              {entry.status === 'error' && <p className="notice mt-1">
                  <span aria-hidden="true">✕ </span>
                  {entry.error}
                </p>}
              {entry.status === 'answered' &&
                (entry.answer !== null ? (
                  <p className="mt-1 whitespace-pre-wrap text-body-sm text-ink-muted">{entry.answer}</p>
                ) : (
                  <p className="mt-1 text-body-sm italic text-ink-subtle">
                    No AI answer available for this question.
                  </p>
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
