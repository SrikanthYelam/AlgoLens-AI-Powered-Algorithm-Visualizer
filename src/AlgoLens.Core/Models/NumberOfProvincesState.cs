namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot for Number of Provinces at a given step. `Parent` is the disjoint-set-union
/// parent array (path-compressed as of this snapshot); `Parent[i] == i` means `i` is currently a
/// root. `Components` is the running province count.
/// </summary>
public sealed record NumberOfProvincesState(
    int N,
    IReadOnlyList<int> Parent,
    int CurrentI,
    int CurrentJ,
    int Components
);
