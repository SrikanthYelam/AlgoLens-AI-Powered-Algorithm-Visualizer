using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class LongestSubarrayAbsDiffLimitTests
{
    private readonly LongestSubarrayAbsDiffLimit _algorithm = new();

    [Fact]
    public void Run_CanonicalExample_FindsLengthTwoWindow()
    {
        var input = new LongestSubarrayAbsDiffLimitInput([8, 2, 4, 7], Limit: 4);

        var steps = _algorithm.Run(input);

        var finalState = (LongestSubarrayAbsDiffLimitState)steps[^1].State;
        finalState.BestLength.Should().Be(2);
    }

    [Fact]
    public void Run_SecondExample_FindsLengthFourWindow()
    {
        var input = new LongestSubarrayAbsDiffLimitInput([10, 1, 2, 4, 7, 2], Limit: 5);

        var steps = _algorithm.Run(input);

        var finalState = (LongestSubarrayAbsDiffLimitState)steps[^1].State;
        finalState.BestLength.Should().Be(4);
        finalState.BestStart.Should().Be(2);
    }

    [Fact]
    public void Run_ZeroLimit_OnlyMatchesEqualRuns()
    {
        var input = new LongestSubarrayAbsDiffLimitInput([4, 2, 2, 2, 4, 4, 2, 2], Limit: 0);

        var steps = _algorithm.Run(input);

        var finalState = (LongestSubarrayAbsDiffLimitState)steps[^1].State;
        finalState.BestLength.Should().Be(3);
    }

    [Fact]
    public void Run_EmptyArray_ReturnsSingleStepWithZeroLength()
    {
        var input = new LongestSubarrayAbsDiffLimitInput([], Limit: 4);

        var steps = _algorithm.Run(input);

        steps.Should().HaveCount(1);
        var finalState = (LongestSubarrayAbsDiffLimitState)steps[^1].State;
        finalState.BestLength.Should().Be(0);
    }
}
