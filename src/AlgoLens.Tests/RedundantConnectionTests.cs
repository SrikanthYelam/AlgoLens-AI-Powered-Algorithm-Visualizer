using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class RedundantConnectionTests
{
    private readonly RedundantConnection _algorithm = new();

    [Fact]
    public void Run_CanonicalExample_FindsTheRedundantEdge()
    {
        int[][] edges = [[1, 2], [1, 3], [2, 3]];

        var steps = _algorithm.Run(edges);

        var finalState = (RedundantConnectionState)steps[^1].State;
        finalState.Answer.Should().BeEquivalentTo(new[] { 2, 3 }, options => options.WithStrictOrdering());
    }

    [Fact]
    public void Run_SecondExample_FindsTheLastRedundantEdge()
    {
        int[][] edges = [[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]];

        var steps = _algorithm.Run(edges);

        var finalState = (RedundantConnectionState)steps[^1].State;
        finalState.Answer.Should().BeEquivalentTo(new[] { 1, 4 }, options => options.WithStrictOrdering());
    }

    [Fact]
    public void Run_EmptyInput_ReturnsSingleStepWithNoAnswer()
    {
        var steps = _algorithm.Run([]);

        steps.Should().HaveCount(1);
        var finalState = (RedundantConnectionState)steps[^1].State;
        finalState.Answer.Should().BeNull();
    }
}
