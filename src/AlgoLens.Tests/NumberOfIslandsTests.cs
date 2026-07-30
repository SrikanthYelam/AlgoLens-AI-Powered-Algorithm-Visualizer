using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class NumberOfIslandsTests
{
    private readonly NumberOfIslands _algorithm = new();

    [Fact]
    public void Run_CanonicalExample_FindsThreeIslands()
    {
        int[][] grid =
        [
            [1, 1, 0, 0, 0],
            [1, 1, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 1, 1],
        ];

        var steps = _algorithm.Run(grid);

        var finalState = (IslandsState)steps[^1].State;
        finalState.IslandCount.Should().Be(3);
    }

    [Fact]
    public void Run_EmptyGrid_ReturnsSingleStepWithZeroIslands()
    {
        var steps = _algorithm.Run([]);

        steps.Should().HaveCount(1);
        var finalState = (IslandsState)steps[^1].State;
        finalState.IslandCount.Should().Be(0);
    }

    [Fact]
    public void Run_AllWater_FindsNoIslands()
    {
        int[][] grid =
        [
            [0, 0],
            [0, 0],
        ];

        var steps = _algorithm.Run(grid);

        var finalState = (IslandsState)steps[^1].State;
        finalState.IslandCount.Should().Be(0);
    }

    [Fact]
    public void Run_AllLand_FindsOneIsland()
    {
        int[][] grid =
        [
            [1, 1],
            [1, 1],
        ];

        var steps = _algorithm.Run(grid);

        var finalState = (IslandsState)steps[^1].State;
        finalState.IslandCount.Should().Be(1);
    }
}
