namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot for Recover Binary Search Tree at a given step. `Tree` is the tree shape
/// (values may still be corrupted, or already fixed once `Root` is populated). `CurrentVal` is
/// the node currently being visited in inorder order (null outside the traversal); `PrevVal` is
/// the previously visited node's value. `FirstVal`/`SecondVal` are the two misplaced values
/// identified so far (both null until the first dip is found). `Root` carries the corrected
/// tree, but only on the final step and only so the judge can compare it structurally against
/// a user's own in-place fix — it isn't rendered.
/// </summary>
public sealed record RecoverBstState(
    IReadOnlyList<int?> Tree,
    int? CurrentVal,
    int? PrevVal,
    int? FirstVal,
    int? SecondVal,
    TreeNode? Root
);
