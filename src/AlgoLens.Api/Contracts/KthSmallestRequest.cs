namespace AlgoLens.Api.Contracts;

public sealed record KthSmallestRequest(IReadOnlyList<int?> Values, int K);
