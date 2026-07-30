using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class CombinationsTests
{
    private readonly Combinations _algorithm = new();

    [Fact]
    public void Run_NEqualsFourKEqualsTwo_ProducesAllSixCombinations()
    {
        var steps = _algorithm.Run(new CombinationsInput(N: 4, K: 2));

        var finalState = (BacktrackingState)steps[^1].State;
        finalState.Solutions.Should().BeEquivalentTo(new IReadOnlyList<int>[]
        {
            [1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4],
        });
    }

    [Fact]
    public void Run_KGreaterThanN_ReturnsSingleStepWithNoSolutions()
    {
        var steps = _algorithm.Run(new CombinationsInput(N: 2, K: 3));

        steps.Should().HaveCount(1);
        var finalState = (BacktrackingState)steps[^1].State;
        finalState.Solutions.Should().BeEmpty();
    }
}
