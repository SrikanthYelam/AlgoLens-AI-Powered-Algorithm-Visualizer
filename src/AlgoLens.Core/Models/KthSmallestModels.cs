namespace AlgoLens.Core.Models;

public sealed record KthSmallestInput(TreeNode? Root, int K);

/// <summary>
/// State snapshot for Kth Smallest Element in a BST at a given step. `Tree` is the static tree
/// shape. `CurrentVal` is the node currently being visited (null outside the traversal).
/// `VisitedCount` is how many nodes have been visited in sorted (inorder) order so far. `K` is
/// the target rank. `Answer` is set once the kth node has been reached.
/// </summary>
public sealed record KthSmallestState(
    IReadOnlyList<int?> Tree,
    int? CurrentVal,
    int VisitedCount,
    int K,
    int? Answer
);
