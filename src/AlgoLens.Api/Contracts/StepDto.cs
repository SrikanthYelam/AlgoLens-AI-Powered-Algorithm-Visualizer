namespace AlgoLens.Api.Contracts;

public sealed record StepDto(
    int StepNumber,
    string Action,
    object State,
    IReadOnlyList<string> Highlights,
    string? Explanation);
