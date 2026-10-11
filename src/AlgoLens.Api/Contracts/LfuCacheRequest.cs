namespace AlgoLens.Api.Contracts;

public sealed record LfuCacheOperationRequest(string Op, int Key, int? Value);

public sealed record LfuCacheRequest(int Capacity, IReadOnlyList<LfuCacheOperationRequest> Operations);
