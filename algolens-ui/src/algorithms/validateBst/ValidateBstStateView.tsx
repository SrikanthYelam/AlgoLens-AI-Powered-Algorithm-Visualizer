import type { AlgorithmStateViewProps } from '../../types/algorithm';
import { TreeDiagram } from '../../components/TreeDiagram';
import { VizSection, VizStack } from '../../components/viz';

/** Mirrors AlgoLens.Core.Models.ValidateBstState (camelCase JSON). */
interface ValidateBstState {
  tree: (number | null)[];
  currentVal: number | null;
  lowerLabel: string;
  upperLabel: string;
  isValidSoFar: boolean;
}

const parseBound = (label: string): number | null => {
  const value = Number(label);
  return label === '-∞' || label === '∞' || Number.isNaN(value) ? null : value;
};

/** The open interval a node's value must fall inside, with the value marked on it. */
function IntervalLine({ lower, upper, value, values }: { lower: string; upper: string; value: number; values: number[] }) {
  const lo = parseBound(lower);
  const hi = parseBound(upper);
  const all = [...values, ...(lo === null ? [] : [lo]), ...(hi === null ? [] : [hi])];
  const min = Math.min(...all) - 1;
  const max = Math.max(...all) + 1;
  const pct = (v: number) => `${((v - min) / (max - min)) * 100}%`;
  const inside = (lo === null || value > lo) && (hi === null || value < hi);

  return (
    <div className="relative mx-3 mt-8 mb-6 h-6">
      <div aria-hidden="true" className="absolute inset-y-1 right-0 left-0 rounded-xs bg-surface-3" />
      <div
        aria-hidden="true"
        className="absolute inset-y-1 rounded-xs border border-state-range-border bg-state-comparing-bg"
        style={{ left: lo === null ? 0 : pct(lo), right: hi === null ? 0 : `calc(100% - ${pct(hi)})` }}
      />
      <span className="absolute top-8 -translate-x-1/2 font-mono text-caption text-ink-subtle" style={{ left: lo === null ? '0%' : pct(lo) }}>
        {lo === null ? '-∞' : lo}
      </span>
      <span className="absolute top-8 -translate-x-1/2 font-mono text-caption text-ink-subtle" style={{ left: hi === null ? '100%' : pct(hi) }}>
        {hi === null ? '∞' : hi}
      </span>
      <span
        className={`absolute -top-7 -translate-x-1/2 font-mono text-code font-semibold ${inside ? 'text-ink' : 'text-ink line-through'}`}
        style={{ left: pct(value) }}
      >
        {inside ? '▼' : '✕'} {value}
      </span>
    </div>
  );
}

export function ValidateBstStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as ValidateBstState;

  const roles = state.currentVal !== null ? { [state.currentVal]: 'current' as const } : {};
  const labels =
    state.currentVal !== null ? { [state.currentVal]: `(${state.lowerLabel}, ${state.upperLabel})` } : {};

  return (
    <VizStack>
      <TreeDiagram tree={state.tree} roles={roles} labels={labels} />

      {state.currentVal !== null && (
        <VizSection title="Allowed range for the current node (its value must fall strictly inside the shaded band)">
          <IntervalLine
            lower={state.lowerLabel}
            upper={state.upperLabel}
            value={state.currentVal}
            values={state.tree.filter((v): v is number => v !== null)}
          />
        </VizSection>
      )}
      <p className="font-medium text-ink">
        Status so far:{' '}
        <span className={state.isValidSoFar ? 'text-success' : 'font-semibold'}>
          {state.isValidSoFar ? '✓ valid' : '✕ invalid'}
        </span>
      </p>
    </VizStack>
  );
}
