namespace AlgoLens.Core.Models;

public sealed record EditDistanceInput(string Word1, string Word2);

/// <summary>
/// State snapshot for Edit Distance at a given step. `Table[i][j]` is the minimum number of
/// insert/delete/replace operations to convert the first `i` characters of `Word1` into the
/// first `j` characters of `Word2`. `Row`/`Col` name the cell currently being computed (both
/// -1 outside the fill loop).
/// </summary>
public sealed record EditDistanceState(
    string Word1,
    string Word2,
    IReadOnlyList<IReadOnlyList<int>> Table,
    int Row,
    int Col
);
