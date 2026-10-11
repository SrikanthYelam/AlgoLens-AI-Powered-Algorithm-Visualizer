namespace AlgoLens.Core.Models;

/// <summary>One get/put call against the cache. `Value` is only set for "put".</summary>
public sealed record LruCacheOperation(string Op, int Key, int? Value);

public sealed record LruCacheInput(int Capacity, IReadOnlyList<LruCacheOperation> Operations);

/// <summary>One live cache slot, for display only — not the internal node representation.</summary>
public sealed record LruCacheEntry(int Key, int Value);

/// <summary>
/// State snapshot for LRU Cache after one operation. `Order` lists every live entry from
/// most-recently-used to least-recently-used. `Result` is the value returned by a "get" (null on a
/// miss); `Hit` is only meaningful for "get". `EvictedKey` is set only when a "put" evicted the
/// least-recently-used entry to make room.
/// </summary>
public sealed record LruCacheState(
    int Capacity,
    IReadOnlyList<LruCacheEntry> Order,
    string Operation,
    int Key,
    int? Value,
    int? Result,
    bool Hit,
    int? EvictedKey
);
