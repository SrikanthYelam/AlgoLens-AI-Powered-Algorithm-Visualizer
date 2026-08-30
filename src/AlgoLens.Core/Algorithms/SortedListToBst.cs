using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Convert Sorted List to Binary Search Tree via the classic slow/fast pointer technique: for
/// each segment of the list still to be converted, walk two pointers — slow one step at a
/// time, fast two — until fast runs off the end; slow then sits exactly on the segment's
/// middle element, which becomes this subtree's root. Severing the list right before slow
/// (via a trailing `prev` pointer) splits it into two independent segments, one for each
/// child, without needing to know the segment's length up front or copy it into an array.
/// Because slow always lands on the *second* of the two middle elements when a segment has an
/// even length, the resulting tree is height-balanced but not the only valid one LeetCode
/// accepts — a correct solution using the other middle can produce a differently-shaped,
/// equally valid tree.
/// </summary>
public sealed class SortedListToBst : IAlgorithmVisualizer<IReadOnlyList<int>>
{
    public string Id => "sorted-list-to-bst";

    public IReadOnlyList<AlgorithmStep> Run(IReadOnlyList<int> values)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (values.Count == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "Empty list; the tree is empty.",
                new SortedListToBstState([], -1, [], null), [], spanLines: 2);
            return steps;
        }

        var head = ListNode.FromArray(values);
        TreeNode? root = null;

        TreeNode? Build(ListNode? segmentHead)
        {
            if (segmentHead is null)
            {
                return null;
            }

            var segment = ListNode.ToArray(segmentHead);

            if (segmentHead.Next is null)
            {
                var leaf = new TreeNode { Val = segmentHead.Val };
                root ??= leaf;
                StepRecorder.Add(steps, ref stepNumber,
                    $"Segment [{segmentHead.Val}] has one element — it's a leaf: {segmentHead.Val}.",
                    new SortedListToBstState(segment, 0, TreeNode.ToLevelOrderArray(root), null),
                    [segmentHead.Val.ToString()],
                    spanLines: 4);
                return leaf;
            }

            ListNode? prev = null;
            var slow = segmentHead;
            var fast = segmentHead;
            while (fast is not null && fast.Next is not null)
            {
                prev = slow;
                slow = slow.Next!;
                fast = fast.Next.Next;
            }

            var middleIndex = segment.Count / 2;
            var node = new TreeNode { Val = slow.Val };
            root ??= node;

            StepRecorder.Add(steps, ref stepNumber,
                $"Segment [{string.Join(", ", segment)}]: slow and fast pointers land on {slow.Val} — it becomes this subtree's root, splitting the rest into a left and right half.",
                new SortedListToBstState(segment, middleIndex, TreeNode.ToLevelOrderArray(root), null),
                [slow.Val.ToString()],
                spanLines: 14);

            var rightHead = slow.Next;
            prev!.Next = null;

            node.Left = Build(segmentHead);
            node.Right = Build(rightHead);

            return node;
        }

        Build(head);

        StepRecorder.Add(steps, ref stepNumber,
            "Done: the sorted list has been converted into a height-balanced BST.",
            new SortedListToBstState([], -1, TreeNode.ToLevelOrderArray(root), root),
            [],
            spanLines: 1);

        return steps;
    }
}
