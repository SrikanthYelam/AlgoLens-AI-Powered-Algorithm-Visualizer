namespace AlgoLens.Core.Models;

public sealed record DeleteNodeInBstInput(TreeNode? Root, int Key);

/// <summary>
/// State snapshot for Delete Node in a BST at a given step. `Tree` is the tree shape *after*
/// this step's mutation (if any). `CurrentValue` is the node currently being compared against —
/// either the original `Key` during the search, or (once the target is found and it has two
/// children) the inorder successor's value while it's being spliced out of the right subtree.
/// `Root` carries the raw, possibly-new `TreeNode` root, but only on the final step and only so
/// the judge can compare it structurally against a user's own returned `TreeNode` — it isn't
/// rendered.
/// </summary>
public sealed record DeleteNodeInBstState(
    IReadOnlyList<int?> Tree,
    int? CurrentValue,
    int Key,
    TreeNode? Root
);
