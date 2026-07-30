using AlgoLens.Core.Models;

namespace AlgoLens.Api.Services;

/// <summary>
/// Generates a plain-English explanation for each step of an algorithm's execution.
/// </summary>
public interface IStepExplanationService
{
    Task<IReadOnlyList<string?>> ExplainStepsAsync(
        string algorithmId, IReadOnlyList<AlgorithmStep> steps, CancellationToken cancellationToken);
}
