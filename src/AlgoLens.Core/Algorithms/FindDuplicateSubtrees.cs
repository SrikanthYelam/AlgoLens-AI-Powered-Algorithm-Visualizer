using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Find Duplicate Subtrees via recursive post-order serialization: each node's subtree is
/// encoded as "val,leftSerialization,rightSerialization" (with "#" for null) — exactly a preorder
/// traversal with null markers, a well-known unambiguous encoding, so two subtrees produce the
/// same string if and only if they have identical structure and values. A
/// Dictionary&lt;string, int&gt; counts how many times each serialization has been seen; the
/// moment a serialization's count reaches exactly 2, that node is recorded as a duplicate (once
/// per distinct shape, not once per repeat, per the problem's "return one of each kind" rule).
/// </summary>
public sealed class FindDuplicateSubtrees : IAlgorithmVisualizer<TreeNode?>
{
    public string Id => "find-duplicate-subtrees";

    public IReadOnlyList<AlgorithmStep> Run(TreeNode? root)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;
        var treeArray = TreeNode.ToLevelOrderArray(root);

        if (root is null)
        {
            StepRecorder.Add(steps, ref stepNumber, "Tree is empty; there are no subtrees to compare.",
                new FindDuplicateSubtreesState([], null, "", [], []), [], spanLines: 2);
            return steps;
        }

        var counts = new Dictionary<string, int>();
        var duplicateArrays = new List<IReadOnlyList<int?>>();
        var duplicateRoots = new List<TreeNode>();

        string Serialize(TreeNode? node)
        {
            if (node is null)
            {
                return "#";
            }

            var left = Serialize(node.Left);
            var right = Serialize(node.Right);
            var key = $"{node.Val},{left},{right}";
            counts[key] = counts.GetValueOrDefault(key) + 1;

            string action;
            if (counts[key] == 2)
            {
                duplicateArrays.Add(TreeNode.ToLevelOrderArray(node));
                duplicateRoots.Add(node);
                action = $"Subtree rooted at {node.Val} has now been seen {counts[key]} times — it's a duplicate.";
            }
            else
            {
                action = $"Subtree rooted at {node.Val} serializes to \"{key}\" (seen {counts[key]} time(s) so far).";
            }

            StepRecorder.Add(steps, ref stepNumber, action,
                new FindDuplicateSubtreesState(treeArray, node.Val, key, duplicateArrays.ToList(), duplicateRoots.ToList()),
                [node.Val.ToString()],
                spanLines: 17);

            return key;
        }

        Serialize(root);

        return steps;
    }
}
