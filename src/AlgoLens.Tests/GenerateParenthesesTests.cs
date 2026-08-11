using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class GenerateParenthesesTests
{
    private readonly GenerateParentheses _algorithm = new();

    [Fact]
    public void Run_NThree_ProducesAllFiveCombinations()
    {
        var steps = _algorithm.Run(3);

        var finalState = (StringBacktrackingState)steps[^1].State;
        finalState.Solutions.Should().BeEquivalentTo(
            new[] { "((()))", "(()())", "(())()", "()(())", "()()()" },
            options => options.WithStrictOrdering());
    }

    [Fact]
    public void Run_NOne_ProducesSingleCombination()
    {
        var steps = _algorithm.Run(1);

        var finalState = (StringBacktrackingState)steps[^1].State;
        finalState.Solutions.Should().BeEquivalentTo(new[] { "()" });
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public void Run_NonPositiveN_ReturnsSingleStepWithNoSolutions(int n)
    {
        var steps = _algorithm.Run(n);

        steps.Should().HaveCount(1);
        var finalState = (StringBacktrackingState)steps[^1].State;
        finalState.Solutions.Should().BeEmpty();
    }
}
