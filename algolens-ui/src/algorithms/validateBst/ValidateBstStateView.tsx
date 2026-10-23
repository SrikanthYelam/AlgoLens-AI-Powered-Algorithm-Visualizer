import type { AlgorithmStateViewProps } from '../../types/algorithm';
import { TreeDiagram } from '../../components/TreeDiagram';
import { VizStack } from '../../components/viz';

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
    <VizStack>
      <TreeDiagram tree={state.tree} roles={roles} labels={labels} />
      <p className="font-medium text-ink">
        Status so far:{' '}
        <span className={state.isValidSoFar ? 'text-success' : 'font-semibold'}>
          {state.isValidSoFar ? '✓ valid' : '✕ invalid'}
        </span>
      </p>
    </VizStack>
  );
}
