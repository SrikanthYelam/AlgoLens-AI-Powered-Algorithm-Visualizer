using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class TrappingRainWaterTests
{
    private readonly TrappingRainWater _algorithm = new();

    [Fact]
    public void Run_CanonicalExample_TrapsSixUnits()
    {
        var steps = _algorithm.Run([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]);

        var finalState = (TrappingRainWaterState)steps[^1].State;
        finalState.Total.Should().Be(6);
        finalState.Water.Should().BeEquivalentTo(
            new[] { 0, 0, 1, 0, 1, 2, 1, 0, 0, 1, 0, 0 },
            options => options.WithStrictOrdering());
    }

    [Fact]
    public void Run_SecondExample_TrapsNineUnits()
    {
        var steps = _algorithm.Run([4, 2, 0, 3, 2, 5]);

        ((TrappingRainWaterState)steps[^1].State).Total.Should().Be(9);
    }

    [Fact]
    public void Run_SingleValley_TrapsTheDifferenceToTheLowerWall()
    {
        var steps = _algorithm.Run([3, 0, 3]);

        var finalState = (TrappingRainWaterState)steps[^1].State;
        finalState.Total.Should().Be(3);
        finalState.Water.Should().BeEquivalentTo(new[] { 0, 3, 0 }, options => options.WithStrictOrdering());
    }

    [Fact]
    public void Run_StrictlyIncreasingBars_TrapNothing()
    {
        var steps = _algorithm.Run([1, 2, 3, 4]);

        ((TrappingRainWaterState)steps[^1].State).Total.Should().Be(0);
    }

    [Fact]
    public void Run_EmptyInput_ReturnsSingleStep()
    {
        var steps = _algorithm.Run([]);

        steps.Should().HaveCount(1);
        ((TrappingRainWaterState)steps[^1].State).Total.Should().Be(0);
    }
}
