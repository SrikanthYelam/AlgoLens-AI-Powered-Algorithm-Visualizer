using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class LongestPalindromicSubsequenceSpaceOptimizedTests
{
    private readonly LongestPalindromicSubsequenceSpaceOptimized _algorithm = new();

    [Fact]
    public void Run_Bbbab_FindsLengthFour()
    {
        var steps = _algorithm.Run("bbbab");

        var finalState = (LongestPalindromicSubsequenceSpaceOptimizedState)steps[^1].State;
        finalState.Dp[^1].Should().Be(4);
    }

    [Fact]
    public void Run_Cbbd_FindsLengthTwo()
    {
        var steps = _algorithm.Run("cbbd");

        var finalState = (LongestPalindromicSubsequenceSpaceOptimizedState)steps[^1].State;
        finalState.Dp[^1].Should().Be(2);
    }

    [Fact]
    public void Run_SingleCharacter_FindsLengthOne()
    {
        var steps = _algorithm.Run("a");

        var finalState = (LongestPalindromicSubsequenceSpaceOptimizedState)steps[^1].State;
        finalState.Dp[^1].Should().Be(1);
    }

    [Fact]
    public void Run_MatchesTheTwoDimensionalDpOnEveryInput()
    {
        foreach (var input in new[] { "agbdba", "abcdef", "aaaa", "character", "racecar", "abacabadabacaba" })
        {
            var table = ((LongestPalindromicSubsequenceState)new LongestPalindromicSubsequence().Run(input)[^1].State).Table;
            var dp = ((LongestPalindromicSubsequenceSpaceOptimizedState)_algorithm.Run(input)[^1].State).Dp;

            dp[^1].Should().Be(table[0][^1], because: input);
        }
    }

    [Fact]
    public void Run_RollingRow_NeverMissesTheCarriedDiagonal()
    {
        // "bbbab": at i = 2 (s[2] = 'b'), j = 4 ('b'): needs old dp[3] = 1 (the 2D dp[3][3]), not the freshly written one.
        var steps = _algorithm.Run("bbbab");

        var step = steps.Select(x => (LongestPalindromicSubsequenceSpaceOptimizedState)x.State).Single(x => x is { I: 2, J: 4 });
        step.Prev.Should().Be(1);
        step.Dp[4].Should().Be(3);
    }

    [Fact]
    public void Run_EmptyInput_ReturnsSingleStepWithEmptyRow()
    {
        var steps = _algorithm.Run("");

        steps.Should().HaveCount(1);
        var finalState = (LongestPalindromicSubsequenceSpaceOptimizedState)steps[^1].State;
        finalState.Dp.Should().BeEmpty();
    }
}
