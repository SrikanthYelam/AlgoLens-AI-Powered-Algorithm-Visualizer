namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot for Longest Increasing Subsequence at a given step. `Table[i][j]` is the
/// length of the longest increasing subsequence achievable from index `i` onward, given that
/// the previously included element sits at index `j - 1` (`j == 0` means nothing chosen yet).
/// `I`/`J` name the cell currently being computed (both -1 outside the fill loop).
/// </summary>
public sealed record LongestIncreasingSubsequenceState(
    IReadOnlyList<int> Nums,
    IReadOnlyList<IReadOnlyList<int>> Table,
    int I,
    int J
);
