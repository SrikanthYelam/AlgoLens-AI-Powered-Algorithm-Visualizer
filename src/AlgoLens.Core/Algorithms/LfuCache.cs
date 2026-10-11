using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// LFU Cache via a hash map of nodes plus one intrusive doubly linked list per frequency, the
/// textbook O(1) get/put implementation — the same inline-the-real-mechanics choice
/// <see cref="LruCache"/> makes, just with frequency as a second axis on top of recency. Each
/// frequency's list is itself an LRU list (most-recently-used right after its own head), so when
/// two entries tie on frequency, the one at the back of the lowest-frequency list is always the
/// correct eviction victim. `minFreq` tracks the lowest frequency currently present: a "get" hit
/// (or a "put" to an existing key) always moves its node from frequency f's list to the front of
/// frequency f+1's list, and bumps `minFreq` only when that move just emptied the list `minFreq`
/// itself points at — the vacated frequency can only be succeeded by f+1, since frequencies never
/// jump by more than one. A fresh "put" always starts its node at frequency 1, which is always the
/// new `minFreq`. One step is recorded per top-level operation, the same granularity
/// <see cref="LruCache"/> and AccountsMerge use.
/// </summary>
public sealed class LfuCache : IAlgorithmVisualizer<LfuCacheInput>
{
    public string Id => "lfu-cache";

    private sealed class Node
    {
        public int Key;
        public int Value;
        public int Freq;
        public Node? Prev;
        public Node? Next;
    }

    private sealed class FreqList
    {
        public readonly Node Head = new();
        public readonly Node Tail = new();

        public FreqList()
        {
            Head.Next = Tail;
            Tail.Prev = Head;
        }

        public bool IsEmpty => Head.Next == Tail;
    }

    public IReadOnlyList<AlgorithmStep> Run(LfuCacheInput input)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (input.Operations.Count == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, $"No operations to run against a capacity-{input.Capacity} cache.",
                new LfuCacheState(input.Capacity, [], 0, "", 0, null, null, false, null), [], spanLines: 2);
            return steps;
        }

        var capacity = input.Capacity;
        var keyMap = new Dictionary<int, Node>();
        var freqLists = new Dictionary<int, FreqList>();
        var minFreq = 0;

        static void Remove(Node node)
        {
            node.Prev!.Next = node.Next;
            node.Next!.Prev = node.Prev;
        }

        static void AddFront(FreqList list, Node node)
        {
            node.Prev = list.Head;
            node.Next = list.Head.Next;
            list.Head.Next!.Prev = node;
            list.Head.Next = node;
        }

        FreqList GetFreqList(int freq)
        {
            if (!freqLists.TryGetValue(freq, out var list))
            {
                list = new FreqList();
                freqLists[freq] = list;
            }
            return list;
        }

        void Touch(Node node)
        {
            var oldList = freqLists[node.Freq];
            Remove(node);
            if (oldList.IsEmpty)
            {
                freqLists.Remove(node.Freq);
                if (minFreq == node.Freq)
                {
                    minFreq++;
                }
            }

            node.Freq++;
            AddFront(GetFreqList(node.Freq), node);
        }

        List<LfuCacheEntry> SnapshotOrder()
        {
            var entries = new List<LfuCacheEntry>();
            foreach (var freq in freqLists.Keys.OrderBy(f => f))
            {
                for (var node = freqLists[freq].Head.Next; node != freqLists[freq].Tail; node = node!.Next)
                {
                    entries.Add(new LfuCacheEntry(node!.Key, node.Value, node.Freq));
                }
            }
            return entries;
        }

        foreach (var op in input.Operations)
        {
            if (op.Op == "get")
            {
                if (keyMap.TryGetValue(op.Key, out var node))
                {
                    Touch(node);
                    var action = $"get({op.Key}) -> hit: {node.Value}. Frequency now {node.Freq}.";
                    StepRecorder.Add(steps, ref stepNumber, action,
                        new LfuCacheState(capacity, SnapshotOrder(), minFreq, "get", op.Key, null, node.Value, true, null),
                        [op.Key.ToString()], spanLines: 4);
                }
                else
                {
                    var action = $"get({op.Key}) -> miss: key not present.";
                    StepRecorder.Add(steps, ref stepNumber, action,
                        new LfuCacheState(capacity, SnapshotOrder(), minFreq, "get", op.Key, null, null, false, null),
                        [op.Key.ToString()], spanLines: 3);
                }
            }
            else
            {
                var value = op.Value!.Value;
                int? evicted = null;
                string action;

                if (capacity == 0)
                {
                    action = $"put({op.Key}, {value}) -> capacity is 0, the cache can never hold anything.";
                }
                else if (keyMap.TryGetValue(op.Key, out var existing))
                {
                    existing.Value = value;
                    Touch(existing);
                    action = $"put({op.Key}, {value}) -> key already present, updated. Frequency now {existing.Freq}.";
                }
                else
                {
                    if (keyMap.Count >= capacity)
                    {
                        var lfuList = freqLists[minFreq];
                        var victim = lfuList.Tail.Prev!;
                        evicted = victim.Key;
                        Remove(victim);
                        keyMap.Remove(victim.Key);
                        if (lfuList.IsEmpty)
                        {
                            freqLists.Remove(minFreq);
                        }
                    }

                    var node = new Node { Key = op.Key, Value = value, Freq = 1 };
                    AddFront(GetFreqList(1), node);
                    keyMap[op.Key] = node;
                    minFreq = 1;

                    action = evicted.HasValue
                        ? $"put({op.Key}, {value}) -> at capacity, evicted key {evicted} (lowest frequency, least-recently-used among ties)."
                        : $"put({op.Key}, {value}) -> inserted with frequency 1.";
                }

                StepRecorder.Add(steps, ref stepNumber, action,
                    new LfuCacheState(capacity, SnapshotOrder(), minFreq, "put", op.Key, value, null, false, evicted),
                    evicted.HasValue ? [op.Key.ToString(), evicted.Value.ToString()] : [op.Key.ToString()],
                    spanLines: 41);
            }
        }

        return steps;
    }
}
