using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class LetterCombinationsOfPhoneNumberTests
{
    private readonly LetterCombinationsOfPhoneNumber _algorithm = new();

    [Fact]
    public void Run_DigitsTwoThree_ProducesAllNineCombinations()
    {
        var steps = _algorithm.Run("23");

        var finalState = (StringBacktrackingState)steps[^1].State;
        finalState.Solutions.Should().BeEquivalentTo(
            new[] { "ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf" },
            options => options.WithStrictOrdering());
    }

    [Fact]
    public void Run_EmptyDigits_ReturnsSingleStepWithNoSolutions()
    {
        var steps = _algorithm.Run("");

        steps.Should().HaveCount(1);
        var finalState = (StringBacktrackingState)steps[^1].State;
        finalState.Solutions.Should().BeEmpty();
    }

    [Theory]
    [InlineData("1")]
    [InlineData("0")]
    [InlineData("2a")]
    public void Run_InvalidDigits_ReturnsSingleStepWithNoSolutions(string digits)
    {
        var steps = _algorithm.Run(digits);

        steps.Should().HaveCount(1);
        var finalState = (StringBacktrackingState)steps[^1].State;
        finalState.Solutions.Should().BeEmpty();
    }
}
