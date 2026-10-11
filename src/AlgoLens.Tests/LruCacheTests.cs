using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class LruCacheTests
{
    private readonly LruCache _algorithm = new();

    private static IReadOnlyList<int?> GetResults(IReadOnlyList<AlgorithmStep> steps) =>
        steps
            .Select(s => (LruCacheState)s.State)
            .Where(s => s.Operation == "get")
            .Select(s => s.Result)
            .ToList();

    [Fact]
    public void Run_CanonicalLeetCodeExample_ProducesExpectedGetResults()
    {
        // LeetCode 146's own example: capacity 2.
        var operations = new List<LruCacheOperation>
        {
            new("put", 1, 1),
            new("put", 2, 2),
            new("get", 1, null),   // 1
            new("put", 3, 3),      // evicts key 2
            new("get", 2, null),   // miss
            new("put", 4, 4),      // evicts key 1
            new("get", 1, null),   // miss
            new("get", 3, null),   // 3
            new("get", 4, null),   // 4
        };

        var steps = _algorithm.Run(new LruCacheInput(2, operations));

        GetResults(steps).Should().Equal(1, null, null, 3, 4);
    }

    [Fact]
    public void Run_PutOnExistingKey_UpdatesValueAndRefreshesRecency()
    {
        // capacity 2: put(1,1), put(2,2), put(1,10) refreshes 1 -> evict order becomes 2 first,
        // so put(3,3) evicts key 2, leaving 1 (updated) and 3.
        var operations = new List<LruCacheOperation>
        {
            new("put", 1, 1),
            new("put", 2, 2),
            new("put", 1, 10),
            new("put", 3, 3),
            new("get", 1, null),
            new("get", 2, null),
            new("get", 3, null),
        };

        var steps = _algorithm.Run(new LruCacheInput(2, operations));

        GetResults(steps).Should().Equal(10, null, 3);
    }

    [Fact]
    public void Run_CapacityOne_EveryPutEvictsThePrevious()
    {
        var operations = new List<LruCacheOperation>
        {
            new("put", 1, 1),
            new("put", 2, 2),
            new("get", 1, null),
            new("get", 2, null),
        };

        var steps = _algorithm.Run(new LruCacheInput(1, operations));

        GetResults(steps).Should().Equal(null, 2);
    }

    [Fact]
    public void Run_NoOperations_ReturnsSingleExplanatoryStep()
    {
        var steps = _algorithm.Run(new LruCacheInput(2, []));

        steps.Should().HaveCount(1);
        GetResults(steps).Should().BeEmpty();
    }
}
