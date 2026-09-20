using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class NumberOfIslandsIITests
{
    private readonly NumberOfIslandsII _algorithm = new();

    [Fact]
    public void Run_CanonicalExample_ReportsCountAfterEachAddition()
    {
        var steps = _algorithm.Run(new NumberOfIslandsIIInput(3, 3, [[0, 0], [0, 1], [1, 2], [2, 1]]));

        var finalState = (NumberOfIslandsIIState)steps[^1].State;
        finalState.Counts.Should().BeEquivalentTo(new[] { 1, 1, 2, 3 }, options => options.WithStrictOrdering());
    }

    [Fact]
    public void Run_LandThatBridgesTwoIslands_MergesThemBackIntoOne()
    {
        var steps = _algorithm.Run(new NumberOfIslandsIIInput(3, 3, [[0, 0], [0, 1], [1, 2], [1, 1]]));

        var finalState = (NumberOfIslandsIIState)steps[^1].State;
        finalState.Counts.Should().BeEquivalentTo(new[] { 1, 1, 2, 1 }, options => options.WithStrictOrdering());
    }

    [Fact]
    public void Run_RepeatedPosition_LeavesTheCountUnchanged()
    {
        var steps = _algorithm.Run(new NumberOfIslandsIIInput(1, 2, [[0, 0], [0, 0], [0, 1]]));

        var finalState = (NumberOfIslandsIIState)steps[^1].State;
        finalState.Counts.Should().BeEquivalentTo(new[] { 1, 1, 1 }, options => options.WithStrictOrdering());
    }

    [Fact]
    public void Run_SingleCellGrid_ReturnsOneIsland()
    {
        var steps = _algorithm.Run(new NumberOfIslandsIIInput(1, 1, [[0, 0]]));

        var finalState = (NumberOfIslandsIIState)steps[^1].State;
        finalState.Counts.Should().BeEquivalentTo(new[] { 1 });
    }

    [Fact]
    public void Run_NoPositions_ReturnsSingleStepWithNoCounts()
    {
        var steps = _algorithm.Run(new NumberOfIslandsIIInput(3, 3, []));

        steps.Should().HaveCount(1);
        var finalState = (NumberOfIslandsIIState)steps[^1].State;
        finalState.Counts.Should().BeEmpty();
    }
}
