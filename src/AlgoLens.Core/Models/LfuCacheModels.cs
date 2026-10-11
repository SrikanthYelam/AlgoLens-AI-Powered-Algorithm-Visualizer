namespace AlgoLens.Core.Models;

/// <summary>One get/put call against the cache. `Value` is only set for "put".</summary>
public sealed record LfuCacheOperation(string Op, int Key, int? Value);

public sealed record LfuCacheInput(int Capacity, IReadOnlyList<LfuCacheOperation> Operations);

/// <summary>One live cache slot, for display only — not the internal node representation.</summary>
public sealed record LfuCacheEntry(int Key, int Value, int Freq);

/// <summary>
/// State snapshot for LFU Cache after one operation. `Order` lists every live entry grouped by
/// `Freq` ascending, and most-recently-used first within each frequency (the tie-break order
/// eviction picks from). `MinFreq` is the frequency eviction would currently pull from. `Result` is
/// the value returned by a "get" (null on a miss); `Hit` is only meaningful for "get". `EvictedKey`
/// is set only when a "put" evicted the least-frequently (then least-recently) used entry to make
/// room.
/// </summary>
public sealed record LfuCacheState(
    int Capacity,
    IReadOnlyList<LfuCacheEntry> Order,
    int MinFreq,
    string Operation,
    int Key,
    int? Value,
    int? Result,
    bool Hit,
    int? EvictedKey
);
