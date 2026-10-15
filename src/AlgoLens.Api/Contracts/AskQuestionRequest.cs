namespace AlgoLens.Api.Contracts;

/// <summary>
/// A free-form question about one step of an algorithm's execution. <see cref="Step"/> carries the
/// context the LLM needs to answer ("the test case" — its action/state/highlights at that point);
/// <see cref="AlgorithmName"/>/<see cref="AlgorithmDescription"/> are optional framing the frontend
/// already has in its registry entry ("the problem") and passes along rather than the API
/// maintaining its own duplicate copy of every algorithm's description.
/// </summary>
public sealed record AskQuestionRequest(
    string Question,
    StepDto Step,
    string? AlgorithmName,
    string? AlgorithmDescription);
