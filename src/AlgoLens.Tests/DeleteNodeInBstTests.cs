using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class DeleteNodeInBstTests
{
    private readonly DeleteNodeInBst _algorithm = new();

    [Fact]
    public void Run_CanonicalExample_DeletesNodeWithTwoChildren()
    {
        var root = TreeNode.FromLevelOrderArray([5, 3, 6, 2, 4, null, 7]);
        var input = new DeleteNodeInBstInput(root, 3);

        var steps = _algorithm.Run(input);

        var finalState = (DeleteNodeInBstState)steps[^1].State;
        finalState.Tree.Should().BeEquivalentTo(new int?[] { 5, 4, 6, 2, null, null, 7 }, options => options.WithStrictOrdering());
    }

    [Fact]
    public void Run_KeyNotFound_LeavesTreeUnchanged()
    {
        var root = TreeNode.FromLevelOrderArray([5, 3, 6, 2, 4, null, 7]);
        var input = new DeleteNodeInBstInput(root, 0);

        var steps = _algorithm.Run(input);

        var finalState = (DeleteNodeInBstState)steps[^1].State;
        finalState.Tree.Should().BeEquivalentTo(new int?[] { 5, 3, 6, 2, 4, null, 7 }, options => options.WithStrictOrdering());
    }

    [Fact]
    public void Run_DeleteRootWithTwoChildren_ReplacesRootWithSuccessor()
    {
        var root = TreeNode.FromLevelOrderArray([5, 3, 6, 2, 4, null, 7]);
        var input = new DeleteNodeInBstInput(root, 5);

        var steps = _algorithm.Run(input);

        var finalState = (DeleteNodeInBstState)steps[^1].State;
        finalState.Tree.Should().BeEquivalentTo(new int?[] { 6, 3, 7, 2, 4 }, options => options.WithStrictOrdering());
    }

    [Fact]
    public void Run_EmptyTree_ReturnsSingleStepWithEmptyTree()
    {
        var input = new DeleteNodeInBstInput(null, 0);

        var steps = _algorithm.Run(input);

        steps.Should().HaveCount(1);
        var finalState = (DeleteNodeInBstState)steps[^1].State;
        finalState.Tree.Should().BeEmpty();
    }
}
