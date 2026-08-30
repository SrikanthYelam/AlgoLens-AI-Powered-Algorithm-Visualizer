using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class ValidateBstTests
{
    private readonly ValidateBst _algorithm = new();

    [Fact]
    public void Run_ValidBst_ReturnsTrue()
    {
        var root = TreeNode.FromLevelOrderArray([2, 1, 3]);

        var steps = _algorithm.Run(root);

        var finalState = (ValidateBstState)steps[^1].State;
        finalState.IsValidSoFar.Should().BeTrue();
    }

    [Fact]
    public void Run_InvalidBst_ReturnsFalse()
    {
        // Classic counterexample: 3 is a right-subtree descendant of 5 but is less than the
        // root 5 — locally looks fine at node 4, but violates the whole-subtree BST property.
        var root = TreeNode.FromLevelOrderArray([5, 1, 4, null, null, 3, 6]);

        var steps = _algorithm.Run(root);

        var finalState = (ValidateBstState)steps[^1].State;
        finalState.IsValidSoFar.Should().BeFalse();
    }

    [Fact]
    public void Run_SingleNode_ReturnsTrue()
    {
        var root = TreeNode.FromLevelOrderArray([1]);

        var steps = _algorithm.Run(root);

        var finalState = (ValidateBstState)steps[^1].State;
        finalState.IsValidSoFar.Should().BeTrue();
    }

    [Fact]
    public void Run_EmptyTree_ReturnsTrue()
    {
        var steps = _algorithm.Run(null);

        steps.Should().HaveCount(1);
        var finalState = (ValidateBstState)steps[^1].State;
        finalState.IsValidSoFar.Should().BeTrue();
    }
}
