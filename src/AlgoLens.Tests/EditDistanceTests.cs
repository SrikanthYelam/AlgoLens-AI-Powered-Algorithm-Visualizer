using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class EditDistanceTests
{
    private readonly EditDistance _algorithm = new();

    [Fact]
    public void Run_HorseRos_FindsThree()
    {
        var steps = _algorithm.Run(new EditDistanceInput("horse", "ros"));

        var finalState = (EditDistanceState)steps[^1].State;
        finalState.Table[^1][^1].Should().Be(3);
    }

    [Fact]
    public void Run_IntentionExecution_FindsFive()
    {
        var steps = _algorithm.Run(new EditDistanceInput("intention", "execution"));

        var finalState = (EditDistanceState)steps[^1].State;
        finalState.Table[^1][^1].Should().Be(5);
    }

    [Fact]
    public void Run_IdenticalStrings_FindsZero()
    {
        var steps = _algorithm.Run(new EditDistanceInput("abc", "abc"));

        var finalState = (EditDistanceState)steps[^1].State;
        finalState.Table[^1][^1].Should().Be(0);
    }

    [Fact]
    public void Run_OneEmptyString_EqualsOtherStringLength()
    {
        var steps = _algorithm.Run(new EditDistanceInput("", "abc"));

        var finalState = (EditDistanceState)steps[^1].State;
        finalState.Table[^1][^1].Should().Be(3);
    }

    [Fact]
    public void Run_BothEmptyStrings_FindsZero()
    {
        var steps = _algorithm.Run(new EditDistanceInput("", ""));

        var finalState = (EditDistanceState)steps[^1].State;
        finalState.Table[^1][^1].Should().Be(0);
    }
}
