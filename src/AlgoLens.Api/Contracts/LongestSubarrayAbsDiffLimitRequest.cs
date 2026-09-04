namespace AlgoLens.Api.Contracts;

public sealed record LongestSubarrayAbsDiffLimitRequest(IReadOnlyList<int> Nums, int Limit);
