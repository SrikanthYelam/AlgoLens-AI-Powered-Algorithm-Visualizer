using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class LowestCommonAncestorTests
{
    private readonly LowestCommonAncestor _algorithm = new();

    // Classic LeetCode 236 example tree: [3,5,1,6,2,0,8,null,null,7,4]
    private static readonly int?[] ExampleTree = [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4];

    [Fact]
    public void Run_TargetsInDifferentSubtrees_FindsRoot()
    {
        var root = TreeNode.FromLevelOrderArray(ExampleTree);

        var steps = _algorithm.Run(new LowestCommonAncestorInput(root, 5, 1));

        var finalState = (LowestCommonAncestorState)steps[^1].State;
        finalState.Ancestor.Should().Be(3);
    }

    [Fact]
    public void Run_OneTargetIsAncestorOfOther_FindsThatTarget()
    {
        var root = TreeNode.FromLevelOrderArray(ExampleTree);

        var steps = _algorithm.Run(new LowestCommonAncestorInput(root, 5, 4));

        var finalState = (LowestCommonAncestorState)steps[^1].State;
        finalState.Ancestor.Should().Be(5);
    }

    [Fact]
    public void Run_BothTargetsInSameSmallSubtree_FindsLowestSharedNode()
    {
        var root = TreeNode.FromLevelOrderArray(ExampleTree);

        var steps = _algorithm.Run(new LowestCommonAncestorInput(root, 7, 4));

        var finalState = (LowestCommonAncestorState)steps[^1].State;
        finalState.Ancestor.Should().Be(2);
    }
}
