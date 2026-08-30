using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Lowest Common Ancestor of a Binary Tree via recursive post-order search: each call reports
/// back up whichever target (p or q) it found in its own subtree, or null if it found neither.
/// A node becomes the answer the moment both of its children's calls report back a different,
/// non-null target — that's the first point where p and q's search paths diverge, which is
/// exactly the definition of their lowest common ancestor. If only one side reports something,
/// that result is simply passed further up unchanged.
/// </summary>
public sealed class LowestCommonAncestor : IAlgorithmVisualizer<LowestCommonAncestorInput>
{
    public string Id => "lowest-common-ancestor";

    public IReadOnlyList<AlgorithmStep> Run(LowestCommonAncestorInput input)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;
        var treeArray = TreeNode.ToLevelOrderArray(input.Root);
        var p = input.P;
        var q = input.Q;
        int? ancestor = null;
        TreeNode? ancestorNode = null;

        TreeNode? Find(TreeNode? node)
        {
            if (node is null)
            {
                return null;
            }

            if (node.Val == p || node.Val == q)
            {
                StepRecorder.Add(steps, ref stepNumber,
                    $"Node {node.Val} is one of the targets ({p} or {q}) — report it back up.",
                    new LowestCommonAncestorState(treeArray, node.Val, p, q, ancestor, ancestorNode),
                    [node.Val.ToString()],
                    spanLines: 2);
                return node;
            }

            var left = Find(node.Left);
            var right = Find(node.Right);

            if (left is not null && right is not null)
            {
                ancestor = node.Val;
                ancestorNode = node;
                StepRecorder.Add(steps, ref stepNumber,
                    $"Node {node.Val} has a target in each subtree ({left.Val} on the left, {right.Val} on the right) — it's the lowest common ancestor.",
                    new LowestCommonAncestorState(treeArray, node.Val, p, q, ancestor, ancestorNode),
                    [node.Val.ToString()],
                    spanLines: 4);
                return node;
            }

            var found = left ?? right;
            StepRecorder.Add(steps, ref stepNumber,
                found is not null
                    ? $"Node {node.Val} only has target {found.Val} below it — pass it further up."
                    : $"Node {node.Val} has neither target below it.",
                new LowestCommonAncestorState(treeArray, node.Val, p, q, ancestor, ancestorNode),
                [node.Val.ToString()],
                spanLines: 2);
            return found;
        }

        var topLevelResult = Find(input.Root);

        // If neither call ever saw both targets in separate subtrees, one target must be an
        // ancestor of the other — in that case the outermost call's own return value (the
        // shallower target, found via the p/q match branch above) is the answer.
        if (ancestor is null && topLevelResult is not null)
        {
            ancestor = topLevelResult.Val;
            ancestorNode = topLevelResult;
        }

        StepRecorder.Add(steps, ref stepNumber,
            $"Done: the lowest common ancestor of {p} and {q} is {ancestor}.",
            new LowestCommonAncestorState(treeArray, null, p, q, ancestor, ancestorNode),
            [],
            spanLines: 1);

        return steps;
    }
}
