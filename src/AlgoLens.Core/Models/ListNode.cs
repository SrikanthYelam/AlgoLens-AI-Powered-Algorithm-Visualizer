namespace AlgoLens.Core.Models;

public sealed class ListNode
{
    public required int Val { get; init; }
    public ListNode? Next { get; set; }

    /// <summary>Builds a singly linked list from an ordered array of values.</summary>
    public static ListNode? FromArray(IReadOnlyList<int> values)
    {
        ListNode? head = null;
        ListNode? tail = null;

        foreach (var value in values)
        {
            var node = new ListNode { Val = value };
            if (head is null)
            {
                head = node;
            }
            else
            {
                tail!.Next = node;
            }
            tail = node;
        }

        return head;
    }

    /// <summary>Reads a linked list back out into an array, following `Next` until null.</summary>
    public static IReadOnlyList<int> ToArray(ListNode? head)
    {
        var result = new List<int>();
        var node = head;
        while (node is not null)
        {
            result.Add(node.Val);
            node = node.Next;
        }

        return result;
    }
}
