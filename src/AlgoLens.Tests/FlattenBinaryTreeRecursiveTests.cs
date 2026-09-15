using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class FlattenBinaryTreeRecursiveTests
{
    private readonly FlattenBinaryTreeRecursive _algorithm = new();

    [Fact]
    public void Run_CanonicalExample_FlattensToPreorderChain()
    {
        var root = TreeNode.FromLevelOrderArray([1, 2, 5, 3, 4, null, 6]);

        var steps = _algorithm.Run(root);

        var finalState = (FlattenBinaryTreeRecursiveState)steps[^1].State;
        finalState.Tree.Should().BeEquivalentTo(
            new int?[] { 1, null, 2, null, 3, null, 4, null, 5, null, 6 },
            options => options.WithStrictOrdering());
    }

    [Fact]
    public void Run_SingleNode_StaysUnchanged()
    {
        var root = TreeNode.FromLevelOrderArray([0]);

        var steps = _algorithm.Run(root);

        var finalState = (FlattenBinaryTreeRecursiveState)steps[^1].State;
        finalState.Tree.Should().BeEquivalentTo(new int?[] { 0 }, options => options.WithStrictOrdering());
    }

    [Fact]
    public void Run_EmptyTree_ReturnsSingleStepWithEmptyTree()
    {
        var steps = _algorithm.Run(null);

        steps.Should().HaveCount(1);
        var finalState = (FlattenBinaryTreeRecursiveState)steps[^1].State;
        finalState.Tree.Should().BeEmpty();
    }
}
