namespace AlgoLens.Core.Models;

public sealed class TreeNode
{
    // `set`, not `init`: Recover Binary Search Tree fixes a corrupted BST by swapping two
    // nodes' values in place, so this needs to stay mutable after construction.
    public required int Val { get; set; }
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

    /// <summary>
    /// Converts a tree back into a LeetCode-style level-order array (trailing nulls trimmed,
    /// mirroring the canonical form <see cref="FromLevelOrderArray"/> accepts as input) — used
    /// by every tree algorithm's step state so the frontend can render the actual tree shape.
    /// </summary>
    public static IReadOnlyList<int?> ToLevelOrderArray(TreeNode? root)
    {
        if (root is null)
        {
            return [];
        }

        var result = new List<int?>();
        var queue = new Queue<TreeNode?>();
        queue.Enqueue(root);

        while (queue.Count > 0)
        {
            var node = queue.Dequeue();
            result.Add(node?.Val);

            if (node is not null)
            {
                queue.Enqueue(node.Left);
                queue.Enqueue(node.Right);
            }
        }

        while (result.Count > 0 && result[^1] is null)
        {
            result.RemoveAt(result.Count - 1);
        }

        return result;
    }
}
