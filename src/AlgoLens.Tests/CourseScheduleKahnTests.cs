using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class CourseScheduleKahnTests
{
    private readonly CourseScheduleKahn _algorithm = new();

    [Fact]
    public void Run_CanonicalExample_CanFinish()
    {
        var input = new CourseScheduleInput(2, [[1, 0]]);

        var steps = _algorithm.Run(input);

        var finalState = (CourseScheduleKahnState)steps[^1].State;
        finalState.CanFinish.Should().BeTrue();
        finalState.Order.Should().BeEquivalentTo([0, 1], options => options.WithStrictOrdering());
    }

    [Fact]
    public void Run_SimpleCycle_CannotFinish()
    {
        var input = new CourseScheduleInput(2, [[1, 0], [0, 1]]);

        var steps = _algorithm.Run(input);

        var finalState = (CourseScheduleKahnState)steps[^1].State;
        finalState.CanFinish.Should().BeFalse();
        finalState.Order.Should().BeEmpty();
    }

    [Fact]
    public void Run_LargerDag_CanFinish()
    {
        var input = new CourseScheduleInput(4, [[1, 0], [2, 0], [3, 1], [3, 2]]);

        var steps = _algorithm.Run(input);

        var finalState = (CourseScheduleKahnState)steps[^1].State;
        finalState.CanFinish.Should().BeTrue();
        finalState.Order.Should().HaveCount(4);
        var order = finalState.Order.ToList();
        order.IndexOf(0).Should().BeLessThan(order.IndexOf(1));
        order.IndexOf(0).Should().BeLessThan(order.IndexOf(2));
        order.IndexOf(1).Should().BeLessThan(order.IndexOf(3));
        order.IndexOf(2).Should().BeLessThan(order.IndexOf(3));
    }

    [Fact]
    public void Run_NoPrerequisites_CanFinish()
    {
        var input = new CourseScheduleInput(3, []);

        var steps = _algorithm.Run(input);

        var finalState = (CourseScheduleKahnState)steps[^1].State;
        finalState.CanFinish.Should().BeTrue();
        finalState.Order.Should().BeEquivalentTo([0, 1, 2]);
    }

    [Fact]
    public void Run_ZeroCourses_ReturnsSingleStepThatCanFinish()
    {
        var input = new CourseScheduleInput(0, []);

        var steps = _algorithm.Run(input);

        steps.Should().HaveCount(1);
        var finalState = (CourseScheduleKahnState)steps[^1].State;
        finalState.CanFinish.Should().BeTrue();
    }

    [Fact]
    public void Run_SelfLoopingPrerequisite_CannotFinish()
    {
        var input = new CourseScheduleInput(1, [[0, 0]]);

        var steps = _algorithm.Run(input);

        var finalState = (CourseScheduleKahnState)steps[^1].State;
        finalState.CanFinish.Should().BeFalse();
    }
}
