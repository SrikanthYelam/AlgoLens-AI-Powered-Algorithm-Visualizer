using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class ReconstructItineraryTests
{
    private readonly ReconstructItinerary _algorithm = new();

    [Fact]
    public void Run_SimpleChain_ReturnsOnlyPossibleOrder()
    {
        List<IReadOnlyList<string>> tickets =
            [["MUC", "LHR"], ["JFK", "MUC"], ["SFO", "SJC"], ["LHR", "SFO"]];

        var steps = _algorithm.Run(tickets);

        var finalState = (ReconstructItineraryState)steps[^1].State;
        finalState.Itinerary.Should().Equal("JFK", "MUC", "LHR", "SFO", "SJC");
    }

    [Fact]
    public void Run_MultipleValidOrders_PicksLexicographicallySmallest()
    {
        List<IReadOnlyList<string>> tickets =
            [["JFK", "SFO"], ["JFK", "ATL"], ["SFO", "ATL"], ["ATL", "JFK"], ["ATL", "SFO"]];

        var steps = _algorithm.Run(tickets);

        var finalState = (ReconstructItineraryState)steps[^1].State;
        finalState.Itinerary.Should().Equal("JFK", "ATL", "JFK", "SFO", "ATL", "SFO");
    }

    [Fact]
    public void Run_DeadEndRequiresBacktracking_DoesNotStrandATicket()
    {
        // Greedily taking JFK -> KUL first (lexicographically smaller than NRT) would strand the
        // JFK -> NRT / NRT -> JFK tickets unused — the postorder-then-reverse result avoids that.
        List<IReadOnlyList<string>> tickets = [["JFK", "KUL"], ["JFK", "NRT"], ["NRT", "JFK"]];

        var steps = _algorithm.Run(tickets);

        var finalState = (ReconstructItineraryState)steps[^1].State;
        finalState.Itinerary.Should().Equal("JFK", "NRT", "JFK", "KUL");
    }

    [Fact]
    public void Run_SingleTicket_ReturnsTwoStopItinerary()
    {
        List<IReadOnlyList<string>> tickets = [["JFK", "A"]];

        var steps = _algorithm.Run(tickets);

        var finalState = (ReconstructItineraryState)steps[^1].State;
        finalState.Itinerary.Should().Equal("JFK", "A");
    }

    [Fact]
    public void Run_NoTickets_ReturnsSingleStepWithJustTheStartAirport()
    {
        List<IReadOnlyList<string>> tickets = [];

        var steps = _algorithm.Run(tickets);

        steps.Should().HaveCount(1);
        var finalState = (ReconstructItineraryState)steps[^1].State;
        finalState.Itinerary.Should().Equal("JFK");
    }
}
