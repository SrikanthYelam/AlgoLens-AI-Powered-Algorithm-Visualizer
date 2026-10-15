using System.Text.Json;
using AlgoLens.Core.Models;
using Microsoft.Extensions.AI;

namespace AlgoLens.Api.Services;

/// <summary>
/// Answers a learner's free-form question about one step via an injected <see cref="IChatClient"/> —
/// the same provider-agnostic abstraction <see cref="AiStepExplanationService"/> uses, so swapping AI
/// providers still only means changing what Program.cs registers. Unlike that service, this one wants
/// a single free-text answer rather than an array of explanations, so it skips the structured-JSON
/// response format and just reads <c>response.Text</c> directly.
/// </summary>
public sealed class AiQuestionAnsweringService : IQuestionAnsweringService
{
    private readonly IChatClient _chatClient;
    private readonly ILogger<AiQuestionAnsweringService> _logger;

    public AiQuestionAnsweringService(IChatClient chatClient, ILogger<AiQuestionAnsweringService> logger)
    {
        _chatClient = chatClient;
        _logger = logger;
    }

    public async Task<string?> AskAsync(
        string algorithmId,
        string? algorithmName,
        string? algorithmDescription,
        AlgorithmStep step,
        string question,
        CancellationToken cancellationToken)
    {
        try
        {
            var stepJson = JsonSerializer.Serialize(new { step.Action, step.State, step.Highlights });

            var prompt = $"""
                You are helping someone learn an algorithm for a coding interview. They are looking at
                one specific step of a running visualization and have a question about it.

                Algorithm: {algorithmName ?? algorithmId}
                {(string.IsNullOrWhiteSpace(algorithmDescription) ? "" : $"Description: {algorithmDescription}")}

                The current step (a mechanical "action" description plus a "state" snapshot of the data
                structures at that point):
                {stepJson}

                Question: "{question}"

                Answer in a few short sentences, grounded in the step above. If the question can't be
                answered from this context, say so honestly rather than guessing.
                """;

            var options = new ChatOptions { MaxOutputTokens = 512 };
            var response = await _chatClient.GetResponseAsync(prompt, options, cancellationToken);

            var text = response.Text;
            return string.IsNullOrWhiteSpace(text) ? null : text.Trim();
        }
        catch (Exception ex)
        {
            // Same external-service-boundary resilience every other AI call site in this app uses:
            // degrade to null rather than failing the request.
            _logger.LogWarning(ex, "Failed to answer question for {AlgorithmId}; returning no answer", algorithmId);
            return null;
        }
    }
}
