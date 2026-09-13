using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Delete Node in a BST via recursive search-and-splice. Comparing the target against the
/// current node's value navigates left or right, exactly like a BST lookup, until the node to
/// delete is found (or the search runs off the tree, meaning the key doesn't exist — per the
/// problem's own contract, that's a no-op, not an error). A leaf or single-child node is removed
/// by simply returning its (possibly null) child up to the parent. A node with two children can't
/// just be unlinked — instead its value is overwritten with its inorder successor's value (the
/// smallest value in its right subtree, which is guaranteed to have at most one child), and that
/// successor is then recursively deleted from the right subtree by its own value — turning a
/// two-child deletion into a same-shape, strictly simpler one.
/// </summary>
public sealed class DeleteNodeInBst : IAlgorithmVisualizer<DeleteNodeInBstInput>
{
    public string Id => "delete-node-in-a-bst";

    public IReadOnlyList<AlgorithmStep> Run(DeleteNodeInBstInput input)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;
        var key = input.Key;

        if (input.Root is null)
        {
            StepRecorder.Add(steps, ref stepNumber, "Tree is empty; there is nothing to delete.",
                new DeleteNodeInBstState([], null, key, null), [], spanLines: 2);
            return steps;
        }

        TreeNode? root = input.Root;
        var found = false;

        IReadOnlyList<int?> Snapshot() => TreeNode.ToLevelOrderArray(root);

        TreeNode? Delete(TreeNode? node, int target)
        {
            if (node is null)
            {
                return null;
            }

            if (target < node.Val)
            {
                StepRecorder.Add(steps, ref stepNumber,
                    $"{target} < {node.Val}: go left.",
                    new DeleteNodeInBstState(Snapshot(), node.Val, key, null), [node.Val.ToString()], spanLines: 2);
                node.Left = Delete(node.Left, target);
                return node;
            }

            if (target > node.Val)
            {
                StepRecorder.Add(steps, ref stepNumber,
                    $"{target} > {node.Val}: go right.",
                    new DeleteNodeInBstState(Snapshot(), node.Val, key, null), [node.Val.ToString()], spanLines: 2);
                node.Right = Delete(node.Right, target);
                return node;
            }

            found = true;

            if (node.Left is null || node.Right is null)
            {
                var replacement = node.Left ?? node.Right;
                StepRecorder.Add(steps, ref stepNumber,
                    replacement is null
                        ? $"Found {target}: it's a leaf — remove it."
                        : $"Found {target}: it has one child — replace it with {replacement.Val}.",
                    new DeleteNodeInBstState(Snapshot(), node.Val, key, null), [node.Val.ToString()], spanLines: 3);
                return replacement;
            }

            var successor = node.Right;
            while (successor.Left is not null)
            {
                successor = successor.Left;
            }

            StepRecorder.Add(steps, ref stepNumber,
                $"Found {target} with two children: its inorder successor is {successor.Val} (smallest value in the right subtree) — copy that value up, then delete {successor.Val} from the right subtree.",
                new DeleteNodeInBstState(Snapshot(), successor.Val, key, null), [node.Val.ToString(), successor.Val.ToString()], spanLines: 6);

            node.Val = successor.Val;
            node.Right = Delete(node.Right, successor.Val);
            return node;
        }

        root = Delete(root, key);

        StepRecorder.Add(steps, ref stepNumber,
            !found
                ? $"Done: no node with value {key} exists in this tree — nothing to delete."
                : root is null
                    ? $"Done: {key} was the only node — the tree is now empty."
                    : $"Done: {key} has been deleted.",
            new DeleteNodeInBstState(Snapshot(), null, key, root),
            [],
            spanLines: 1);

        return steps;
    }
}
