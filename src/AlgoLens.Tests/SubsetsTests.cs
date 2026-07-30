using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class SubsetsTests
{
    private readonly Subsets _algorithm = new();

    [Fact]
    public void Run_ThreeElements_ProducesAllEightSubsets()
    {
        var steps = _algorithm.Run([1, 2, 3]);

        var finalState = (BacktrackingState)steps[^1].State;
        finalState.Solutions.Should().BeEquivalentTo(new IReadOnlyList<int>[]
        {
            [], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3],
        });
    }

    [Fact]
    public void Run_EmptyArray_ProducesOnlyTheEmptySubset()
    {
        var steps = _algorithm.Run([]);

        var finalState = (BacktrackingState)steps[^1].State;
        finalState.Solutions.Should().HaveCount(1);
        finalState.Solutions[0].Should().BeEmpty();
    }
}
