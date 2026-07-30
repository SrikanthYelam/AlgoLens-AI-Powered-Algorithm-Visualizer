using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class PermutationsTests
{
    private readonly Permutations _algorithm = new();

    [Fact]
    public void Run_ThreeDistinctValues_ProducesAllSixPermutations()
    {
        var steps = _algorithm.Run([1, 2, 3]);

        var finalState = (BacktrackingState)steps[^1].State;
        finalState.Solutions.Should().HaveCount(6);
        finalState.Solutions.Should().BeEquivalentTo(new IReadOnlyList<int>[]
        {
            [1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1],
        });
    }

    [Fact]
    public void Run_EmptyArray_ReturnsSingleStepWithNoSolutions()
    {
        var steps = _algorithm.Run([]);

        steps.Should().HaveCount(1);
        var finalState = (BacktrackingState)steps[^1].State;
        finalState.Solutions.Should().BeEmpty();
    }
}
