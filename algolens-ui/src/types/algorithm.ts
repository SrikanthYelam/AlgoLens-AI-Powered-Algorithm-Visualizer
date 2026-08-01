/** Mirrors AlgoLens.Api.Contracts.StepDto (camelCase JSON). */
export interface Step {
  stepNumber: number;
  action: string;
  state: unknown;
  highlights: string[];
  sourceLineStart: number;
  sourceLineEnd: number;
  explanation: string | null;
}

/** Mirrors AlgoLens.Api.Contracts.TraversalResponse (camelCase JSON). */
export interface AlgorithmRunResponse {
  algorithmId: string;
  steps: Step[];
}

/** Mirrors AlgoLens.Api.Contracts.AlgorithmSourceResponse (camelCase JSON). */
export interface AlgorithmSourceResponse {
  language: string;
  source: string;
}

/** Props every algorithm's input form component must accept. */
export interface AlgorithmInputFormProps {
  onSubmit: (body: unknown) => void;
  isLoading: boolean;
}

/** Props every algorithm's per-step state view component must accept. */
export interface AlgorithmStateViewProps {
  step: Step;
}
