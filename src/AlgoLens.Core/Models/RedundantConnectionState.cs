namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot for Redundant Connection at a given step. Nodes are 1-indexed (`Parent[0]` is
/// unused), matching LeetCode's own node numbering. `Answer` is the redundant edge once found
/// (`[u, v]`), else `null`.
/// </summary>
public sealed record RedundantConnectionState(
    int N,
    IReadOnlyList<int> Parent,
    int CurrentU,
    int CurrentV,
    IReadOnlyList<int>? Answer
);
