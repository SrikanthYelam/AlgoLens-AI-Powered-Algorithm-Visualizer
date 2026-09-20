using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class EncodeAndDecodeStringsTests
{
    private readonly EncodeAndDecodeStrings _algorithm = new();

    [Fact]
    public void Run_CanonicalExample_RoundTripsTheList()
    {
        string[] strings = ["lint", "code", "love", "you"];

        var steps = _algorithm.Run(strings);

        var finalState = (EncodeAndDecodeStringsState)steps[^1].State;
        finalState.Encoded.Should().Be("4#lint4#code4#love3#you");
        finalState.Decoded.Should().BeEquivalentTo(strings, options => options.WithStrictOrdering());
    }

    [Fact]
    public void Run_StringsContainingTheDelimiterAndDigits_StillRoundTrip()
    {
        string[] strings = ["a#b", "3#x", "#"];

        var steps = _algorithm.Run(strings);

        var finalState = (EncodeAndDecodeStringsState)steps[^1].State;
        finalState.Encoded.Should().Be("3#a#b3#3#x1##");
        finalState.Decoded.Should().BeEquivalentTo(strings, options => options.WithStrictOrdering());
    }

    [Fact]
    public void Run_EmptyString_IsEncodedAsZeroLengthAndRecovered()
    {
        var steps = _algorithm.Run([""]);

        var finalState = (EncodeAndDecodeStringsState)steps[^1].State;
        finalState.Encoded.Should().Be("0#");
        finalState.Decoded.Should().BeEquivalentTo(new[] { "" });
    }

    [Fact]
    public void Run_RecordsOneEncodeStepPerStringThenTwoDecodeStepsPerString()
    {
        var steps = _algorithm.Run(["ab", "c"]);

        // 2 encode + (2 decode steps x 2 strings) + closing step.
        steps.Should().HaveCount(7);
        ((EncodeAndDecodeStringsState)steps[0].State).Phase.Should().Be("encode");
        ((EncodeAndDecodeStringsState)steps[2].State).Phase.Should().Be("decode");
    }

    [Fact]
    public void Run_DecodeScan_StopsAtTheHashThatEndsTheLengthPrefix()
    {
        var steps = _algorithm.Run(["ab"]);

        // steps: encode "ab" -> "2#ab", then decode scan, decode read, done.
        var scan = (EncodeAndDecodeStringsState)steps[1].State;
        scan.Cursor.Should().Be(0);
        scan.HashIndex.Should().Be(1);
        scan.ContentEnd.Should().Be(-1);

        var read = (EncodeAndDecodeStringsState)steps[2].State;
        read.ContentEnd.Should().Be(4);
        read.Decoded.Should().BeEquivalentTo(new[] { "ab" });
    }

    [Fact]
    public void Run_EmptyList_ReturnsSingleStep()
    {
        var steps = _algorithm.Run([]);

        steps.Should().HaveCount(1);
        ((EncodeAndDecodeStringsState)steps[^1].State).Decoded.Should().BeEmpty();
    }
}
