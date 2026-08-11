using System.Text.Json;
using AlgoLens.Core.Models;
using OpenAI.Chat;

namespace AlgoLens.Api.Services;

/// <summary>
/// Generates per-step explanations via the OpenAI Chat Completions API, using structured
/// JSON output (a strict JSON schema response format) so the response reliably parses
/// into one explanation per step.
/// </summary>
public sealed class OpenAiStepExplanationService : IStepExplanationService
{
    private static readonly JsonSerializerOptions DeserializeOptions = new() { PropertyNameCaseInsensitive = true };

    private readonly ChatClient _client;
    private readonly ILogger<OpenAiStepExplanationService> _logger;

    public OpenAiStepExplanationService(ChatClient client, ILogger<OpenAiStepExplanationService> logger)
    {
        _client = client;
        _logger = logger;
    }

    public async Task<IReadOnlyList<string?>> ExplainStepsAsync(
        string algorithmId, IReadOnlyList<AlgorithmStep> steps, CancellationToken cancellationToken)
    {
        if (steps.Count == 0)
        {
            return [];
        }

        try
        {
            var stepsJson = JsonSerializer.Serialize(steps.Select(s => new { s.StepNumber, s.Action, s.State }));

            var prompt = $"""
                You are explaining a running algorithm, step by step, to someone learning it for a coding interview.
                Algorithm: {algorithmId}

                Below is a JSON array of the algorithm's execution steps. Each has a mechanical "action"
                description and a "state" snapshot of the data structures at that point.

                {stepsJson}

                For each step in order, write ONE short (1-2 sentence) plain-English explanation of what
                happened and why. Return exactly {steps.Count} explanations, in the same order as the steps.
                """;

            var options = new ChatCompletionOptions
            {
                MaxOutputTokenCount = 4096,
                ResponseFormat = ChatResponseFormat.CreateJsonSchemaFormat(
                    "step_explanations",
                    BinaryData.FromBytes(BuildExplanationsSchema()),
                    jsonSchemaIsStrict: true),
            };

            var response = await _client.CompleteChatAsync([new UserChatMessage(prompt)], options, cancellationToken);

            var text = response.Value.Content
                .Select(part => part.Text)
                .FirstOrDefault(t => !string.IsNullOrEmpty(t));

            if (text is null)
            {
                _logger.LogWarning("OpenAI returned no text content when explaining steps for {AlgorithmId}", algorithmId);
                return NullExplanations(steps.Count);
            }

            var explanations = JsonSerializer.Deserialize<ExplanationsPayload>(text, DeserializeOptions)?.Explanations;
            if (explanations is null)
            {
                _logger.LogWarning("Could not parse explanations JSON for {AlgorithmId}", algorithmId);
                return NullExplanations(steps.Count);
            }

            // Defensive: pad/truncate in case the model under/over-produces despite the schema.
            return Enumerable.Range(0, steps.Count)
                .Select(i => i < explanations.Count ? explanations[i] : null)
                .ToList();
        }
        catch (Exception ex)
        {
            // This is an external-service boundary (network/auth/model failure) — degrade
            // gracefully so the algorithm/visualization response still succeeds without AI text.
            _logger.LogWarning(ex, "Failed to generate AI explanations for {AlgorithmId}; continuing without them", algorithmId);
            return NullExplanations(steps.Count);
        }
    }

    private static IReadOnlyList<string?> NullExplanations(int count) =>
        Enumerable.Repeat<string?>(null, count).ToList();

    private static byte[] BuildExplanationsSchema() =>
        JsonSerializer.SerializeToUtf8Bytes(new
        {
            type = "object",
            properties = new
            {
                explanations = new
                {
                    type = "array",
                    items = new { type = "string" },
                },
            },
            required = new[] { "explanations" },
            additionalProperties = false,
        });

    private sealed record ExplanationsPayload(List<string>? Explanations);
}
