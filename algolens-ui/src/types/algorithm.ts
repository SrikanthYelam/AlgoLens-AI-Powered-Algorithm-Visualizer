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

/** Mirrors AlgoLens.Api.Contracts.SubmitSolutionResponse (camelCase JSON). */
export interface SubmitSolutionResponse {
  compileSucceeded: boolean;
  compileErrors: string[];
  ranSuccessfully: boolean;
  runtimeError: string | null;
  yourAnswer: unknown;
  expectedAnswer: unknown;
  elapsedMilliseconds: number;
}

/** Props every algorithm's input form component must accept. */
export interface AlgorithmInputFormProps {
  onSubmit: (body: unknown) => void;
  isLoading: boolean;
  /**
   * When set, the form should seed its fields from this (the exact request-body shape it would
   * itself submit) instead of its hardcoded default — set when the page remounts the form after
   * an example chip is clicked, read once via `useState(() => ...)`, not kept in sync afterward.
   */
  initialInput?: unknown;
}

/** Props every algorithm's per-step state view component must accept. */
export interface AlgorithmStateViewProps {
  step: Step;
  /** Steps 0..current inclusive, so a view can diff against the previous step (what was pushed, popped, moved). */
  history?: Step[];
  /** The input of the run being shown, for views that draw it (e.g. a graph's edges). */
  input?: unknown;
}
