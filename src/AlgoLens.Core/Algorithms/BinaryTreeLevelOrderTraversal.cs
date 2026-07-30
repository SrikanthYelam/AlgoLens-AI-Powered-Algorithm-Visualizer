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

        if (root is null)
        {
            steps.Add(new AlgorithmStep(
                StepNumber: 0,
                Action: "Tree is empty; there are no levels to traverse.",
                State: new TreeTraversalState([], [], []),
                Highlights: []));
            return steps;
        }

        var queue = new Queue<TreeNode>();
        queue.Enqueue(root);

        var completedLevels = new List<IReadOnlyList<int>>();
        var stepNumber = 0;

        steps.Add(new AlgorithmStep(
            StepNumber: stepNumber++,
            Action: $"Start: enqueue root node {root.Val}.",
            State: new TreeTraversalState(
                Queue: queue.Select(n => (int?)n.Val).ToList(),
                CompletedLevels: completedLevels.ToList(),
                CurrentLevelInProgress: []),
            Highlights: [root.Val.ToString()]));

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

                steps.Add(new AlgorithmStep(
                    StepNumber: stepNumber++,
                    Action: isLastInLevel ? $"{action} Level complete: [{string.Join(", ", currentLevel)}]." : action,
                    State: new TreeTraversalState(
                        Queue: queue.Select(n => (int?)n.Val).ToList(),
                        CompletedLevels: levelsSoFar,
                        CurrentLevelInProgress: isLastInLevel ? [] : currentLevel.ToList()),
                    Highlights: [node.Val.ToString()]));
            }

            completedLevels.Add(currentLevel);
        }

        return steps;
    }
}
