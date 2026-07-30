namespace AlgoLens.Core.Models;

public sealed record SlidingWindowInput(IReadOnlyList<int> Nums, int WindowSize);

/// <summary>
/// State snapshot for Sliding Window Maximum at a given step.
/// </summary>
public sealed record SlidingWindowState(
    IReadOnlyList<int> Nums,
    int WindowSize,
    int CurrentIndex,
    IReadOnlyList<int> Deque,
    IReadOnlyList<int> Result
);
