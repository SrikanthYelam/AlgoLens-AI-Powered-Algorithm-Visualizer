import { Cell, CellRow, Empty, VizSection, VizStack } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.LongestIncreasingSubsequenceBinarySearchState (camelCase JSON). */
interface LongestIncreasingSubsequenceBinarySearchState {
  nums: number[];
  tails: number[];
  index: number;
  probes: number[];
  position: number;
}

export function LongestIncreasingSubsequenceBinarySearchStateView({ step }: AlgorithmStateViewProps) {
  const { nums, tails, index, probes, position } = step.state as LongestIncreasingSubsequenceBinarySearchState;

  return (
    <VizStack>
      <VizSection title="Numbers">
        <CellRow>
          {nums.map((value, i) => (
            <Cell
              key={i}
              value={value}
              index={i}
              state={i === index ? 'current' : i < index || index === -1 ? 'visited' : 'plain'}
            />
          ))}
        </CellRow>
      </VizSection>

      <VizSection title="Tails (tails[k] = smallest last element of any increasing subsequence of length k + 1)">
        {tails.length === 0 ? (
          <Empty>empty</Empty>
        ) : (
          <CellRow>
            {tails.map((value, k) => (
              <Cell
                key={k}
                value={value}
                index={k}
                state={k === position ? 'current' : probes.includes(k) ? 'comparing' : index === -1 ? 'found' : 'plain'}
              />
            ))}
          </CellRow>
        )}
        {index >= 0 && (
          <p className="text-caption text-ink-subtle">
            Outlined cells are the tails the binary search inspected; the filled cell is where {nums[index]} landed.
          </p>
        )}
      </VizSection>

      <VizSection title="LIS length">
        <CellRow>
          <Cell value={tails.length} state={index === -1 ? 'found' : 'plain'} />
        </CellRow>
      </VizSection>
    </VizStack>
  );
}
