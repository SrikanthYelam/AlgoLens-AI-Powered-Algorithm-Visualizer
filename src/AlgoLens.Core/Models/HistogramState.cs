namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot for Largest Rectangle in Histogram at a given step.
/// </summary>
public sealed record HistogramState(
    IReadOnlyList<int> Heights,
    int CurrentIndex,
    IReadOnlyList<int> Stack,
    int MaxArea
);
