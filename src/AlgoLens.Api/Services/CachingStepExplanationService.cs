using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using AlgoLens.Core.Models;
using Microsoft.Extensions.Caching.Memory;

namespace AlgoLens.Api.Services;

/// <summary>
/// Decorates an <see cref="IStepExplanationService"/> with an in-memory cache keyed by a content
/// hash of <c>(algorithmId, step.Action, step.State, step.Highlights)</c> — not the step number,
/// so two runs that reach an identical state (e.g. the same default input run twice, or a single
/// step regenerated via <c>/explain</c> that matches a step already explained during a full run)
/// share a cache entry rather than re-asking OpenAI for text it has already generated.
///
/// A batch request only forwards its cache misses upstream: <see cref="ExplainStepsAsync"/> splits
/// the incoming steps into hits (served straight from cache) and misses (sent to <paramref
/// name="inner"/> as a single sub-batch, preserving order), then stitches the two back together.
/// Only successful (non-null) explanations are cached, so an OpenAI failure — including the
/// "no API key configured" case every other AI-facing code path already tolerates — is retried on
/// the next request instead of being pinned as a permanent miss.
/// </summary>
public sealed class CachingStepExplanationService : IStepExplanationService
{
    private readonly IStepExplanationService _inner;
    private readonly IMemoryCache _cache;
    private readonly ILogger<CachingStepExplanationService> _logger;

    public CachingStepExplanationService(
        IStepExplanationService inner, IMemoryCache cache, ILogger<CachingStepExplanationService> logger)
    {
        _inner = inner;
        _cache = cache;
        _logger = logger;
    }

    public async Task<IReadOnlyList<string?>> ExplainStepsAsync(
        string algorithmId, IReadOnlyList<AlgorithmStep> steps, CancellationToken cancellationToken)
    {
        if (steps.Count == 0)
        {
            return [];
        }

        var keys = steps.Select(step => BuildCacheKey(algorithmId, step)).ToList();
        var results = new string?[steps.Count];
        var missIndexes = new List<int>();

        for (var i = 0; i < steps.Count; i++)
        {
            if (_cache.TryGetValue(keys[i], out string? cached))
            {
                results[i] = cached;
            }
            else
            {
                missIndexes.Add(i);
            }
        }

        if (missIndexes.Count > 0)
        {
            var missSteps = missIndexes.Select(i => steps[i]).ToList();
            var freshExplanations = await _inner.ExplainStepsAsync(algorithmId, missSteps, cancellationToken);

            for (var i = 0; i < missIndexes.Count; i++)
            {
                var explanation = i < freshExplanations.Count ? freshExplanations[i] : null;
                var index = missIndexes[i];
                results[index] = explanation;

                if (explanation is not null)
                {
                    _cache.Set(keys[index], explanation, CacheEntryOptions());
                }
            }
        }

        _logger.LogInformation(
            "Explanation cache for {AlgorithmId}: {HitCount} hit(s), {MissCount} miss(es)",
            algorithmId, steps.Count - missIndexes.Count, missIndexes.Count);

        return results;
    }

    private static MemoryCacheEntryOptions CacheEntryOptions() => new()
    {
        SlidingExpiration = TimeSpan.FromHours(6),
        Size = 1,
    };

    private static string BuildCacheKey(string algorithmId, AlgorithmStep step)
    {
        // step.State's declared type is `object`; System.Text.Json serializes properties
        // declared as `object` using the value's runtime type, so this reflects the concrete
        // *State record's actual fields rather than an empty `{}`.
        var content = JsonSerializer.Serialize(new { step.Action, step.State, step.Highlights });
        var hash = SHA256.HashData(Encoding.UTF8.GetBytes(algorithmId + "|" + content));
        return $"explanation:{algorithmId}:{Convert.ToHexString(hash)}";
    }
}
