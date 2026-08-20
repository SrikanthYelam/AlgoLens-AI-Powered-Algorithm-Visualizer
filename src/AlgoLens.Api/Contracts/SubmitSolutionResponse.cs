namespace AlgoLens.Api.Contracts;

public sealed record SubmitSolutionResponse(
    bool CompileSucceeded,
    IReadOnlyList<string> CompileErrors,
    bool RanSuccessfully,
    string? RuntimeError,
    object? YourAnswer,
    object? ExpectedAnswer,
    long ElapsedMilliseconds);
