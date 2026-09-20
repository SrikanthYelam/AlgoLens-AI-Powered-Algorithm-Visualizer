using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class ContainerWithMostWaterTests
{
    private readonly ContainerWithMostWater _algorithm = new();

    [Fact]
    public void Run_CanonicalExample_FindsTheLargestContainer()
    {
        var steps = _algorithm.Run([1, 8, 6, 2, 5, 4, 8, 3, 7]);

        var finalState = (ContainerWithMostWaterState)steps[^1].State;
        finalState.MaxArea.Should().Be(49);
        finalState.BestLeft.Should().Be(1);
        finalState.BestRight.Should().Be(8);
    }

    [Fact]
    public void Run_TwoBars_UsesTheShorterHeightTimesTheWidth()
    {
        var steps = _algorithm.Run([1, 1]);

        ((ContainerWithMostWaterState)steps[^1].State).MaxArea.Should().Be(1);
    }

    [Fact]
    public void Run_EqualHeights_WidestContainerWins()
    {
        var steps = _algorithm.Run([5, 5, 5, 5]);

        var finalState = (ContainerWithMostWaterState)steps[^1].State;
        finalState.MaxArea.Should().Be(15);
        finalState.BestLeft.Should().Be(0);
        finalState.BestRight.Should().Be(3);
    }

    [Fact]
    public void Run_EvaluatesOneContainerPerPointerMove()
    {
        var steps = _algorithm.Run([1, 8, 6, 2, 5, 4, 8, 3, 7]);

        // n - 1 containers are evaluated before the pointers meet, plus the closing step.
        steps.Should().HaveCount(9);
    }

    [Fact]
    public void Run_SingleBar_HasNoContainer()
    {
        var steps = _algorithm.Run([4]);

        var finalState = (ContainerWithMostWaterState)steps[^1].State;
        finalState.MaxArea.Should().Be(0);
        finalState.BestLeft.Should().Be(-1);
    }

    [Fact]
    public void Run_EmptyInput_ReturnsSingleStep()
    {
        var steps = _algorithm.Run([]);

        steps.Should().HaveCount(1);
        ((ContainerWithMostWaterState)steps[^1].State).MaxArea.Should().Be(0);
    }
}
