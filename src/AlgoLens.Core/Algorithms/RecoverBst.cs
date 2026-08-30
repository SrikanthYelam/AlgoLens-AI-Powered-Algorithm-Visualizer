using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Recover Binary Search Tree via inorder traversal: a valid BST's inorder sequence is sorted,
/// so exactly two swapped node values show up as one or two "dips" — a value smaller than the
/// one visited immediately before it. The first dip's earlier node is always the first
/// misplaced value; whichever node ends the *most recent* dip is always the second misplaced
/// value — for adjacent swapped nodes that's the very same dip (one dip total), and for
/// non-adjacent ones it's the second, later dip, since everything strictly between the two
/// dips is still in correct relative order. Recovering the tree is then just swapping those
/// two nodes' values back, without touching the tree's actual shape.
/// </summary>
public sealed class RecoverBst : IAlgorithmVisualizer<TreeNode?>
{
    public string Id => "recover-binary-search-tree";

    public IReadOnlyList<AlgorithmStep> Run(TreeNode? root)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (root is null)
        {
            StepRecorder.Add(steps, ref stepNumber, "Empty tree; nothing to recover.",
                new RecoverBstState([], null, null, null, null, null), [], spanLines: 2);
            return steps;
        }

        TreeNode? prev = null;
        TreeNode? first = null;
        TreeNode? second = null;

        void Inorder(TreeNode? node)
        {
            if (node is null)
            {
                return;
            }

            Inorder(node.Left);

            string action;
            if (prev is not null && prev.Val > node.Val)
            {
                var isFirstDip = first is null;
                first ??= prev;
                second = node;
                action = isFirstDip
                    ? $"Dip found: {prev.Val} came right before {node.Val}, which is smaller — mark {prev.Val} as the first misplaced value."
                    : $"Another dip found: {prev.Val} came right before {node.Val}, which is smaller — update the second misplaced value to {node.Val}.";
            }
            else
            {
                action = prev is null
                    ? $"Visit {node.Val}; first node in sorted order so far."
                    : $"Visit {node.Val}; still in increasing order after {prev.Val}.";
            }

            StepRecorder.Add(steps, ref stepNumber, action,
                new RecoverBstState(TreeNode.ToLevelOrderArray(root), node.Val, prev?.Val, first?.Val, second?.Val, null),
                [node.Val.ToString()],
                spanLines: 17);

            prev = node;
            Inorder(node.Right);
        }

        Inorder(root);

        if (first is not null && second is not null)
        {
            (first.Val, second.Val) = (second.Val, first.Val);
        }

        StepRecorder.Add(steps, ref stepNumber,
            first is not null && second is not null
                ? $"Done: swapped {first.Val} and {second.Val} back — the tree is now a valid BST."
                : "Done: the tree was already a valid BST.",
            new RecoverBstState(TreeNode.ToLevelOrderArray(root), null, null, first?.Val, second?.Val, root),
            [],
            spanLines: 1);

        return steps;
    }
}
