using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class RemoveDuplicateLettersTests
{
    private readonly RemoveDuplicateLetters _algorithm = new();

    [Fact]
    public void Run_CanonicalExample1_ReturnsAbc()
    {
        var steps = _algorithm.Run("bcabc");

        var finalState = (RemoveDuplicateLettersState)steps[^1].State;
        finalState.Result.Should().Be("abc");
    }

    [Fact]
    public void Run_CanonicalExample2_ReturnsAcdb()
    {
        var steps = _algorithm.Run("cbacdcbc");

        var finalState = (RemoveDuplicateLettersState)steps[^1].State;
        finalState.Result.Should().Be("acdb");
    }

    [Fact]
    public void Run_AllDistinctLetters_ReturnsInputUnchanged()
    {
        var steps = _algorithm.Run("abc");

        var finalState = (RemoveDuplicateLettersState)steps[^1].State;
        finalState.Result.Should().Be("abc");
    }

    [Fact]
    public void Run_SingleRepeatedLetter_ReturnsOneCopy()
    {
        var steps = _algorithm.Run("aaaa");

        var finalState = (RemoveDuplicateLettersState)steps[^1].State;
        finalState.Result.Should().Be("a");
    }

    [Fact]
    public void Run_EmptyString_ReturnsEmptyResult()
    {
        var steps = _algorithm.Run("");

        steps.Should().HaveCount(1);
        var finalState = (RemoveDuplicateLettersState)steps[^1].State;
        finalState.Result.Should().Be("");
    }
}
