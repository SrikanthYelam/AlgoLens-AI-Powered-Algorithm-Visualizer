import { useState, type FormEvent } from 'react';
import type { AlgorithmInputFormProps } from '../../types/algorithm';

const DEFAULT_TASKS = 'AAABBB';
const DEFAULT_COOLDOWN = 2;

export function TaskSchedulerInputForm({ onSubmit, isLoading, initialInput }: AlgorithmInputFormProps) {
  const parsed = initialInput as { tasks?: string; n?: number } | undefined;
  const [tasksText, setTasksText] = useState(() => parsed?.tasks ?? DEFAULT_TASKS);
  const [cooldown, setCooldown] = useState(() => parsed?.n ?? DEFAULT_COOLDOWN);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const tasks = tasksText.trim().toUpperCase();

    if (tasks.length === 0) {
      setError('Enter at least one task letter.');
      return;
    }
    if (!/^[A-Z]+$/.test(tasks)) {
      setError('Tasks must be letters only, e.g. AAABBB.');
      return;
    }
    if (!Number.isInteger(cooldown) || cooldown < 0) {
      setError('Cooldown must be a non-negative integer.');
      return;
    }

    setError(null);
    onSubmit({ tasks, n: cooldown });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="ts-tasks" className="text-body-sm font-medium text-ink-muted">
        Tasks (letters, one per unit of work)
      </label>
      <input
        id="ts-tasks"
        value={tasksText}
        onChange={(e) => setTasksText(e.target.value)}
        className="input"
        placeholder={DEFAULT_TASKS}
      />

      <label htmlFor="ts-cooldown" className="mt-1 text-body-sm font-medium text-ink-muted">
        Cooldown (n)
      </label>
      <div className="flex gap-2">
        <input
          id="ts-cooldown"
          type="number"
          min={0}
          value={cooldown}
          onChange={(e) => setCooldown(Number(e.target.value))}
          className="w-24 input"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary"
        >
          {isLoading ? 'Running…' : 'Run'}
        </button>
      </div>
      {error && (
        <p className="notice">
          <span aria-hidden="true">✕ </span>
          {error}
        </p>
      )}
    </form>
  );
}
