using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class NumberOfProvincesTests
{
    private readonly NumberOfProvinces _algorithm = new();

    [Fact]
    public void Run_CanonicalExample_FindsTwoProvinces()
    {
        int[][] isConnected = [[1, 1, 0], [1, 1, 0], [0, 0, 1]];

        var steps = _algorithm.Run(isConnected);

        var finalState = (NumberOfProvincesState)steps[^1].State;
        finalState.Components.Should().Be(2);
    }

    [Fact]
    public void Run_NoConnections_EveryCityIsItsOwnProvince()
    {
        int[][] isConnected = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

        var steps = _algorithm.Run(isConnected);

        var finalState = (NumberOfProvincesState)steps[^1].State;
        finalState.Components.Should().Be(3);
    }

    [Fact]
    public void Run_EmptyInput_ReturnsSingleStepWithZeroProvinces()
    {
        var steps = _algorithm.Run([]);

        steps.Should().HaveCount(1);
        var finalState = (NumberOfProvincesState)steps[^1].State;
        finalState.Components.Should().Be(0);
    }
}
