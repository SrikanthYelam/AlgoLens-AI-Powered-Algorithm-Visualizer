namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot for Max Area of Island (Union-Find) at a given step. `Parent` is the flat
/// (`row * Cols + col`) disjoint-set-union parent array over the grid's cells: `-1` means water or
/// land not yet scanned, `Parent[i] == i` means a land cell that is currently the root of its
/// island. `Size[i]` is the island's area, meaningful only at a root. `MaxArea` is the largest
/// island area seen so far.
/// </summary>
public sealed record MaxAreaOfIslandUnionFindState(
    int Rows,
    int Cols,
    IReadOnlyList<int> Parent,
    IReadOnlyList<int> Size,
    int CurrentRow,
    int CurrentCol,
    int MaxArea
);
