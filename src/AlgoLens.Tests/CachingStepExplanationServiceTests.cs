using AlgoLens.Api.Services;
using AlgoLens.Core.Models;
using FluentAssertions;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace AlgoLens.Tests;

public class CachingStepExplanationServiceTests
{
    private static AlgorithmStep MakeStep(int stepNumber, string action, int value) =>
        new(stepNumber, action, new SlidingWindowState([value], 1, 0, [value], []), [value.ToString()], 1, 1);

    private static CachingStepExplanationService MakeService(FakeStepExplanationService inner) =>
        new(inner, new MemoryCache(new MemoryCacheOptions()), NullLogger<CachingStepExplanationService>.Instance);

    [Fact]
    public async Task ExplainStepsAsync_FirstCall_ForwardsAllStepsToInner()
    {
        var inner = new FakeStepExplanationService();
        var service = MakeService(inner);
        var steps = new[] { MakeStep(0, "Push 1", 1), MakeStep(1, "Push 2", 2) };

        var result = await service.ExplainStepsAsync("algo", steps, CancellationToken.None);

        inner.CallCount.Should().Be(1);
        inner.StepsPerCall.Should().Equal(2);
        result.Should().Equal("explained: Push 1", "explained: Push 2");
    }

    [Fact]
    public async Task ExplainStepsAsync_RepeatedIdenticalRun_ServesEntirelyFromCache()
    {
        var inner = new FakeStepExplanationService();
        var service = MakeService(inner);
        var steps = new[] { MakeStep(0, "Push 1", 1), MakeStep(1, "Push 2", 2) };

        var first = await service.ExplainStepsAsync("algo", steps, CancellationToken.None);
        var second = await service.ExplainStepsAsync("algo", steps, CancellationToken.None);

        inner.CallCount.Should().Be(1, "the second identical run should be served entirely from cache");
        second.Should().Equal(first);
    }

    [Fact]
    public async Task ExplainStepsAsync_PartialOverlap_OnlyForwardsTheMiss()
    {
        var inner = new FakeStepExplanationService();
        var service = MakeService(inner);
        var cachedStep = MakeStep(0, "Push 1", 1);
        var newStep = MakeStep(1, "Push 99", 99);

        await service.ExplainStepsAsync("algo", [cachedStep], CancellationToken.None);
        var result = await service.ExplainStepsAsync("algo", [cachedStep, newStep], CancellationToken.None);

        inner.CallCount.Should().Be(2);
        inner.StepsPerCall.Should().Equal(1, 1);
        result.Should().Equal("explained: Push 1", "explained: Push 99");
    }

    [Fact]
    public async Task ExplainStepsAsync_SameStepContentDifferentAlgorithmId_IsTreatedAsAMiss()
    {
        var inner = new FakeStepExplanationService();
        var service = MakeService(inner);
        var step = MakeStep(0, "Push 1", 1);

        await service.ExplainStepsAsync("algo-a", [step], CancellationToken.None);
        await service.ExplainStepsAsync("algo-b", [step], CancellationToken.None);

        inner.CallCount.Should().Be(2, "the cache key must include algorithmId so identical step shapes across different algorithms don't collide");
    }

    [Fact]
    public async Task ExplainStepsAsync_NullExplanation_IsNotCached()
    {
        var inner = new FakeStepExplanationService(returnNull: true);
        var service = MakeService(inner);
        var step = MakeStep(0, "Push 1", 1);

        await service.ExplainStepsAsync("algo", [step], CancellationToken.None);
        await service.ExplainStepsAsync("algo", [step], CancellationToken.None);

        inner.CallCount.Should().Be(2, "a failed (null) explanation should be retried on the next request, not pinned as a permanent cache entry");
    }

    private sealed class FakeStepExplanationService(bool returnNull = false) : IStepExplanationService
    {
        public int CallCount { get; private set; }
        public List<int> StepsPerCall { get; } = [];

        public Task<IReadOnlyList<string?>> ExplainStepsAsync(
            string algorithmId, IReadOnlyList<AlgorithmStep> steps, CancellationToken cancellationToken)
        {
            CallCount++;
            StepsPerCall.Add(steps.Count);
            IReadOnlyList<string?> result = steps
                .Select(s => returnNull ? null : (string?)$"explained: {s.Action}")
                .ToList();
            return Task.FromResult(result);
        }
    }
}
