using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class DecodeStringTests
{
    private readonly DecodeString _algorithm = new();

    [Theory]
    [InlineData("3[a]2[bc]", "aaabcbc")]
    [InlineData("3[a2[c]]", "accaccacc")]
    [InlineData("2[abc]3[cd]ef", "abcabccdcdcdef")]
    [InlineData("abc", "abc")]
    [InlineData("10[a]", "aaaaaaaaaa")]
    [InlineData("2[a2[b2[c]]]", "abccbccabccbcc")]
    public void Run_DecodesTheEncodedString(string encoded, string expected)
    {
        var steps = _algorithm.Run(encoded);

        ((DecodeStringState)steps[^1].State).Result.Should().Be(expected);
    }

    [Fact]
    public void Run_NestedBrackets_StackHoldsOneFramePerOpenBracket()
    {
        var steps = _algorithm.Run("3[a2[c]]");

        // After consuming the inner "[" (index 4) both brackets are open.
        var state = (DecodeStringState)steps[4].State;
        state.Index.Should().Be(4);
        state.Stack.Should().BeEquivalentTo(
            new[] { new DecodeStringFrame("", 3), new DecodeStringFrame("a", 2) },
            options => options.WithStrictOrdering());
    }

    [Fact]
    public void Run_MultiDigitCount_AccumulatesAcrossDigits()
    {
        var steps = _algorithm.Run("12[a]");

        ((DecodeStringState)steps[1].State).Number.Should().Be(12);
    }

    [Fact]
    public void Run_EmptyInput_ReturnsSingleStepWithEmptyResult()
    {
        var steps = _algorithm.Run("");

        steps.Should().HaveCount(1);
        ((DecodeStringState)steps[^1].State).Result.Should().BeEmpty();
    }
}
