using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class KthSmallestInBstTests
{
    private readonly KthSmallestInBst _algorithm = new();

    [Fact]
    public void Run_CanonicalExample_FindsFirst()
    {
        var root = TreeNode.FromLevelOrderArray([3, 1, 4, null, 2]);

        var steps = _algorithm.Run(new KthSmallestInput(root, 1));

        var finalState = (KthSmallestState)steps[^1].State;
        finalState.Answer.Should().Be(1);
    }

    [Fact]
    public void Run_LargerExample_FindsThird()
    {
        var root = TreeNode.FromLevelOrderArray([5, 3, 6, 2, 4, null, null, 1]);

        var steps = _algorithm.Run(new KthSmallestInput(root, 3));

        var finalState = (KthSmallestState)steps[^1].State;
        finalState.Answer.Should().Be(3);
    }

    [Fact]
    public void Run_KEqualsNodeCount_FindsLargest()
    {
        var root = TreeNode.FromLevelOrderArray([2, 1, 3]);

        var steps = _algorithm.Run(new KthSmallestInput(root, 3));

        var finalState = (KthSmallestState)steps[^1].State;
        finalState.Answer.Should().Be(3);
    }

    [Fact]
    public void Run_KLargerThanNodeCount_ReturnsNoAnswer()
    {
        var root = TreeNode.FromLevelOrderArray([2, 1, 3]);

        var steps = _algorithm.Run(new KthSmallestInput(root, 5));

        var finalState = (KthSmallestState)steps[^1].State;
        finalState.Answer.Should().BeNull();
    }
}
