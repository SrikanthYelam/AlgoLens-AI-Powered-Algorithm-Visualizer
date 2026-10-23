import { Cell, CellRow, Legend, VizSection, VizStack } from '../../components/viz';
import type { AlgorithmStateViewProps } from '../../types/algorithm';

/** Mirrors AlgoLens.Core.Models.NumberOfProvincesState (camelCase JSON). */
interface NumberOfProvincesState {
  n: number;
  parent: number[];
  currentI: number;
  currentJ: number;
  components: number;
}

export function NumberOfProvincesStateView({ step }: AlgorithmStateViewProps) {
  const state = step.state as NumberOfProvincesState;

  return (
    <VizStack>
      <VizSection
        title={
          <>
            Union-Find parent array · <Legend state="range">root (parent = own index)</Legend>{' '}
            <Legend state="current">being unioned</Legend>
          </>
        }
      >
        <CellRow>
          {state.parent.map((value, index) => (
            <Cell
              key={index}
              value={value}
              index={index}
              state={
                index === state.currentI || index === state.currentJ ? 'current' : value === index ? 'range' : 'plain'
              }
            />
          ))}
        </CellRow>
      </VizSection>

      <p className="font-medium text-ink">
        Provinces so far: <span className="font-mono font-semibold">{state.components}</span>
      </p>
    </VizStack>
  );
}
