namespace AlgoLens.Api.Contracts;

public sealed record SubmitSolutionRequest<TInputRequest>(TInputRequest Input, string Code);
