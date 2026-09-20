using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class StringCompressionTests
{
    private readonly StringCompression _algorithm = new();

    [Fact]
    public void Run_CanonicalExample_CompressesEachRun()
    {
        var steps = _algorithm.Run("aabbccc".ToCharArray());

        var finalState = (StringCompressionState)steps[^1].State;
        finalState.Compressed.Should().Be("a2b2c3");
        finalState.Write.Should().Be(6);
    }

    [Fact]
    public void Run_SingleCharacter_IsLeftUncompressed()
    {
        var steps = _algorithm.Run("a".ToCharArray());

        var finalState = (StringCompressionState)steps[^1].State;
        finalState.Compressed.Should().Be("a");
        finalState.Write.Should().Be(1);
    }

    [Fact]
    public void Run_RunOfTwelve_WritesTheCountAsSeparateDigits()
    {
        var steps = _algorithm.Run("abbbbbbbbbbbb".ToCharArray());

        var finalState = (StringCompressionState)steps[^1].State;
        finalState.Compressed.Should().Be("ab12");
        finalState.Write.Should().Be(4);
    }

    [Fact]
    public void Run_NoRepeats_ReturnsTheSameString()
    {
        var steps = _algorithm.Run("abc".ToCharArray());

        var finalState = (StringCompressionState)steps[^1].State;
        finalState.Compressed.Should().Be("abc");
    }

    [Fact]
    public void Run_CompressesTheInputArrayInPlace()
    {
        var chars = "aabbccc".ToCharArray();

        var steps = _algorithm.Run(chars);

        var length = ((StringCompressionState)steps[^1].State).Write;
        new string(chars, 0, length).Should().Be("a2b2c3");
    }

    [Fact]
    public void Run_NeverLetsTheWritePointerOvertakeTheRun()
    {
        var steps = _algorithm.Run("aaaaaaaaaabccddddddddddddd".ToCharArray());

        foreach (var step in steps.Where(s => ((StringCompressionState)s.State).GroupStart >= 0))
        {
            var state = (StringCompressionState)step.State;
            state.Write.Should().BeLessThanOrEqualTo(state.GroupEnd + 1);
        }
    }

    [Fact]
    public void Run_EmptyInput_ReturnsSingleStepWithEmptyResult()
    {
        var steps = _algorithm.Run([]);

        steps.Should().HaveCount(1);
        var finalState = (StringCompressionState)steps[^1].State;
        finalState.Compressed.Should().BeEmpty();
        finalState.Write.Should().Be(0);
    }
}
