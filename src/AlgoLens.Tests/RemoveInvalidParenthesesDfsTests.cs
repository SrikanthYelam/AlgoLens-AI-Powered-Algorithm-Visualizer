using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class RemoveInvalidParenthesesDfsTests
{
    private readonly RemoveInvalidParenthesesDfs _algorithm = new();

    [Fact]
    public void Run_OneExtraCloseParen_ProducesBothMinimalResults()
    {
        var steps = _algorithm.Run("()())()");

        var finalState = (RemoveInvalidParenthesesDfsState)steps[^1].State;
        finalState.Results.Should().BeEquivalentTo(new[] { "()()()", "(())()" });
    }

    [Fact]
    public void Run_WithLetters_PreservesLettersAndProducesBothMinimalResults()
    {
        var steps = _algorithm.Run("(a)())()");

        var finalState = (RemoveInvalidParenthesesDfsState)steps[^1].State;
        finalState.Results.Should().BeEquivalentTo(new[] { "(a)()()", "(a())()" });
    }

    [Fact]
    public void Run_AllParensInvalid_ProducesEmptyString()
    {
        var steps = _algorithm.Run(")(");

        var finalState = (RemoveInvalidParenthesesDfsState)steps[^1].State;
        finalState.Results.Should().BeEquivalentTo(new[] { "" });
    }

    [Fact]
    public void Run_EmptyInput_ReturnsSingleStepWithEmptyStringResult()
    {
        var steps = _algorithm.Run("");

        steps.Should().HaveCount(1);
        var finalState = (RemoveInvalidParenthesesDfsState)steps[^1].State;
        finalState.Results.Should().BeEquivalentTo(new[] { "" });
    }
}
