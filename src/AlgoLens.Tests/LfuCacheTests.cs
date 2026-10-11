using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class LfuCacheTests
{
    private readonly LfuCache _algorithm = new();

    private static IReadOnlyList<int?> GetResults(IReadOnlyList<AlgorithmStep> steps) =>
        steps
            .Select(s => (LfuCacheState)s.State)
            .Where(s => s.Operation == "get")
            .Select(s => s.Result)
            .ToList();

    [Fact]
    public void Run_CanonicalLeetCodeExample_ProducesExpectedGetResults()
    {
        // LeetCode 460's own example: capacity 2.
        var operations = new List<LfuCacheOperation>
        {
            new("put", 1, 1),
            new("put", 2, 2),
            new("get", 1, null),   // 1, freq(1)=2
            new("put", 3, 3),      // evicts 2 (tied freq 1, but 2 is LRU)
            new("get", 2, null),   // miss
            new("get", 3, null),   // 3, freq(3)=2
            new("put", 4, 4),      // evicts 1 (tied freq 2 with 3, but 1 is LRU)
            new("get", 1, null),   // miss
            new("get", 3, null),   // 3
            new("get", 4, null),   // 4
        };

        var steps = _algorithm.Run(new LfuCacheInput(2, operations));

        GetResults(steps).Should().Equal(1, null, 3, null, 3, 4);
    }

    [Fact]
    public void Run_TieBrokenByFrequencyNotJustRecency_EvictsLessFrequentKey()
    {
        // capacity 2: put(1,1), put(2,2), get(1) x2 (freq(1)=3), put(3,3) must evict 2
        // (freq 1) even though 1 was touched more recently — frequency wins over recency.
        var operations = new List<LfuCacheOperation>
        {
            new("put", 1, 1),
            new("put", 2, 2),
            new("get", 1, null),
            new("get", 1, null),
            new("put", 3, 3),
            new("get", 2, null),
            new("get", 3, null),
        };

        var steps = _algorithm.Run(new LfuCacheInput(2, operations));

        GetResults(steps).Should().Equal(1, 1, null, 3);
    }

    [Fact]
    public void Run_PutOnExistingKey_UpdatesValueAndBumpsFrequency()
    {
        var operations = new List<LfuCacheOperation>
        {
            new("put", 1, 1),
            new("put", 1, 10),
            new("get", 1, null),
        };

        var steps = _algorithm.Run(new LfuCacheInput(2, operations));

        GetResults(steps).Should().Equal(10);
    }

    [Fact]
    public void Run_CapacityZero_EveryPutIsNoOpAndEveryGetMisses()
    {
        var operations = new List<LfuCacheOperation>
        {
            new("put", 1, 1),
            new("get", 1, null),
        };

        var steps = _algorithm.Run(new LfuCacheInput(0, operations));

        GetResults(steps).Should().Equal((int?)null);
    }

    [Fact]
    public void Run_NoOperations_ReturnsSingleExplanatoryStep()
    {
        var steps = _algorithm.Run(new LfuCacheInput(2, []));

        steps.Should().HaveCount(1);
        GetResults(steps).Should().BeEmpty();
    }
}
