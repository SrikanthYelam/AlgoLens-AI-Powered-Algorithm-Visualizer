import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.AccountsMergeState (camelCase JSON). */
interface AccountsMergeState {
  currentName: string | null;
  currentAccountEmails: string[];
  groups: string[][];
}

export function AccountsMergeStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as AccountsMergeState;

  return (
    <div className="flex flex-col gap-4 text-sm">
      {state.currentName !== null && (
        <p className="font-medium text-gray-700 dark:text-gray-300">
          Processing <span className="font-semibold">{state.currentName}</span>'s account:{' '}
          <span className="font-mono text-xs">{state.currentAccountEmails.join(', ')}</span>
        </p>
      )}

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Merged accounts so far ({state.groups.length})
        </h3>
        <div className="flex flex-col gap-2">
          {state.groups.length === 0 ? (
            <span className="text-gray-400">none yet</span>
          ) : (
            state.groups.map((group, i) => (
              <div key={i} className="rounded-md border border-rose-200 bg-rose-50 p-2 dark:border-rose-800 dark:bg-rose-950/30">
                <span className="font-semibold text-rose-700 dark:text-rose-300">{group[0]}</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {group.slice(1).map((email) => (
                    <span
                      key={email}
                      className="rounded-full bg-rose-100 px-2 py-0.5 font-mono text-[11px] text-rose-800 dark:bg-rose-900/40 dark:text-rose-200"
                    >
                      {email}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
