using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class MoveZeroesTests
{
    private readonly MoveZeroes _algorithm = new();

    [Fact]
    public void Run_CanonicalExample_MovesZerosToTheEndKeepingOrder()
    {
        var steps = _algorithm.Run([0, 1, 0, 3, 12]);

        var finalState = (MoveZeroesState)steps[^1].State;
        finalState.Nums.Should().BeEquivalentTo(new[] { 1, 3, 12, 0, 0 }, options => options.WithStrictOrdering());
        finalState.Write.Should().Be(3);
    }

    [Fact]
    public void Run_SingleZero_IsUnchanged()
    {
        var steps = _algorithm.Run([0]);

        var finalState = (MoveZeroesState)steps[^1].State;
        finalState.Nums.Should().BeEquivalentTo(new[] { 0 });
    }

    [Fact]
    public void Run_NoZeros_LeavesTheArrayAlone()
    {
        var steps = _algorithm.Run([1, 2, 3]);

        var finalState = (MoveZeroesState)steps[^1].State;
        finalState.Nums.Should().BeEquivalentTo(new[] { 1, 2, 3 }, options => options.WithStrictOrdering());
        finalState.Write.Should().Be(3);
    }

    [Fact]
    public void Run_LeadingZeros_AreSwappedPastTheNonZero()
    {
        var steps = _algorithm.Run([0, 0, 1]);

        var finalState = (MoveZeroesState)steps[^1].State;
        finalState.Nums.Should().BeEquivalentTo(new[] { 1, 0, 0 }, options => options.WithStrictOrdering());
    }

    [Fact]
    public void Run_RearrangesTheInputArrayInPlace()
    {
        var nums = new[] { 0, 1, 0, 3, 12 };

        _algorithm.Run(nums);

        nums.Should().BeEquivalentTo(new[] { 1, 3, 12, 0, 0 }, options => options.WithStrictOrdering());
    }

    [Fact]
    public void Run_EmptyInput_ReturnsSingleStep()
    {
        var steps = _algorithm.Run([]);

        steps.Should().HaveCount(1);
        ((MoveZeroesState)steps[^1].State).Nums.Should().BeEmpty();
    }
}
