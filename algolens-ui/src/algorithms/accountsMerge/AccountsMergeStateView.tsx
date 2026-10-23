import { Empty, VizSection, VizStack } from '../../components/viz';
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
    <VizStack>
      {state.currentName !== null && (
        <p className="font-medium text-ink">
          Processing <span className="font-semibold">{state.currentName}</span>'s account:{' '}
          <span className="font-mono text-caption text-ink-muted">{state.currentAccountEmails.join(', ')}</span>
        </p>
      )}

      <VizSection title={`Merged accounts so far (${state.groups.length})`}>
        <div className="flex flex-col gap-2">
          {state.groups.length === 0 ? (
            <Empty>none yet</Empty>
          ) : (
            state.groups.map((group, i) => (
              <div key={i} className="rounded-md border border-hairline-strong bg-surface-2 p-2">
                <span className="font-semibold text-ink">{group[0]}</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {group.slice(1).map((email) => (
                    <span key={email} className="badge font-mono">
                      {email}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </VizSection>
    </VizStack>
  );
}
