using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class NumberOfWaysTests
{
    private readonly NumberOfWays _algorithm = new();

    [Fact]
    public void Run_CanonicalExample_CountsFourShortestPaths()
    {
        int[][] roads =
        [
            [0, 6, 7], [0, 1, 2], [1, 2, 3], [1, 3, 3], [6, 3, 3],
            [3, 5, 1], [6, 5, 1], [2, 5, 1], [0, 4, 5], [4, 6, 2],
        ];
        var input = new NumberOfWaysInput(7, roads);

        var steps = _algorithm.Run(input);

        var finalState = (NumberOfWaysState)steps[^1].State;
        finalState.Answer.Should().Be(4);
    }

    [Fact]
    public void Run_SingleRoad_OneWay()
    {
        int[][] roads = [[1, 0, 10]];
        var input = new NumberOfWaysInput(2, roads);

        var steps = _algorithm.Run(input);

        var finalState = (NumberOfWaysState)steps[^1].State;
        finalState.Answer.Should().Be(1);
    }

    [Fact]
    public void Run_DiamondGraph_TwoEqualLengthPathsBothCount()
    {
        // 0 -> 1 -> 3 and 0 -> 2 -> 3, both length 2; the direct-looking detour never beats either.
        int[][] roads = [[0, 1, 1], [0, 2, 1], [1, 3, 1], [2, 3, 1]];
        var input = new NumberOfWaysInput(4, roads);

        var steps = _algorithm.Run(input);

        var finalState = (NumberOfWaysState)steps[^1].State;
        finalState.Answer.Should().Be(2);
    }

    [Fact]
    public void Run_OneStrictlyShortestPath_LongerAlternativeDoesNotCount()
    {
        int[][] roads = [[0, 1, 1], [1, 2, 1], [0, 2, 5]];
        var input = new NumberOfWaysInput(3, roads);

        var steps = _algorithm.Run(input);

        var finalState = (NumberOfWaysState)steps[^1].State;
        finalState.Answer.Should().Be(1);
    }

    [Fact]
    public void Run_SingleIntersection_TrivialOneWay()
    {
        var input = new NumberOfWaysInput(1, []);

        var steps = _algorithm.Run(input);

        steps.Should().HaveCount(1);
        var finalState = (NumberOfWaysState)steps[^1].State;
        finalState.Answer.Should().Be(1);
    }
}
