import type { AlgorithmStateViewProps } from '../../types/algorithm';
import { TreeDiagram } from '../../components/TreeDiagram';
import { Empty, VizSection, VizStack } from '../../components/viz';

/** Mirrors AlgoLens.Core.Models.FindDuplicateSubtreesState (camelCase JSON). */
interface FindDuplicateSubtreesState {
  tree: (number | null)[];
  currentValue: number | null;
  serialization: string;
  duplicates: (number | null)[][];
}

export function FindDuplicateSubtreesStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as FindDuplicateSubtreesState;

  const roles: Record<number, 'current' | 'path' | 'muted'> = {};
  if (state.currentValue !== null) {
    roles[state.currentValue] = 'current';
  }

  return (
    <VizStack>
      <VizSection title="Tree">
        <TreeDiagram tree={state.tree} roles={roles} />
        {state.currentValue !== null && (
          <p className="mt-1 font-mono text-caption text-ink-subtle">
            serialize({state.currentValue}) = "{state.serialization}"
          </p>
        )}
      </VizSection>

      <VizSection title={`Duplicate subtrees found (${state.duplicates.length})`}>
        {state.duplicates.length === 0 ? (
          <Empty>none yet</Empty>
        ) : (
          <div className="flex flex-wrap gap-4">
            {state.duplicates.map((subtree, i) => (
              <div key={i} className="w-28 rounded-md border border-state-found-border bg-state-found-bg p-2">
                <TreeDiagram tree={subtree} />
              </div>
            ))}
          </div>
        )}
      </VizSection>
    </VizStack>
  );
}
