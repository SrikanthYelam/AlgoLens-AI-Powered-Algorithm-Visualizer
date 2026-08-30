namespace AlgoLens.Core.Models;

public sealed record LowestCommonAncestorInput(TreeNode? Root, int P, int Q);

/// <summary>
/// State snapshot for Lowest Common Ancestor of a Binary Tree at a given step. `Tree` is the
/// static tree shape. `CurrentVal` is the node currently being visited (null outside the
/// recursion). `P`/`Q` are the two target values being searched for. `Ancestor` is set once
/// the lowest common ancestor has been identified, and stays set for every step after.
/// `AncestorNode` carries the actual ancestor `TreeNode` (same value, once known) purely so the
/// judge can compare it structurally against a user's returned `TreeNode` — it isn't rendered.
/// </summary>
public sealed record LowestCommonAncestorState(
    IReadOnlyList<int?> Tree,
    int? CurrentVal,
    int P,
    int Q,
    int? Ancestor,
    TreeNode? AncestorNode
);
