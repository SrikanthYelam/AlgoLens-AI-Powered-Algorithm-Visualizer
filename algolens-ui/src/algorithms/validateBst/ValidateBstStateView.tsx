import type { AlgorithmStateViewProps } from '../../types/algorithm';
import { TreeDiagram } from '../../components/TreeDiagram';

/** Mirrors AlgoLens.Core.Models.ValidateBstState (camelCase JSON). */
interface ValidateBstState {
  tree: (number | null)[];
  currentVal: number | null;
  lowerLabel: string;
  upperLabel: string;
  isValidSoFar: boolean;
}

export function ValidateBstStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as ValidateBstState;

  const roles = state.currentVal !== null ? { [state.currentVal]: 'current' as const } : {};
  const labels =
    state.currentVal !== null ? { [state.currentVal]: `(${state.lowerLabel}, ${state.upperLabel})` } : {};

  return (
    <div className="flex flex-col gap-4 text-sm">
      <TreeDiagram tree={state.tree} roles={roles} labels={labels} />
      <p className="font-medium text-gray-700 dark:text-gray-300">
        Status so far:{' '}
        <span className={state.isValidSoFar ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
          {state.isValidSoFar ? 'valid' : 'invalid'}
        </span>
      </p>
    </div>
  );
}
