namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot shared by backtracking algorithms that build a path of
/// integers and record completed paths as solutions (Permutations,
/// Combinations, Subsets).
/// </summary>
public sealed record BacktrackingState(
    IReadOnlyList<int> Path,
    IReadOnlyList<IReadOnlyList<int>> Solutions
);
