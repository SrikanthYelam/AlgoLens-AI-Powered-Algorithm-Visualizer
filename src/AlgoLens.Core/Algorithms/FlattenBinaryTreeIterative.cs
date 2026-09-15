using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Flatten Binary Tree to Linked List via the O(1)-extra-space "threading" technique — no
/// recursion, no explicit stack. `curr` walks down the tree's eventual right-only chain.
/// Whenever `curr` has a left child, that left subtree's rightmost node (found by walking
/// `Right` pointers to the end) is exactly where `curr`'s *original* right subtree needs to
/// reattach once the left subtree slides into `curr.Right`'s place — wiring that up first
/// (`temp.Right = curr.Right`) before overwriting `curr.Right`/`curr.Left` is what keeps the
/// whole tree threaded together with no auxiliary storage. Once there's nothing left to fix at
/// `curr`, `curr = curr.Right` continues down the same chain, which is now guaranteed complete up
/// to this point. Each node's left subtree is searched for a rightmost node at most once across
/// the whole run (once threaded into the chain, a subtree is never revisited), so despite the
/// nested-looking loops this is O(n) time overall, not O(n²).
/// </summary>
public sealed class FlattenBinaryTreeIterative : IAlgorithmVisualizer<TreeNode?>
{
    public string Id => "flatten-binary-tree-iterative";

    public IReadOnlyList<AlgorithmStep> Run(TreeNode? root)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (root is null)
        {
            StepRecorder.Add(steps, ref stepNumber, "Tree is empty; nothing to flatten.",
                new FlattenBinaryTreeIterativeState([], null, null, null), [], spanLines: 2);
            return steps;
        }

        var curr = root;

        while (curr is not null)
        {
            int? predecessorVal = null;

            if (curr.Left is not null)
            {
                var temp = curr.Left;
                while (temp.Right is not null)
                {
                    temp = temp.Right;
                }
                predecessorVal = temp.Val;

                temp.Right = curr.Right;
                curr.Right = curr.Left;
                curr.Left = null;
            }

            StepRecorder.Add(steps, ref stepNumber,
                predecessorVal is null
                    ? $"{curr.Val} has no left child; move on."
                    : $"{curr.Val}: its left subtree's rightmost node is {predecessorVal} — attach {curr.Val}'s old right subtree there, then swing the left subtree over to become the right subtree.",
                new FlattenBinaryTreeIterativeState(TreeNode.ToLevelOrderArray(root), curr.Val, predecessorVal, null),
                [curr.Val.ToString()],
                spanLines: 16);

            curr = curr.Right;
        }

        StepRecorder.Add(steps, ref stepNumber,
            "Done: the tree is now a right-only chain in preorder order.",
            new FlattenBinaryTreeIterativeState(TreeNode.ToLevelOrderArray(root), null, null, root),
            [],
            spanLines: 1);

        return steps;
    }
}
