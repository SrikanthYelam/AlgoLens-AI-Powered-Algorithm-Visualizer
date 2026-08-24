using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class LongestPalindromicSubstringTests
{
    private readonly LongestPalindromicSubstring _algorithm = new();

    [Fact]
    public void Run_Babad_FindsAba()
    {
        // "babad" has two equally-valid length-3 answers, "bab" and "aba" — which one is found
        // first depends on fill order. The table is filled bottom-up by row (i descending), so
        // row 1 ("aba", i=1) is completed before row 0 ("bab", i=0) gets a chance to tie it.
        var steps = _algorithm.Run("babad");

        var finalState = (LongestPalindromicSubstringState)steps[^1].State;
        finalState.LongestSoFar.Should().Be("aba");
    }

    [Fact]
    public void Run_Cbbd_FindsBb()
    {
        var steps = _algorithm.Run("cbbd");

        var finalState = (LongestPalindromicSubstringState)steps[^1].State;
        finalState.LongestSoFar.Should().Be("bb");
    }

    [Fact]
    public void Run_SingleCharacter_ReturnsThatCharacter()
    {
        var steps = _algorithm.Run("a");

        var finalState = (LongestPalindromicSubstringState)steps[^1].State;
        finalState.LongestSoFar.Should().Be("a");
    }

    [Fact]
    public void Run_WholeStringIsPalindrome_ReturnsWholeString()
    {
        var steps = _algorithm.Run("racecar");

        var finalState = (LongestPalindromicSubstringState)steps[^1].State;
        finalState.LongestSoFar.Should().Be("racecar");
    }

    [Fact]
    public void Run_EmptyInput_ReturnsSingleStepWithEmptyResult()
    {
        var steps = _algorithm.Run("");

        steps.Should().HaveCount(1);
        var finalState = (LongestPalindromicSubstringState)steps[^1].State;
        finalState.LongestSoFar.Should().BeEmpty();
    }
}
