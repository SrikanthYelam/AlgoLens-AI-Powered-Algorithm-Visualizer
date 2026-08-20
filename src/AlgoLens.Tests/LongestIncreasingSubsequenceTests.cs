using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class LongestIncreasingSubsequenceTests
{
    private readonly LongestIncreasingSubsequence _algorithm = new();

    [Fact]
    public void Run_CanonicalExample_FindsLengthFour()
    {
        var steps = _algorithm.Run([10, 9, 2, 5, 3, 7, 101, 18]);

        var finalState = (LongestIncreasingSubsequenceState)steps[^1].State;
        finalState.Table[0][0].Should().Be(4);
    }

    [Fact]
    public void Run_AllEqual_FindsLengthOne()
    {
        var steps = _algorithm.Run([7, 7, 7, 7, 7, 7, 7]);

        var finalState = (LongestIncreasingSubsequenceState)steps[^1].State;
        finalState.Table[0][0].Should().Be(1);
    }

    [Fact]
    public void Run_StrictlyIncreasing_FindsWholeArray()
    {
        var steps = _algorithm.Run([1, 2, 3, 4, 5]);

        var finalState = (LongestIncreasingSubsequenceState)steps[^1].State;
        finalState.Table[0][0].Should().Be(5);
    }

    [Fact]
    public void Run_EmptyInput_ReturnsSingleStepWithEmptyTable()
    {
        var steps = _algorithm.Run([]);

        steps.Should().HaveCount(1);
        var finalState = (LongestIncreasingSubsequenceState)steps[^1].State;
        finalState.Table.Should().BeEmpty();
    }
}
