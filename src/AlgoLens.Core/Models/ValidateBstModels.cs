namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot for Validate Binary Search Tree at a given step. `Tree` is the static tree
/// shape (level-order array). `CurrentVal` is the node currently being checked (null outside
/// the recursion). `LowerLabel`/`UpperLabel` are the open interval this node's value must fall
/// within, pre-formatted for display ("-∞"/"∞" at the extremes rather than raw sentinel
/// numbers). `IsValidSoFar` tracks whether every node checked up to this point has been in
/// bounds.
/// </summary>
public sealed record ValidateBstState(
    IReadOnlyList<int?> Tree,
    int? CurrentVal,
    string LowerLabel,
    string UpperLabel,
    bool IsValidSoFar
);
