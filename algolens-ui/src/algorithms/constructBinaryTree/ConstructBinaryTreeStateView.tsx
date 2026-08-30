import type { AlgorithmStateViewProps } from '../../types/algorithm';
import { TreeDiagram } from '../../components/TreeDiagram';

/** Mirrors AlgoLens.Core.Models.ConstructBinaryTreeState (camelCase JSON). Note: `root` is a
 * judge-only field carrying the raw constructed tree; it's not rendered here. */
interface ConstructBinaryTreeState {
  preorder: number[];
  inorder: number[];
  preorderIndex: number;
  inorderStart: number;
  inorderEnd: number;
  tree: (number | null)[];
}

function Chip({ value, highlighted, inRange }: { value: number; highlighted: boolean; inRange: boolean }) {
  return (
    <span
      className={`transition-colors duration-200 inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 font-mono text-sm ${
        highlighted
          ? 'border-indigo-500 bg-indigo-400 text-white'
          : inRange
            ? 'border-amber-400 bg-amber-100 text-amber-800 dark:border-amber-600 dark:bg-amber-900/40 dark:text-amber-200'
            : 'border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500'
      }`}
    >
      {value}
    </span>
  );
}

export function ConstructBinaryTreeStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as ConstructBinaryTreeState;
  const currentRootVal = state.preorder[state.preorderIndex];
  const treeRoles = currentRootVal !== undefined ? { [currentRootVal]: 'current' as const } : {};

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Preorder</h3>
        <div className="flex flex-wrap gap-1.5">
          {state.preorder.map((v, i) => (
            <Chip key={i} value={v} highlighted={i === state.preorderIndex} inRange={false} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Inorder <span className="font-normal text-amber-600 dark:text-amber-400">(current subtree's range)</span>
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {state.inorder.map((v, i) => (
            <Chip key={i} value={v} highlighted={false} inRange={i >= state.inorderStart && i <= state.inorderEnd} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Tree so far</h3>
        <TreeDiagram tree={state.tree} roles={treeRoles} />
      </div>
    </div>
  );
}
