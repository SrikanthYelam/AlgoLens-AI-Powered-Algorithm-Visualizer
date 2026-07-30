using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class SlidingWindowMaximumTests
{
    private readonly SlidingWindowMaximum _algorithm = new();

    [Fact]
    public void Run_CanonicalExample_ProducesExpectedMaxima()
    {
        var input = new SlidingWindowInput([1, 3, -1, -3, 5, 3, 6, 7], WindowSize: 3);

        var steps = _algorithm.Run(input);

        var finalState = (SlidingWindowState)steps[^1].State;
        finalState.Result.Should().BeEquivalentTo(new[] { 3, 3, 5, 5, 6, 7 }, options => options.WithStrictOrdering());
    }

    [Fact]
    public void Run_EmptyArray_ReturnsSingleStepWithNoResult()
    {
        var input = new SlidingWindowInput([], WindowSize: 3);

        var steps = _algorithm.Run(input);

        steps.Should().HaveCount(1);
        var finalState = (SlidingWindowState)steps[^1].State;
        finalState.Result.Should().BeEmpty();
    }

    [Fact]
    public void Run_WindowSizeEqualsArrayLength_ProducesSingleMax()
    {
        var input = new SlidingWindowInput([4, 2, 9, 1], WindowSize: 4);

        var steps = _algorithm.Run(input);

        var finalState = (SlidingWindowState)steps[^1].State;
        finalState.Result.Should().BeEquivalentTo(new[] { 9 });
    }
}
