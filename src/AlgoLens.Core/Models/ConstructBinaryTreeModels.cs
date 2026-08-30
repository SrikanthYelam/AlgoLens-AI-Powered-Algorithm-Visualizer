namespace AlgoLens.Core.Models;

public sealed record ConstructBinaryTreeInput(IReadOnlyList<int> Preorder, IReadOnlyList<int> Inorder);

/// <summary>
/// State snapshot for Construct Binary Tree from Preorder and Inorder Traversal at a given
/// step. `PreorderIndex` is the preorder position just consumed as a new root (-1 outside the
/// build). `InorderStart`/`InorderEnd` is the inorder sub-range (inclusive) that root's subtree
/// spans. `Tree` is the tree *as built so far* — since nodes are created before their children
/// are attached, this grows incrementally across steps rather than only appearing complete at
/// the end. `Root` carries the actual root `TreeNode` (only populated on the final step) purely
/// so the judge can compare it structurally against a user's returned tree — it isn't rendered.
/// </summary>
public sealed record ConstructBinaryTreeState(
    IReadOnlyList<int> Preorder,
    IReadOnlyList<int> Inorder,
    int PreorderIndex,
    int InorderStart,
    int InorderEnd,
    IReadOnlyList<int?> Tree,
    TreeNode? Root
);
