namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot for N-Queens at a given step. `QueenColumns[row]` is the
/// column of the queen placed in that row, for rows filled so far.
/// </summary>
public sealed record NQueensState(
    int BoardSize,
    IReadOnlyList<int> QueenColumns,
    IReadOnlyList<IReadOnlyList<int>> Solutions
);
