using AlgoLens.Core.Models;

namespace AlgoLens.Api.Services;

/// <summary>
/// Answers a free-form question about one step of a running algorithm.
/// </summary>
public interface IQuestionAnsweringService
{
    Task<string?> AskAsync(
        string algorithmId,
        string? algorithmName,
        string? algorithmDescription,
        AlgorithmStep step,
        string question,
        CancellationToken cancellationToken);
}
