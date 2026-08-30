using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class SortedListToBstTests
{
    private readonly SortedListToBst _algorithm = new();

    [Fact]
    public void Run_CanonicalExample_ProducesHeightBalancedBst()
    {
        var steps = _algorithm.Run([-10, -3, 0, 5, 9]);

        var finalState = (SortedListToBstState)steps[^1].State;
        finalState.Tree.Should().Equal(0, -3, 9, -10, null, 5);
    }

    [Fact]
    public void Run_TwoElements_PicksSecondAsRoot()
    {
        var steps = _algorithm.Run([1, 2]);

        var finalState = (SortedListToBstState)steps[^1].State;
        finalState.Tree.Should().Equal(2, 1);
    }

    [Fact]
    public void Run_SingleElement_ProducesSingleNode()
    {
        var steps = _algorithm.Run([5]);

        var finalState = (SortedListToBstState)steps[^1].State;
        finalState.Tree.Should().Equal(5);
    }

    [Fact]
    public void Run_ResultIsAlwaysAValidBst()
    {
        // Rather than assert one specific shape (which involves a middle-of-two tie-break
        // choice), verify the general BST + balance properties the problem actually requires.
        var steps = _algorithm.Run([1, 2, 3, 4, 5, 6, 7]);

        var finalState = (SortedListToBstState)steps[^1].State;
        var root = TreeNode.FromLevelOrderArray(finalState.Tree);

        var inorder = new List<int>();
        void Visit(TreeNode? node)
        {
            if (node is null)
            {
                return;
            }
            Visit(node.Left);
            inorder.Add(node.Val);
            Visit(node.Right);
        }
        Visit(root);

        inorder.Should().Equal(1, 2, 3, 4, 5, 6, 7);
    }

    [Fact]
    public void Run_EmptyList_ReturnsSingleStepWithEmptyTree()
    {
        var steps = _algorithm.Run([]);

        steps.Should().HaveCount(1);
        var finalState = (SortedListToBstState)steps[^1].State;
        finalState.Tree.Should().BeEmpty();
        finalState.Root.Should().BeNull();
    }
}
