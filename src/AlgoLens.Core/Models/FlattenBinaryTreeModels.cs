namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot for the recursive Flatten Binary Tree to Linked List visualizer at a given
/// step. `Root` carries the raw, possibly-relinked `TreeNode` root, but only on the final step
/// and only so the judge can compare it structurally against a user's own mutated `TreeNode` —
/// it isn't rendered.
/// </summary>
public sealed record FlattenBinaryTreeRecursiveState(
    IReadOnlyList<int?> Tree,
    int? CurrentValue,
    int? PrevValue,
    TreeNode? Root
);

/// <summary>
/// State snapshot for the iterative (O(1)-space threading) Flatten Binary Tree to Linked List
/// visualizer at a given step. `PredecessorValue` is the rightmost node of `CurrentValue`'s left
/// subtree — the node `curr`'s old right subtree gets re-attached to — set only on steps where
/// `curr` actually had a left child. `Root` carries the raw, possibly-relinked `TreeNode` root,
/// but only on the final step and only for the judge — it isn't rendered.
/// </summary>
public sealed record FlattenBinaryTreeIterativeState(
    IReadOnlyList<int?> Tree,
    int? CurrentValue,
    int? PredecessorValue,
    TreeNode? Root
);
