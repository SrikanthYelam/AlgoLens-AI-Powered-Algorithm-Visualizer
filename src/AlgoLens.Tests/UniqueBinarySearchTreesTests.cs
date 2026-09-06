using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class UniqueBinarySearchTreesTests
{
    private readonly UniqueBinarySearchTrees _algorithm = new();

    [Fact]
    public void Run_NEqualsThree_FindsFiveTrees()
    {
        var steps = _algorithm.Run(3);

        var finalState = (UniqueBstCountState)steps[^1].State;
        finalState.Table[^1].Should().Be(5);
    }

    [Fact]
    public void Run_NEqualsOne_FindsOneTree()
    {
        var steps = _algorithm.Run(1);

        var finalState = (UniqueBstCountState)steps[^1].State;
        finalState.Table[^1].Should().Be(1);
    }

    [Fact]
    public void Run_NEqualsNineteen_MatchesTheNineteenthCatalanNumber()
    {
        var steps = _algorithm.Run(19);

        var finalState = (UniqueBstCountState)steps[^1].State;
        finalState.Table[^1].Should().Be(1767263190);
    }

    [Fact]
    public void Run_NEqualsZero_ReturnsSingleStepWithOneEmptyTree()
    {
        var steps = _algorithm.Run(0);

        steps.Should().HaveCount(1);
        var finalState = (UniqueBstCountState)steps[^1].State;
        finalState.Table[^1].Should().Be(1);
    }
}
