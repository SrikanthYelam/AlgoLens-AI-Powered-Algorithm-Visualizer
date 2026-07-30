using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class NQueensTests
{
    private readonly NQueens _algorithm = new();

    [Fact]
    public void Run_BoardSizeFour_ProducesTwoSolutions()
    {
        var steps = _algorithm.Run(4);

        var finalState = (NQueensState)steps[^1].State;
        finalState.Solutions.Should().HaveCount(2);
    }

    [Fact]
    public void Run_BoardSizeOne_ProducesOneSolution()
    {
        var steps = _algorithm.Run(1);

        var finalState = (NQueensState)steps[^1].State;
        finalState.Solutions.Should().BeEquivalentTo(new IReadOnlyList<int>[] { [0] });
    }

    [Theory]
    [InlineData(2)]
    [InlineData(3)]
    public void Run_BoardSizeTwoOrThree_ProducesNoSolutions(int boardSize)
    {
        var steps = _algorithm.Run(boardSize);

        var finalState = (NQueensState)steps[^1].State;
        finalState.Solutions.Should().BeEmpty();
    }
}
