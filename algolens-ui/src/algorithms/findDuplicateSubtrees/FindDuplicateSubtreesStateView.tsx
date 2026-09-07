import type { AlgorithmStateViewProps } from '../../types/algorithm';
import { TreeDiagram } from '../../components/TreeDiagram';

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
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Tree</h3>
        <TreeDiagram tree={state.tree} roles={roles} />
        {state.currentValue !== null && (
          <p className="mt-1 font-mono text-xs text-gray-500 dark:text-gray-400">
            serialize({state.currentValue}) = "{state.serialization}"
          </p>
        )}
      </div>

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Duplicate subtrees found ({state.duplicates.length})
        </h3>
        {state.duplicates.length === 0 ? (
          <span className="text-gray-400">none yet</span>
        ) : (
          <div className="flex flex-wrap gap-4">
            {state.duplicates.map((subtree, i) => (
              <div key={i} className="w-28 rounded-md border border-gray-200 p-2 dark:border-gray-700">
                <TreeDiagram tree={subtree} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
