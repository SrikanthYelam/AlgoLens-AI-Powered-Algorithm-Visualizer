namespace AlgoLens.Core.Models;

public sealed record LongestSubarrayAbsDiffLimitInput(IReadOnlyList<int> Nums, int Limit);

/// <summary>
/// State snapshot for Longest Continuous Subarray With Absolute Diff Less Than Or Equal To Limit
/// at a given step.
/// </summary>
public sealed record LongestSubarrayAbsDiffLimitState(
    IReadOnlyList<int> Nums,
    int Limit,
    int Left,
    int Right,
    IReadOnlyList<int> MaxDeque,
    IReadOnlyList<int> MinDeque,
    int BestStart,
    int BestLength
);
