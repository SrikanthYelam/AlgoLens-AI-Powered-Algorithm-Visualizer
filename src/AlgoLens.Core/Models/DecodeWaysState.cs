namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot for Decode Ways at a given step. `Table[i]` is the number of ways to decode the
/// first i characters of `S`, filled progressively as each single-digit/two-digit contribution is
/// added into `Table[Index]`. `Segment` is the trailing digit(s) just considered for that
/// contribution; `IsValid` is false only on the dead-end step where neither a single digit nor a
/// two-digit pair was decodable.
/// </summary>
public sealed record DecodeWaysState(
    string S,
    IReadOnlyList<int> Table,
    int Index,
    string Segment,
    bool IsValid,
    int Contribution
);
