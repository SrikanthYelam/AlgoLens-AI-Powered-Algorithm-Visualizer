using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class LongestCommonSubsequenceTests
{
    private readonly LongestCommonSubsequence _algorithm = new();

    [Fact]
    public void Run_AbcdeAce_FindsAce()
    {
        var steps = _algorithm.Run(new LongestCommonSubsequenceInput("abcde", "ace"));

        var finalState = (LongestCommonSubsequenceState)steps[^1].State;
        finalState.Subsequence.Should().Be("ace");
    }

    [Fact]
    public void Run_NoCommonCharacters_ProducesEmptySubsequence()
    {
        var steps = _algorithm.Run(new LongestCommonSubsequenceInput("abc", "xyz"));

        var finalState = (LongestCommonSubsequenceState)steps[^1].State;
        finalState.Subsequence.Should().BeEmpty();
    }

    [Fact]
    public void Run_IdenticalStrings_FindsWholeString()
    {
        var steps = _algorithm.Run(new LongestCommonSubsequenceInput("abc", "abc"));

        var finalState = (LongestCommonSubsequenceState)steps[^1].State;
        finalState.Subsequence.Should().Be("abc");
    }

    [Fact]
    public void Run_EmptyString_ReturnsSingleStepWithEmptySubsequence()
    {
        var steps = _algorithm.Run(new LongestCommonSubsequenceInput("", "abc"));

        steps.Should().HaveCount(1);
        var finalState = (LongestCommonSubsequenceState)steps[^1].State;
        finalState.Subsequence.Should().BeEmpty();
    }
}
