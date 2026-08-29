using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class MeetingRoomsIITests
{
    private readonly MeetingRoomsII _algorithm = new();

    [Fact]
    public void Run_CanonicalExample_NeedsTwoRooms()
    {
        var steps = _algorithm.Run([[0, 30], [5, 10], [15, 20]]);

        var finalState = (MeetingRoomsState)steps[^1].State;
        finalState.MaxRooms.Should().Be(2);
    }

    [Fact]
    public void Run_NonOverlappingBackToBack_NeedsOneRoom()
    {
        var steps = _algorithm.Run([[7, 10], [2, 4]]);

        var finalState = (MeetingRoomsState)steps[^1].State;
        finalState.MaxRooms.Should().Be(1);
    }

    [Fact]
    public void Run_AllMeetingsOverlap_NeedsARoomPerMeeting()
    {
        var steps = _algorithm.Run([[1, 10], [2, 10], [3, 10]]);

        var finalState = (MeetingRoomsState)steps[^1].State;
        finalState.MaxRooms.Should().Be(3);
    }

    [Fact]
    public void Run_SingleMeeting_NeedsOneRoom()
    {
        var steps = _algorithm.Run([[5, 8]]);

        var finalState = (MeetingRoomsState)steps[^1].State;
        finalState.MaxRooms.Should().Be(1);
    }

    [Fact]
    public void Run_EmptyInput_NeedsZeroRooms()
    {
        var steps = _algorithm.Run([]);

        steps.Should().HaveCount(1);
        var finalState = (MeetingRoomsState)steps[^1].State;
        finalState.MaxRooms.Should().Be(0);
    }
}
