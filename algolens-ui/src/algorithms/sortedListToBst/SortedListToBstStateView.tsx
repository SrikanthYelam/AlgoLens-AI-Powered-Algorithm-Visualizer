import type { AlgorithmStateViewProps } from '../../types/algorithm';
import { TreeDiagram } from '../../components/TreeDiagram';

/** Mirrors AlgoLens.Core.Models.SortedListToBstState (camelCase JSON). Note: `root` is a
 * judge-only field carrying the raw constructed tree; it's not rendered here. */
interface SortedListToBstState {
  segment: number[];
  middleIndex: number;
  tree: (number | null)[];
}

function Chip({ value, highlighted }: { value: number; highlighted: boolean }) {
  return (
    <span
      className={`transition-colors duration-200 inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 font-mono text-sm ${
        highlighted
          ? 'border-indigo-500 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200'
          : 'border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
      }`}
    >
      {value}
    </span>
  );
}

export function SortedListToBstStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as SortedListToBstState;
  const middleVal = state.segment[state.middleIndex];
  const treeRoles = middleVal !== undefined ? { [middleVal]: 'current' as const } : {};

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Current list segment{' '}
          <span className="font-normal text-indigo-600 dark:text-indigo-400">
            (slow/fast pointers land here)
          </span>
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {state.segment.length === 0 ? (
            <span className="text-gray-400">none</span>
          ) : (
            state.segment.map((v, i) => <Chip key={i} value={v} highlighted={i === state.middleIndex} />)
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Tree so far</h3>
        <TreeDiagram tree={state.tree} roles={treeRoles} />
      </div>
    </div>
  );
}
