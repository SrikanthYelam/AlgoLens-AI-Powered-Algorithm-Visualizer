using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Construct Binary Tree from Preorder and Inorder Traversal via recursive divide-and-conquer:
/// preorder's next unconsumed value is always the root of whatever subtree is currently being
/// built, since preorder visits a node before either of its children. Looking that value up in
/// the inorder array (via a precomputed value→index dictionary, avoiding an O(n) scan per call)
/// splits the remaining inorder range in two — everything left of it belongs to the left
/// subtree, everything right belongs to the right subtree — so both children can be built by
/// recursing on those two sub-ranges. Because `TreeNode` is mutable, each root node is created
/// (and linked to its own parent) before its children exist, so the tree captured in each
/// step's snapshot genuinely grows node by node rather than only appearing once fully built.
/// </summary>
public sealed class ConstructBinaryTree : IAlgorithmVisualizer<ConstructBinaryTreeInput>
{
    public string Id => "construct-binary-tree";

    public IReadOnlyList<AlgorithmStep> Run(ConstructBinaryTreeInput input)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;
        var preorder = input.Preorder;
        var inorder = input.Inorder;

        if (preorder.Count == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "Empty traversal arrays; the tree is empty.",
                new ConstructBinaryTreeState(preorder, inorder, -1, -1, -1, [], null), [], spanLines: 2);
            return steps;
        }

        var inorderIndexOf = new Dictionary<int, int>();
        for (var i = 0; i < inorder.Count; i++)
        {
            inorderIndexOf[inorder[i]] = i;
        }

        TreeNode? root = null;
        var preorderIndex = 0;

        TreeNode Build(int inorderStart, int inorderEnd)
        {
            var rootVal = preorder[preorderIndex];
            var node = new TreeNode { Val = rootVal };
            var thisPreorderIndex = preorderIndex;
            preorderIndex++;
            root ??= node;

            StepRecorder.Add(steps, ref stepNumber,
                $"Next preorder value is {rootVal} — it's the root of this subtree (inorder range [{inorderStart}, {inorderEnd}]).",
                new ConstructBinaryTreeState(preorder, inorder, thisPreorderIndex, inorderStart, inorderEnd, TreeNode.ToLevelOrderArray(root), null),
                [rootVal.ToString()],
                spanLines: 6);

            var mid = inorderIndexOf[rootVal];

            if (mid > inorderStart)
            {
                node.Left = Build(inorderStart, mid - 1);
            }

            if (mid < inorderEnd)
            {
                node.Right = Build(mid + 1, inorderEnd);
            }

            return node;
        }

        Build(0, inorder.Count - 1);

        StepRecorder.Add(steps, ref stepNumber,
            "Done: the tree has been fully reconstructed.",
            new ConstructBinaryTreeState(preorder, inorder, -1, -1, -1, TreeNode.ToLevelOrderArray(root), root),
            [],
            spanLines: 1);

        return steps;
    }
}
