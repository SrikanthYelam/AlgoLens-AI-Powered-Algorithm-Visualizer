using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class DecodeWaysTests
{
    private readonly DecodeWays _algorithm = new();

    [Fact]
    public void Run_Twelve_FindsTwoWays()
    {
        var steps = _algorithm.Run("12");

        var finalState = (DecodeWaysState)steps[^1].State;
        finalState.Table[^1].Should().Be(2);
    }

    [Fact]
    public void Run_TwoTwoSix_FindsThreeWays()
    {
        var steps = _algorithm.Run("226");

        var finalState = (DecodeWaysState)steps[^1].State;
        finalState.Table[^1].Should().Be(3);
    }

    [Fact]
    public void Run_LeadingZero_FindsNoWays()
    {
        var steps = _algorithm.Run("06");

        var finalState = (DecodeWaysState)steps[^1].State;
        finalState.Table[^1].Should().Be(0);
    }

    [Fact]
    public void Run_SingleZero_FindsNoWays()
    {
        var steps = _algorithm.Run("0");

        var finalState = (DecodeWaysState)steps[^1].State;
        finalState.Table[^1].Should().Be(0);
    }

    [Fact]
    public void Run_UnreachablePair_FindsOneWay()
    {
        // "27" can't be read as a two-digit code (>26), but '2' and '7' each decode alone.
        var steps = _algorithm.Run("27");

        var finalState = (DecodeWaysState)steps[^1].State;
        finalState.Table[^1].Should().Be(1);
    }

    [Fact]
    public void Run_EmptyString_ReturnsSingleStepWithOneWay()
    {
        var steps = _algorithm.Run("");

        steps.Should().HaveCount(1);
        var finalState = (DecodeWaysState)steps[^1].State;
        finalState.Table[^1].Should().Be(1);
    }
}
