namespace AlgoLens.Api.Contracts;

public sealed record AccountsMergeRequest(IReadOnlyList<IReadOnlyList<string>> Accounts);
