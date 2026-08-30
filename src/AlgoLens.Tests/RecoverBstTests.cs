using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class RecoverBstTests
{
    private readonly RecoverBst _algorithm = new();

    [Fact]
    public void Run_AdjacentSwap_FixesTree()
    {
        // Shape is root -> left -> left.right, whose inorder sequence is (left, left.right,
        // root). Correctly assigned that's (1, 2, 3); swapping the last two adjacent values
        // (2 and 3) produces this single-dip input, which should recover back to (1, 2, 3).
        var root = TreeNode.FromLevelOrderArray([2, 1, null, null, 3]);

        var steps = _algorithm.Run(root);

        TreeNode.ToLevelOrderArray(root).Should().Equal(3, 1, null, null, 2);
        var finalState = (RecoverBstState)steps[^1].State;
        finalState.Root.Should().BeSameAs(root);
    }

    [Fact]
    public void Run_NonAdjacentSwap_FixesTree()
    {
        // Correct BST is [3,1,4,null,2]; 1 and 4 were swapped, producing two dips.
        var root = TreeNode.FromLevelOrderArray([3, 4, 1, null, 2]);

        _algorithm.Run(root);

        TreeNode.ToLevelOrderArray(root).Should().Equal(3, 1, 4, null, 2);
    }

    [Fact]
    public void Run_AlreadyValidBst_LeavesTreeUnchanged()
    {
        var root = TreeNode.FromLevelOrderArray([2, 1, 3]);

        _algorithm.Run(root);

        TreeNode.ToLevelOrderArray(root).Should().Equal(2, 1, 3);
    }

    [Fact]
    public void Run_EmptyTree_ReturnsSingleStep()
    {
        var steps = _algorithm.Run(null);

        steps.Should().HaveCount(1);
        var finalState = (RecoverBstState)steps[^1].State;
        finalState.Root.Should().BeNull();
    }
}
