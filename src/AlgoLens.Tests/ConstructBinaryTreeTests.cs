using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class ConstructBinaryTreeTests
{
    private readonly ConstructBinaryTree _algorithm = new();

    [Fact]
    public void Run_CanonicalExample_RebuildsExpectedTree()
    {
        var steps = _algorithm.Run(new ConstructBinaryTreeInput([3, 9, 20, 15, 7], [9, 3, 15, 20, 7]));

        var finalState = (ConstructBinaryTreeState)steps[^1].State;
        finalState.Tree.Should().Equal(3, 9, 20, null, null, 15, 7);
    }

    [Fact]
    public void Run_SingleNode_RebuildsSingleNode()
    {
        var steps = _algorithm.Run(new ConstructBinaryTreeInput([1], [1]));

        var finalState = (ConstructBinaryTreeState)steps[^1].State;
        finalState.Tree.Should().Equal(1);
        finalState.Root.Should().NotBeNull();
        finalState.Root!.Val.Should().Be(1);
    }

    [Fact]
    public void Run_LeftSkewedTree_RebuildsCorrectShape()
    {
        // preorder [3,2,1], inorder [1,2,3] describes a tree that is entirely left children.
        var steps = _algorithm.Run(new ConstructBinaryTreeInput([3, 2, 1], [1, 2, 3]));

        var finalState = (ConstructBinaryTreeState)steps[^1].State;
        finalState.Tree.Should().Equal(3, 2, null, 1);
    }

    [Fact]
    public void Run_EmptyInput_ReturnsSingleStepWithEmptyTree()
    {
        var steps = _algorithm.Run(new ConstructBinaryTreeInput([], []));

        steps.Should().HaveCount(1);
        var finalState = (ConstructBinaryTreeState)steps[^1].State;
        finalState.Tree.Should().BeEmpty();
        finalState.Root.Should().BeNull();
    }
}
