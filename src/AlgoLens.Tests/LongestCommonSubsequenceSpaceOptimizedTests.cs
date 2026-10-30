using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class LongestCommonSubsequenceSpaceOptimizedTests
{
    private readonly LongestCommonSubsequenceSpaceOptimized _algorithm = new();

    private int LcsLength(string text1, string text2) =>
        ((LongestCommonSubsequenceSpaceOptimizedState)_algorithm.Run(new LongestCommonSubsequenceInput(text1, text2))[^1].State).Dp[^1];

    [Fact]
    public void Run_AbcdeAce_FindsLengthThree() => LcsLength("abcde", "ace").Should().Be(3);

    [Fact]
    public void Run_IdenticalStrings_FindsFullLength() => LcsLength("abc", "abc").Should().Be(3);

    [Fact]
    public void Run_NothingInCommon_FindsLengthZero() => LcsLength("abc", "def").Should().Be(0);

    [Fact]
    public void Run_MatchesTheTwoDimensionalDpOnEveryInput()
    {
        (string, string)[] inputs = [("AGGTAB", "GXTXAYB"), ("abcbdab", "bdcaba"), ("aaaa", "aa"), ("ab", "ba"), ("physics", "smartphone")];

        foreach (var (text1, text2) in inputs)
        {
            var table = ((LongestCommonSubsequenceState)new LongestCommonSubsequence()
                .Run(new LongestCommonSubsequenceInput(text1, text2))[^1].State).Table;

            LcsLength(text1, text2).Should().Be(table[^1][^1], because: $"{text1} vs {text2}");
        }
    }

    [Fact]
    public void Run_RollingRow_NeverMissesTheCarriedDiagonal()
    {
        // "abab" vs "ab": at i = 2 ('b'), j = 2 ('b') the match must build on the old dp[1] = 1 (2D dp[1][1], "a" vs "a").
        var steps = _algorithm.Run(new LongestCommonSubsequenceInput("abab", "ab"));

        var step = steps.Select(x => (LongestCommonSubsequenceSpaceOptimizedState)x.State).Single(x => x is { I: 2, J: 2 });
        step.Prev.Should().Be(1);
        step.Dp[2].Should().Be(2);
    }

    [Fact]
    public void Run_EmptyInput_ReturnsSingleStepWithEmptyRow()
    {
        var steps = _algorithm.Run(new LongestCommonSubsequenceInput("", "abc"));

        steps.Should().HaveCount(1);
        var finalState = (LongestCommonSubsequenceSpaceOptimizedState)steps[^1].State;
        finalState.Dp.Should().BeEmpty();
    }
}
