using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class LargestRectangleInHistogramTests
{
    private readonly LargestRectangleInHistogram _algorithm = new();

    [Fact]
    public void Run_CanonicalExample_ProducesExpectedMaxArea()
    {
        var steps = _algorithm.Run([2, 1, 5, 6, 2, 3]);

        var finalState = (HistogramState)steps[^1].State;
        finalState.MaxArea.Should().Be(10);
    }

    [Fact]
    public void Run_EmptyHistogram_ReturnsSingleStepWithZeroArea()
    {
        var steps = _algorithm.Run([]);

        steps.Should().HaveCount(1);
        var finalState = (HistogramState)steps[^1].State;
        finalState.MaxArea.Should().Be(0);
    }

    [Fact]
    public void Run_SingleBar_AreaEqualsItsHeight()
    {
        var steps = _algorithm.Run([7]);

        var finalState = (HistogramState)steps[^1].State;
        finalState.MaxArea.Should().Be(7);
    }
}
