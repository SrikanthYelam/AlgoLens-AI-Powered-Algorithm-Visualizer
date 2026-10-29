using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class LongestIncreasingSubsequenceBinarySearchTests
{
    private readonly LongestIncreasingSubsequenceBinarySearch _algorithm = new();

    [Fact]
    public void Run_CanonicalExample_FindsLengthFour()
    {
        var steps = _algorithm.Run([10, 9, 2, 5, 3, 7, 101, 18]);

        var finalState = (LongestIncreasingSubsequenceBinarySearchState)steps[^1].State;
        finalState.Tails.Should().Equal(2, 3, 7, 18);
    }

    [Fact]
    public void Run_AllEqual_FindsLengthOne()
    {
        var steps = _algorithm.Run([7, 7, 7, 7, 7, 7, 7]);

        var finalState = (LongestIncreasingSubsequenceBinarySearchState)steps[^1].State;
        finalState.Tails.Should().Equal(7);
    }

    [Fact]
    public void Run_StrictlyIncreasing_FindsWholeArray()
    {
        var steps = _algorithm.Run([1, 2, 3, 4, 5]);

        var finalState = (LongestIncreasingSubsequenceBinarySearchState)steps[^1].State;
        finalState.Tails.Should().Equal(1, 2, 3, 4, 5);
    }

    [Fact]
    public void Run_Decreasing_KeepsReplacingTheOnlyTail()
    {
        var steps = _algorithm.Run([5, 4, 3, 2, 1]);

        var finalState = (LongestIncreasingSubsequenceBinarySearchState)steps[^1].State;
        finalState.Tails.Should().Equal(1);
    }

    [Fact]
    public void Run_MatchesTheTwoDimensionalDpOnEveryInput()
    {
        int[][] inputs = [[0, 1, 0, 3, 2, 3], [4, 10, 4, 3, 8, 9], [3, 5, 6, 2, 5, 4, 19, 5, 6, 7, 12]];

        foreach (var input in inputs)
        {
            var dpTable = ((LongestIncreasingSubsequenceState)new LongestIncreasingSubsequence().Run(input)[^1].State).Table;
            var tails = ((LongestIncreasingSubsequenceBinarySearchState)_algorithm.Run(input)[^1].State).Tails;

            tails.Count.Should().Be(dpTable[0][0]);
        }
    }

    [Fact]
    public void Run_EmptyInput_ReturnsSingleStepWithNoTails()
    {
        var steps = _algorithm.Run([]);

        steps.Should().HaveCount(1);
        var finalState = (LongestIncreasingSubsequenceBinarySearchState)steps[^1].State;
        finalState.Tails.Should().BeEmpty();
    }
}
