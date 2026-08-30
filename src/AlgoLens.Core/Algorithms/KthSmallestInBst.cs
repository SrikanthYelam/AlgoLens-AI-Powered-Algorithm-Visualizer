using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Kth Smallest Element in a BST via iterative inorder traversal with an explicit stack: an
/// inorder walk of a BST visits nodes in ascending sorted order, so the kth node visited is
/// the answer. Unlike the other tree problems here, which recurse directly, this one threads
/// its own stack — first pushing every left descendant of the current node, then popping and
/// "visiting" a node (counting it) before moving on to its right subtree. The walk stops the
/// moment the kth node is visited, without exploring the rest of the tree.
/// </summary>
public sealed class KthSmallestInBst : IAlgorithmVisualizer<KthSmallestInput>
{
    public string Id => "kth-smallest-in-bst";

    public IReadOnlyList<AlgorithmStep> Run(KthSmallestInput input)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;
        var treeArray = TreeNode.ToLevelOrderArray(input.Root);

        var stack = new Stack<TreeNode>();
        var current = input.Root;
        var visitedCount = 0;
        int? answer = null;

        while ((current is not null || stack.Count > 0) && answer is null)
        {
            while (current is not null)
            {
                stack.Push(current);
                StepRecorder.Add(steps, ref stepNumber,
                    $"Go left from {current.Val}, pushing it onto the stack.",
                    new KthSmallestState(treeArray, current.Val, visitedCount, input.K, null),
                    [current.Val.ToString()],
                    spanLines: 1);
                current = current.Left;
            }

            var node = stack.Pop();
            visitedCount++;
            var isAnswer = visitedCount == input.K;
            if (isAnswer)
            {
                answer = node.Val;
            }

            StepRecorder.Add(steps, ref stepNumber,
                isAnswer
                    ? $"Visit {node.Val} — the {Ordinal(visitedCount)} node in sorted order, which is the answer."
                    : $"Visit {node.Val} — the {Ordinal(visitedCount)} node in sorted order.",
                new KthSmallestState(treeArray, node.Val, visitedCount, input.K, answer),
                [node.Val.ToString()],
                spanLines: 8);

            current = node.Right;
        }

        StepRecorder.Add(steps, ref stepNumber,
            answer is not null
                ? $"Done: the {Ordinal(input.K)} smallest value is {answer}."
                : "Done: k is larger than the number of nodes in the tree — no such element exists.",
            new KthSmallestState(treeArray, null, visitedCount, input.K, answer),
            [],
            spanLines: 1);

        return steps;
    }

    private static string Ordinal(int n)
    {
        if (n % 100 is 11 or 12 or 13)
        {
            return $"{n}th";
        }

        return (n % 10) switch
        {
            1 => $"{n}st",
            2 => $"{n}nd",
            3 => $"{n}rd",
            _ => $"{n}th",
        };
    }
}
