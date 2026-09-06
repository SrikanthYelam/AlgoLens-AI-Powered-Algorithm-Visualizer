namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot for Unique Binary Search Trees at a given step. `Table[k]` is the number of
/// structurally unique BSTs over k nodes, filled progressively as each (i, j) root choice's
/// contribution is added into `Table[CurrentI]`.
/// </summary>
public sealed record UniqueBstCountState(
    int N,
    IReadOnlyList<int> Table,
    int CurrentI,
    int CurrentJ,
    int Contribution
);
