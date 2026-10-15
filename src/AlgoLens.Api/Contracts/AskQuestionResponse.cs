namespace AlgoLens.Api.Contracts;

/// <summary>Null when the LLM call failed or no AI provider is configured — see AiQuestionAnsweringService.</summary>
public sealed record AskQuestionResponse(string? Answer);
