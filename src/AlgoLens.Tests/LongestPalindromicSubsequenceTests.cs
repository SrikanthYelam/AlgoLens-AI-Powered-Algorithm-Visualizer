using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class LongestPalindromicSubsequenceTests
{
    private readonly LongestPalindromicSubsequence _algorithm = new();

    [Fact]
    public void Run_Bbbab_FindsLengthFour()
    {
        var steps = _algorithm.Run("bbbab");

        var finalState = (LongestPalindromicSubsequenceState)steps[^1].State;
        finalState.Table[0][^1].Should().Be(4);
    }

    [Fact]
    public void Run_Cbbd_FindsLengthTwo()
    {
        var steps = _algorithm.Run("cbbd");

        var finalState = (LongestPalindromicSubsequenceState)steps[^1].State;
        finalState.Table[0][^1].Should().Be(2);
    }

    [Fact]
    public void Run_SingleCharacter_FindsLengthOne()
    {
        var steps = _algorithm.Run("a");

        var finalState = (LongestPalindromicSubsequenceState)steps[^1].State;
        finalState.Table[0][^1].Should().Be(1);
    }

    [Fact]
    public void Run_EmptyInput_ReturnsSingleStepWithEmptyTable()
    {
        var steps = _algorithm.Run("");

        steps.Should().HaveCount(1);
        var finalState = (LongestPalindromicSubsequenceState)steps[^1].State;
        finalState.Table.Should().BeEmpty();
    }
}
