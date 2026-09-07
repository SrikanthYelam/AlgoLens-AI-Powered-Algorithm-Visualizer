using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class FindDuplicateSubtreesTests
{
    private readonly FindDuplicateSubtrees _algorithm = new();

    [Fact]
    public void Run_CanonicalExample_FindsTwoDuplicateGroups()
    {
        var root = TreeNode.FromLevelOrderArray([1, 2, 3, 4, null, 2, 4, null, null, 4]);

        var steps = _algorithm.Run(root);

        var finalState = (FindDuplicateSubtreesState)steps[^1].State;
        finalState.Duplicates.Should().BeEquivalentTo(new List<int?[]>
        {
            new int?[] { 2, 4 },
            new int?[] { 4 },
        });
    }

    [Fact]
    public void Run_SecondExample_FindsSingleLeafDuplicate()
    {
        var root = TreeNode.FromLevelOrderArray([2, 1, 1]);

        var steps = _algorithm.Run(root);

        var finalState = (FindDuplicateSubtreesState)steps[^1].State;
        finalState.Duplicates.Should().BeEquivalentTo(new List<int?[]> { new int?[] { 1 } });
    }

    [Fact]
    public void Run_NoDuplicateSubtrees_ReturnsEmptyList()
    {
        var root = TreeNode.FromLevelOrderArray([1, 2, 3]);

        var steps = _algorithm.Run(root);

        var finalState = (FindDuplicateSubtreesState)steps[^1].State;
        finalState.Duplicates.Should().BeEmpty();
    }

    [Fact]
    public void Run_EmptyTree_ReturnsSingleStepWithNoDuplicates()
    {
        var steps = _algorithm.Run(null);

        steps.Should().HaveCount(1);
        var finalState = (FindDuplicateSubtreesState)steps[^1].State;
        finalState.Duplicates.Should().BeEmpty();
    }
}
