namespace AlgoLens.Core.Models;

public sealed class TreeNode
{
    public required int Val { get; init; }
    public TreeNode? Left { get; set; }
    public TreeNode? Right { get; set; }

    /// <summary>
    /// Builds a tree from a LeetCode-style level-order array (e.g. [3,9,20,null,null,15,7]).
    /// </summary>
    public static TreeNode? FromLevelOrderArray(IReadOnlyList<int?> values)
    {
        if (values.Count == 0 || values[0] is null)
        {
            return null;
        }

        var root = new TreeNode { Val = values[0]!.Value };
        var queue = new Queue<TreeNode>();
        queue.Enqueue(root);

        var i = 1;
        while (queue.Count > 0 && i < values.Count)
        {
            var current = queue.Dequeue();

            if (i < values.Count && values[i] is { } leftVal)
            {
                current.Left = new TreeNode { Val = leftVal };
                queue.Enqueue(current.Left);
            }
            i++;

            if (i < values.Count && values[i] is { } rightVal)
            {
                current.Right = new TreeNode { Val = rightVal };
                queue.Enqueue(current.Right);
            }
            i++;
        }

        return root;
    }
}
