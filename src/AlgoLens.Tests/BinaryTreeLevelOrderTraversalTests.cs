using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class BinaryTreeLevelOrderTraversalTests
{
    private readonly BinaryTreeLevelOrderTraversal _algorithm = new();

    [Fact]
    public void Run_EmptyTree_ReturnsSingleStepWithNoLevels()
    {
        var steps = _algorithm.Run(root: null);

        steps.Should().HaveCount(1);
        var state = (TreeTraversalState)steps[0].State;
        state.CompletedLevels.Should().BeEmpty();
    }

    [Fact]
    public void Run_BalancedTree_ProducesCorrectLevelsAndStepCount()
    {
        // [3, 9, 20, null, null, 15, 7]
        var root = TreeNode.FromLevelOrderArray([3, 9, 20, null, null, 15, 7]);

        var steps = _algorithm.Run(root);

        // 1 start step + 1 step per node (5 nodes: 3, 9, 20, 15, 7)
        steps.Should().HaveCount(6);

        var finalState = (TreeTraversalState)steps[^1].State;
        finalState.CompletedLevels.Should().BeEquivalentTo(
            new IReadOnlyList<int>[] { [3], [9, 20], [15, 7] },
            options => options.WithStrictOrdering());
    }

    [Fact]
    public void Run_UnbalancedLeftLeaningTree_ProducesOneNodePerLevel()
    {
        // [1, 2, null, 3]
        var root = TreeNode.FromLevelOrderArray([1, 2, null, 3]);

        var steps = _algorithm.Run(root);

        var finalState = (TreeTraversalState)steps[^1].State;
        finalState.CompletedLevels.Should().BeEquivalentTo(
            new IReadOnlyList<int>[] { [1], [2], [3] },
            options => options.WithStrictOrdering());
    }

    [Fact]
    public void Run_SingleNodeTree_CompletesInOneLevel()
    {
        var root = TreeNode.FromLevelOrderArray([42]);

        var steps = _algorithm.Run(root);

        var finalState = (TreeTraversalState)steps[^1].State;
        finalState.CompletedLevels.Should().BeEquivalentTo(
            new IReadOnlyList<int>[] { [42] },
            options => options.WithStrictOrdering());
        finalState.Queue.Should().BeEmpty();
        finalState.CurrentLevelInProgress.Should().BeEmpty();
    }
}
