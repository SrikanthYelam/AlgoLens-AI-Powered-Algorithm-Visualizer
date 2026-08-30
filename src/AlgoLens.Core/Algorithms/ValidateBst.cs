using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Validate Binary Search Tree via bounds-passing DFS: each recursive call carries the open
/// interval (lower, upper) that the current node's value must fall within, given the values
/// already fixed by its ancestors. A left child inherits its parent's lower bound but gets the
/// parent's value as its new upper bound; a right child is the mirror image. `long` bounds
/// (rather than `int`) avoid overflow at the extremes, since a node's value can itself be
/// int.MinValue or int.MaxValue. The recursion stops at the first violation found — every call
/// after that is a no-op, so no wasted steps are recorded once the answer is already "no".
/// </summary>
public sealed class ValidateBst : IAlgorithmVisualizer<TreeNode?>
{
    public string Id => "validate-binary-search-tree";

    public IReadOnlyList<AlgorithmStep> Run(TreeNode? root)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;
        var treeArray = TreeNode.ToLevelOrderArray(root);

        if (root is null)
        {
            StepRecorder.Add(steps, ref stepNumber, "Empty tree is trivially a valid BST.",
                new ValidateBstState(treeArray, null, "-∞", "∞", true), [], spanLines: 2);
            return steps;
        }

        var isValid = true;

        bool Validate(TreeNode? node, long lower, long upper)
        {
            if (node is null || !isValid)
            {
                return true;
            }

            var inBounds = node.Val > lower && node.Val < upper;
            var lowerLabel = DescribeBound(lower);
            var upperLabel = DescribeBound(upper);
            StepRecorder.Add(steps, ref stepNumber,
                inBounds
                    ? $"Node {node.Val} is within its allowed range ({lowerLabel}, {upperLabel})."
                    : $"Node {node.Val} is outside its allowed range ({lowerLabel}, {upperLabel}) — not a valid BST.",
                new ValidateBstState(treeArray, node.Val, lowerLabel, upperLabel, inBounds),
                [node.Val.ToString()],
                spanLines: 8);

            if (!inBounds)
            {
                isValid = false;
                return false;
            }

            return Validate(node.Left, lower, node.Val) && Validate(node.Right, node.Val, upper);
        }

        Validate(root, long.MinValue, long.MaxValue);

        StepRecorder.Add(steps, ref stepNumber,
            isValid
                ? "Done: every node fell within its allowed range — this is a valid BST."
                : "Done: not a valid BST.",
            new ValidateBstState(treeArray, null, "-∞", "∞", isValid),
            [],
            spanLines: 1);

        return steps;
    }

    private static string DescribeBound(long bound) =>
        bound == long.MinValue ? "-∞" : bound == long.MaxValue ? "∞" : bound.ToString();
}
