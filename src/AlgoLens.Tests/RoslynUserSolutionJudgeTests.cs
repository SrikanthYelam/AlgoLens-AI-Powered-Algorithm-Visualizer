using AlgoLens.Api.Services;
using FluentAssertions;
using Xunit;

namespace AlgoLens.Tests;

public class RoslynUserSolutionJudgeTests
{
    private readonly RoslynUserSolutionJudge _judge = new();

    [Fact]
    public async Task RunAsync_CorrectSolution_ReturnsExpectedValue()
    {
        const string code = "public static int Solve(int[] nums) { return nums.Sum(); }";
        var args = new Dictionary<string, object?> { ["nums"] = new[] { 1, 2, 3 } };

        var result = await _judge.RunAsync(
            code, "Solve((int[])Args[\"nums\"])", args, TimeSpan.FromSeconds(5), CancellationToken.None);

        result.CompileSucceeded.Should().BeTrue();
        result.RanSuccessfully.Should().BeTrue();
        result.ReturnValue.Should().Be(6);
    }

    [Fact]
    public async Task RunAsync_SyntaxError_ReturnsCompileErrors()
    {
        const string code = "public static int Solve(int[] nums) { return ; }";

        var result = await _judge.RunAsync(
            code, "Solve((int[])Args[\"nums\"])", new Dictionary<string, object?>(), TimeSpan.FromSeconds(5), CancellationToken.None);

        result.CompileSucceeded.Should().BeFalse();
        result.CompileErrors.Should().NotBeEmpty();
        result.RanSuccessfully.Should().BeFalse();
    }

    [Fact]
    public async Task RunAsync_ThrowingSolution_ReturnsRuntimeError()
    {
        const string code = "public static int Solve(int[] nums) { throw new InvalidOperationException(\"boom\"); }";
        var args = new Dictionary<string, object?> { ["nums"] = new[] { 1 } };

        var result = await _judge.RunAsync(
            code, "Solve((int[])Args[\"nums\"])", args, TimeSpan.FromSeconds(5), CancellationToken.None);

        result.CompileSucceeded.Should().BeTrue();
        result.RanSuccessfully.Should().BeFalse();
        result.RuntimeError.Should().Contain("boom");
    }

    [Fact]
    public async Task RunAsync_InfiniteLoop_TimesOutPromptly()
    {
        const string code = "public static int Solve(int[] nums) { while (true) { } }";
        var args = new Dictionary<string, object?> { ["nums"] = new[] { 1 } };

        var result = await _judge.RunAsync(
            code, "Solve((int[])Args[\"nums\"])", args, TimeSpan.FromMilliseconds(300), CancellationToken.None);

        result.CompileSucceeded.Should().BeTrue();
        result.RanSuccessfully.Should().BeFalse();
        result.RuntimeError.Should().Contain("Timed out");
    }
}
