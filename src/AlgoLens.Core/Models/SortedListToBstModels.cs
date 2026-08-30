namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot for Convert Sorted List to Binary Search Tree at a given step. `Segment` is
/// the current list segment being converted (a snapshot taken before it gets severed further).
/// `MiddleIndex` is where the slow pointer landed within it (-1 outside the recursion) — that
/// value becomes this subtree's root. `Tree` is the tree *as built so far*, since nodes are
/// created before their children are attached. `Root` carries the actual root `TreeNode`, but
/// only on the final step and only so the judge can compare it structurally against a user's
/// own returned `TreeNode` — it isn't rendered.
/// </summary>
public sealed record SortedListToBstState(
    IReadOnlyList<int> Segment,
    int MiddleIndex,
    IReadOnlyList<int?> Tree,
    TreeNode? Root
);
