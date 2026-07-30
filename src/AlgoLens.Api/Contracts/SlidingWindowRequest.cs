namespace AlgoLens.Api.Contracts;

public sealed record SlidingWindowRequest(IReadOnlyList<int> Nums, int WindowSize);
