namespace AlgoLens.Api.Contracts;

public sealed record TraversalResponse(string AlgorithmId, IReadOnlyList<StepDto> Steps);
