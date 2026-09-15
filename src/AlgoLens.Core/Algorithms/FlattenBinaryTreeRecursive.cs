using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Flatten Binary Tree to Linked List via a genuine recursive preorder traversal (visit the node
/// before its children), relinking as it goes: each node's original left/right children are
/// captured before they're overwritten, the previously-visited node's `Right` is pointed at this
/// node (and its `Left` cleared), then the traversal recurses into the saved left child and then
/// the saved right child — exactly preorder order, so the resulting right-only chain is the
/// tree's preorder sequence.
/// </summary>
public sealed class FlattenBinaryTreeRecursive : IAlgorithmVisualizer<TreeNode?>
{
    public string Id => "flatten-binary-tree-recursive";

    public IReadOnlyList<AlgorithmStep> Run(TreeNode? root)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (root is null)
        {
            StepRecorder.Add(steps, ref stepNumber, "Tree is empty; nothing to flatten.",
                new FlattenBinaryTreeRecursiveState([], null, null, null), [], spanLines: 2);
            return steps;
        }

        TreeNode? prev = null;

        void Flatten(TreeNode? node)
        {
            if (node is null)
            {
                return;
            }

            var left = node.Left;
            var right = node.Right;

            if (prev is not null)
            {
                prev.Right = node;
                prev.Left = null;
            }
            var prevVal = prev?.Val;
            prev = node;

            StepRecorder.Add(steps, ref stepNumber,
                prevVal is null
                    ? $"Visit {node.Val}; first node in preorder, starts the list."
                    : $"Visit {node.Val}; link it after {prevVal}.",
                new FlattenBinaryTreeRecursiveState(TreeNode.ToLevelOrderArray(root), node.Val, prevVal, null),
                [node.Val.ToString()],
                spanLines: 11);

            Flatten(left);
            Flatten(right);
        }

        Flatten(root);

        StepRecorder.Add(steps, ref stepNumber,
            "Done: the tree is now a right-only chain in preorder order.",
            new FlattenBinaryTreeRecursiveState(TreeNode.ToLevelOrderArray(root), null, null, root),
            [],
            spanLines: 1);

        return steps;
    }
}
