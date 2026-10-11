namespace AlgoLens.Api.Contracts;

public sealed record LruCacheOperationRequest(string Op, int Key, int? Value);

public sealed record LruCacheRequest(int Capacity, IReadOnlyList<LruCacheOperationRequest> Operations);
