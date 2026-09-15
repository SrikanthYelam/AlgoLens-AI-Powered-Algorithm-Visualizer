using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class AccountsMergeTests
{
    private readonly AccountsMerge _algorithm = new();

    [Fact]
    public void Run_CanonicalExample_MergesAccountsSharingAnEmail()
    {
        List<List<string>> accounts =
        [
            ["John", "johnsmith@mail.com", "john_newyork@mail.com"],
            ["John", "johnsmith@mail.com", "john00@mail.com"],
            ["Mary", "mary@mail.com"],
            ["John", "johnnybravo@mail.com"],
        ];

        var steps = _algorithm.Run(accounts);

        var finalState = (AccountsMergeState)steps[^1].State;
        finalState.Groups.Should().BeEquivalentTo(new List<IReadOnlyList<string>>
        {
            new[] { "John", "john00@mail.com", "john_newyork@mail.com", "johnsmith@mail.com" },
            new[] { "Mary", "mary@mail.com" },
            new[] { "John", "johnnybravo@mail.com" },
        });
    }

    [Fact]
    public void Run_NoSharedEmails_KeepsEachAccountSeparate()
    {
        List<List<string>> accounts =
        [
            ["Alice", "alice@mail.com"],
            ["Bob", "bob@mail.com"],
        ];

        var steps = _algorithm.Run(accounts);

        var finalState = (AccountsMergeState)steps[^1].State;
        finalState.Groups.Should().HaveCount(2);
    }

    [Fact]
    public void Run_EmptyInput_ReturnsSingleStepWithNoGroups()
    {
        var steps = _algorithm.Run([]);

        steps.Should().HaveCount(1);
        var finalState = (AccountsMergeState)steps[^1].State;
        finalState.Groups.Should().BeEmpty();
    }
}
