using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class CheapestFlightsTests
{
    private readonly CheapestFlights _algorithm = new();

    [Fact]
    public void Run_OneStopAllowed_FindsCheaperTwoHopRoute()
    {
        int[][] flights = [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]];
        var input = new CheapestFlightsInput(4, flights, 0, 3, 1);

        var steps = _algorithm.Run(input);

        var finalState = (CheapestFlightsState)steps[^1].State;
        finalState.Answer.Should().Be(700);
    }

    [Fact]
    public void Run_OneStopAllowed_SimpleGraph_FindsCheaperRoute()
    {
        int[][] flights = [[0, 1, 100], [1, 2, 100], [0, 2, 500]];
        var input = new CheapestFlightsInput(3, flights, 0, 2, 1);

        var steps = _algorithm.Run(input);

        var finalState = (CheapestFlightsState)steps[^1].State;
        finalState.Answer.Should().Be(200);
    }

    [Fact]
    public void Run_ZeroStopsAllowed_MustTakeDirectFlight()
    {
        int[][] flights = [[0, 1, 100], [1, 2, 100], [0, 2, 500]];
        var input = new CheapestFlightsInput(3, flights, 0, 2, 0);

        var steps = _algorithm.Run(input);

        var finalState = (CheapestFlightsState)steps[^1].State;
        finalState.Answer.Should().Be(500);
    }

    [Fact]
    public void Run_NoRouteWithinStopLimit_ReturnsMinusOne()
    {
        int[][] flights = [[0, 1, 100], [1, 2, 100]];
        var input = new CheapestFlightsInput(3, flights, 0, 2, 0);

        var steps = _algorithm.Run(input);

        var finalState = (CheapestFlightsState)steps[^1].State;
        finalState.Answer.Should().Be(-1);
    }

    [Fact]
    public void Run_NoFlightsAtAll_DestinationUnreachable()
    {
        int[][] flights = [];
        var input = new CheapestFlightsInput(2, flights, 0, 1, 1);

        var steps = _algorithm.Run(input);

        steps.Should().HaveCount(2);
        var finalState = (CheapestFlightsState)steps[^1].State;
        finalState.Answer.Should().Be(-1);
    }
}
