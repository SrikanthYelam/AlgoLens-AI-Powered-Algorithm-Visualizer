using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// LRU Cache via a hash map of nodes plus an intrusive doubly linked list — the textbook O(1)
/// get/put implementation this problem is built around, not a List-shuffle or a LinkedHashMap
/// shortcut, the same "spell out the real mechanics inline" choice the Union-Find entries make.
/// head/tail are dummy sentinels, so every real node always has a non-null Prev/Next and
/// Remove/AddToFront never need a null check for "node is the first/last real node". The list runs
/// most-recently-used (right after head) to least-recently-used (right before tail): a hit or an
/// insert/update always unlinks its node and re-links it right after head, and an eviction always
/// removes the node right before tail. One step is recorded per top-level operation, not per pointer
/// swap — the same granularity AccountsMerge uses for its per-account unions.
/// </summary>
public sealed class LruCache : IAlgorithmVisualizer<LruCacheInput>
{
    public string Id => "lru-cache";

    private sealed class Node
    {
        public int Key;
        public int Value;
        public Node? Prev;
        public Node? Next;
    }

    public IReadOnlyList<AlgorithmStep> Run(LruCacheInput input)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (input.Operations.Count == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, $"No operations to run against a capacity-{input.Capacity} cache.",
                new LruCacheState(input.Capacity, [], "", 0, null, null, false, null), [], spanLines: 2);
            return steps;
        }

        var capacity = input.Capacity;
        var map = new Dictionary<int, Node>();
        var head = new Node();
        var tail = new Node();
        head.Next = tail;
        tail.Prev = head;

        void Remove(Node node)
        {
            node.Prev!.Next = node.Next;
            node.Next!.Prev = node.Prev;
        }

        void AddToFront(Node node)
        {
            node.Prev = head;
            node.Next = head.Next;
            head.Next!.Prev = node;
            head.Next = node;
        }

        List<LruCacheEntry> SnapshotOrder()
        {
            var entries = new List<LruCacheEntry>();
            for (var node = head.Next; node != tail; node = node!.Next)
            {
                entries.Add(new LruCacheEntry(node!.Key, node.Value));
            }
            return entries;
        }

        foreach (var op in input.Operations)
        {
            if (op.Op == "get")
            {
                if (map.TryGetValue(op.Key, out var node))
                {
                    Remove(node);
                    AddToFront(node);
                    var action = $"get({op.Key}) -> hit: {node.Value}. Moved to most-recently-used.";
                    StepRecorder.Add(steps, ref stepNumber, action,
                        new LruCacheState(capacity, SnapshotOrder(), "get", op.Key, null, node.Value, true, null),
                        [op.Key.ToString()], spanLines: 5);
                }
                else
                {
                    var action = $"get({op.Key}) -> miss: key not present.";
                    StepRecorder.Add(steps, ref stepNumber, action,
                        new LruCacheState(capacity, SnapshotOrder(), "get", op.Key, null, null, false, null),
                        [op.Key.ToString()], spanLines: 3);
                }
            }
            else
            {
                var value = op.Value!.Value;
                int? evicted = null;

                if (map.TryGetValue(op.Key, out var existing))
                {
                    existing.Value = value;
                    Remove(existing);
                    AddToFront(existing);
                }
                else
                {
                    if (map.Count >= capacity)
                    {
                        var lru = tail.Prev!;
                        evicted = lru.Key;
                        Remove(lru);
                        map.Remove(lru.Key);
                    }

                    var node = new Node { Key = op.Key, Value = value };
                    AddToFront(node);
                    map[op.Key] = node;
                }

                var action = evicted.HasValue
                    ? $"put({op.Key}, {value}) -> at capacity, evicted least-recently-used key {evicted}."
                    : $"put({op.Key}, {value}) -> inserted/updated as most-recently-used.";
                StepRecorder.Add(steps, ref stepNumber, action,
                    new LruCacheState(capacity, SnapshotOrder(), "put", op.Key, value, null, false, evicted),
                    evicted.HasValue ? [op.Key.ToString(), evicted.Value.ToString()] : [op.Key.ToString()],
                    spanLines: 29);
            }
        }

        return steps;
    }
}
