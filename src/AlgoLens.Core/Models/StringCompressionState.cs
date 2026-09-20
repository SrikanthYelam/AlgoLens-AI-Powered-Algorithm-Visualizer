namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot for String Compression at a given step. `Chars` is the array as it currently
/// stands — being overwritten in place, so cells at or beyond `Write` are stale leftovers once
/// compression has moved past them. `GroupStart`/`GroupEnd` (inclusive) mark the run the read
/// pointer just consumed (`-1` when none). `WriteStart..Write-1` are the cells written this step
/// (empty when `WriteStart == Write`); `Write` is also the compressed length so far. `Compressed`
/// is `Chars[0..Write)` as a string.
/// </summary>
public sealed record StringCompressionState(
    IReadOnlyList<char> Chars,
    int GroupStart,
    int GroupEnd,
    int WriteStart,
    int Write,
    string Compressed
);
