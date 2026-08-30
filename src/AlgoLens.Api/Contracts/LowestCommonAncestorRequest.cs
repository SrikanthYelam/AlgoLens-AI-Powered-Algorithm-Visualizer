namespace AlgoLens.Api.Contracts;

public sealed record LowestCommonAncestorRequest(IReadOnlyList<int?> Values, int P, int Q);
