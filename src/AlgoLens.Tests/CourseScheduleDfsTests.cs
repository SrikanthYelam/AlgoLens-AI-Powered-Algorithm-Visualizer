using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class CourseScheduleDfsTests
{
    private readonly CourseScheduleDfs _algorithm = new();

    [Fact]
    public void Run_CanonicalExample_CanFinish()
    {
        var input = new CourseScheduleInput(2, [[1, 0]]);

        var steps = _algorithm.Run(input);

        var finalState = (CourseScheduleDfsState)steps[^1].State;
        finalState.CanFinish.Should().BeTrue();
    }

    [Fact]
    public void Run_SimpleCycle_CannotFinish()
    {
        var input = new CourseScheduleInput(2, [[1, 0], [0, 1]]);

        var steps = _algorithm.Run(input);

        var finalState = (CourseScheduleDfsState)steps[^1].State;
        finalState.CanFinish.Should().BeFalse();
    }

    [Fact]
    public void Run_LargerDag_CanFinish()
    {
        var input = new CourseScheduleInput(4, [[1, 0], [2, 0], [3, 1], [3, 2]]);

        var steps = _algorithm.Run(input);

        var finalState = (CourseScheduleDfsState)steps[^1].State;
        finalState.CanFinish.Should().BeTrue();
    }

    [Fact]
    public void Run_NoPrerequisites_CanFinish()
    {
        var input = new CourseScheduleInput(3, []);

        var steps = _algorithm.Run(input);

        var finalState = (CourseScheduleDfsState)steps[^1].State;
        finalState.CanFinish.Should().BeTrue();
    }

    [Fact]
    public void Run_ZeroCourses_ReturnsSingleStepThatCanFinish()
    {
        var input = new CourseScheduleInput(0, []);

        var steps = _algorithm.Run(input);

        steps.Should().HaveCount(1);
        var finalState = (CourseScheduleDfsState)steps[^1].State;
        finalState.CanFinish.Should().BeTrue();
    }

    [Fact]
    public void Run_SelfLoopingPrerequisite_CannotFinish()
    {
        var input = new CourseScheduleInput(1, [[0, 0]]);

        var steps = _algorithm.Run(input);

        var finalState = (CourseScheduleDfsState)steps[^1].State;
        finalState.CanFinish.Should().BeFalse();
    }
}
