namespace AlgoLens.Core.Models;

/// <summary>
/// Input for Number of Islands II: an initially all-water `Rows` x `Cols` grid, and the ordered
/// `[row, col]` positions where land is added one at a time.
/// </summary>
public sealed record NumberOfIslandsIIInput(int Rows, int Cols, int[][] Positions);

/// <summary>
/// State snapshot for Number of Islands II at a given step. `Parent` is the flat (`row * Cols +
/// col`) disjoint-set-union parent array over the grid's cells: `-1` means the cell is still
/// water, `Parent[i] == i` means it is land and currently the root of its island. `IslandCount` is
/// the running island count; `Counts` is the answer built so far — one entry per position already
/// fully processed.
/// </summary>
public sealed record NumberOfIslandsIIState(
    int Rows,
    int Cols,
    IReadOnlyList<int> Parent,
    int CurrentRow,
    int CurrentCol,
    int IslandCount,
    IReadOnlyList<int> Counts
);
