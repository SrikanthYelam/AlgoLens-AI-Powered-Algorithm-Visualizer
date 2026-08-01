using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Breadth-first level order traversal of a binary tree, capturing one step
/// per node dequeue so the frontend can animate the queue and level results
/// as they build up.
/// </summary>
public sealed class BinaryTreeLevelOrderTraversal : IAlgorithmVisualizer<TreeNode?>
{
    public string Id => "binary-tree-level-order-traversal";

    public IReadOnlyList<AlgorithmStep> Run(TreeNode? root)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (root is null)
        {
            StepRecorder.Add(steps, ref stepNumber, "Tree is empty; there are no levels to traverse.",
                new TreeTraversalState([], [], []), [], spanLines: 2);
            return steps;
        }

        var completedLevels = new List<IReadOnlyList<int>>();
        var queue = new Queue<TreeNode>();
        queue.Enqueue(root);
        StepRecorder.Add(steps, ref stepNumber, $"Start: enqueue root node {root.Val}.",
            new TreeTraversalState(
                Queue: queue.Select(n => (int?)n.Val).ToList(),
                CompletedLevels: completedLevels.ToList(),
                CurrentLevelInProgress: []),
            [root.Val.ToString()],
            spanLines: 2);

        while (queue.Count > 0)
        {
            var levelSize = queue.Count;
            var currentLevel = new List<int>();

            for (var i = 0; i < levelSize; i++)
            {
                var node = queue.Dequeue();
                currentLevel.Add(node.Val);

                var enqueuedChildren = new List<string>();
                if (node.Left is not null)
                {
                    queue.Enqueue(node.Left);
                    enqueuedChildren.Add(node.Left.Val.ToString());
                }
                if (node.Right is not null)
                {
                    queue.Enqueue(node.Right);
                    enqueuedChildren.Add(node.Right.Val.ToString());
                }

                var action = enqueuedChildren.Count > 0
                    ? $"Dequeue {node.Val}; add to current level; enqueue children {string.Join(", ", enqueuedChildren)}."
                    : $"Dequeue {node.Val}; add to current level (no children to enqueue).";

                var isLastInLevel = i == levelSize - 1;
                var levelsSoFar = isLastInLevel
                    ? completedLevels.Append((IReadOnlyList<int>)currentLevel.ToList()).ToList()
                    : completedLevels.ToList();

                StepRecorder.Add(steps, ref stepNumber,
                    isLastInLevel ? $"{action} Level complete: [{string.Join(", ", currentLevel)}]." : action,
                    new TreeTraversalState(
                        Queue: queue.Select(n => (int?)n.Val).ToList(),
                        CompletedLevels: levelsSoFar,
                        CurrentLevelInProgress: isLastInLevel ? [] : currentLevel.ToList()),
                    [node.Val.ToString()],
                    spanLines: 24);
            }

            completedLevels.Add(currentLevel);
        }

        return steps;
    }
}
