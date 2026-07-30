using System.Text.Json;
using AlgoLens.Core.Models;
using Anthropic;
using Anthropic.Models.Messages;

namespace AlgoLens.Api.Services;

/// <summary>
/// Generates per-step explanations via the Claude Messages API, using structured
/// JSON output so the response reliably parses into one explanation per step.
/// </summary>
public sealed class ClaudeStepExplanationService : IStepExplanationService
{
    private const string Model = "claude-sonnet-5";

    private readonly AnthropicClient _client;
    private readonly ILogger<ClaudeStepExplanationService> _logger;

    public ClaudeStepExplanationService(AnthropicClient client, ILogger<ClaudeStepExplanationService> logger)
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

            var response = await _client.Messages.Create(new MessageCreateParams
            {
                Model = Model,
                MaxTokens = 4096,
                OutputConfig = new OutputConfig
                {
                    Format = new JsonOutputFormat { Schema = BuildExplanationsSchema() },
                },
                Messages = [new() { Role = Role.User, Content = prompt }],
            });

            var text = response.Content
                .Select(block => block.Value)
                .OfType<TextBlock>()
                .Select(block => block.Text)
                .FirstOrDefault();

            if (text is null)
            {
                _logger.LogWarning("Claude returned no text content when explaining steps for {AlgorithmId}", algorithmId);
                return NullExplanations(steps.Count);
            }

            var explanations = JsonSerializer.Deserialize<ExplanationsPayload>(text)?.Explanations;
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

    private static Dictionary<string, JsonElement> BuildExplanationsSchema() => new()
    {
        ["type"] = JsonSerializer.SerializeToElement("object"),
        ["properties"] = JsonSerializer.SerializeToElement(new
        {
            explanations = new
            {
                type = "array",
                items = new { type = "string" },
            },
        }),
        ["required"] = JsonSerializer.SerializeToElement(new[] { "explanations" }),
        ["additionalProperties"] = JsonSerializer.SerializeToElement(false),
    };

    private sealed record ExplanationsPayload(List<string>? Explanations);
}
