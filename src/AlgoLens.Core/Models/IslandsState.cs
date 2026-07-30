namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot for Number of Islands at a given step. `Visited` is a
/// parallel 0/1 grid marking cells folded into an island so far.
/// </summary>
public sealed record IslandsState(
    IReadOnlyList<IReadOnlyList<int>> Grid,
    IReadOnlyList<IReadOnlyList<int>> Visited,
    int IslandCount,
    int CurrentRow,
    int CurrentCol
);
