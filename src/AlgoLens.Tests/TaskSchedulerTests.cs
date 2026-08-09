using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class TaskSchedulerTests
{
    private readonly TaskSchedulerAlgorithm _algorithm = new();

    [Fact]
    public void Run_CanonicalExample_ProducesExpectedTimeline()
    {
        var input = new TaskSchedulerInput(['A', 'A', 'A', 'B', 'B', 'B'], Cooldown: 2);

        var steps = _algorithm.Run(input);

        var finalState = (TaskSchedulerState)steps[^1].State;
        finalState.Timeline.Should().BeEquivalentTo(
            new[] { "A", "B", "idle", "A", "B", "idle", "A", "B" },
            options => options.WithStrictOrdering());
    }

    [Fact]
    public void Run_NoCooldown_TakesExactlyAsManyTicksAsTasks()
    {
        var input = new TaskSchedulerInput(['A', 'A', 'A', 'B', 'B', 'B'], Cooldown: 0);

        var steps = _algorithm.Run(input);

        var finalState = (TaskSchedulerState)steps[^1].State;
        finalState.Timeline.Should().HaveCount(6);
        finalState.Timeline.Should().NotContain("idle");
    }

    [Fact]
    public void Run_EmptyTasks_ReturnsSingleStepWithEmptyTimeline()
    {
        var input = new TaskSchedulerInput([], Cooldown: 2);

        var steps = _algorithm.Run(input);

        steps.Should().HaveCount(1);
        var finalState = (TaskSchedulerState)steps[^1].State;
        finalState.Timeline.Should().BeEmpty();
    }
}
