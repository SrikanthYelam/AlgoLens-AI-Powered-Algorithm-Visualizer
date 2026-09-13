namespace AlgoLens.Api.Contracts;

public sealed record DeleteNodeInBstRequest(IReadOnlyList<int?> Values, int Key);
