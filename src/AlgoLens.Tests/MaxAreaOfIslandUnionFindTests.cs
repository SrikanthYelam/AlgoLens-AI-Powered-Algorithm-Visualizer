using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class MaxAreaOfIslandUnionFindTests
{
    private readonly MaxAreaOfIslandUnionFind _algorithm = new();

    private int MaxArea(int[][] grid) => ((MaxAreaOfIslandUnionFindState)_algorithm.Run(grid)[^1].State).MaxArea;

    [Fact]
    public void Run_LeetCodeExample_ReturnsSix()
    {
        int[][] grid =
        [
            [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
            [0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0],
            [0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        ];

        MaxArea(grid).Should().Be(6);
    }

    [Fact]
    public void Run_AllWater_ReturnsZero()
    {
        MaxArea([[0, 0, 0, 0, 0, 0, 0, 0]]).Should().Be(0);
    }

    [Fact]
    public void Run_EmptyGrid_ReturnsSingleStepWithZero()
    {
        var steps = _algorithm.Run([]);

        steps.Should().HaveCount(1);
        ((MaxAreaOfIslandUnionFindState)steps[0].State).MaxArea.Should().Be(0);
    }

    [Fact]
    public void Run_UShapedIsland_JoinsArmsThatOnlyMeetAtTheBottom()
    {
        // The two arms are separate sets until the bottom row's middle cell links them, which
        // exercises a union between two multi-cell islands rather than just growing one.
        int[][] grid =
        [
            [1, 0, 1],
            [1, 0, 1],
            [1, 1, 1],
        ];

        MaxArea(grid).Should().Be(7);
    }

    [Fact]
    public void Run_CycleOfLand_SkipsTheRedundantUnion()
    {
        var steps = _algorithm.Run([[1, 1], [1, 1]]);

        ((MaxAreaOfIslandUnionFindState)steps[^1].State).MaxArea.Should().Be(4);
        steps.Should().Contain(s => s.Action.Contains("already in the same island"));
    }
}
