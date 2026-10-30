namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot for the space-optimized Longest Common Subsequence at a given step. `Dp` is the
/// single rolling row of `Text2.Length + 1` entries: while row `I` (the first `I` characters of
/// `Text1`) is being filled, `Dp[j]` for `j &lt;= J` holds `dp[I][j]` and for `j &gt; J` still holds
/// `dp[I - 1][j]`. `Prev` is the carried-over old `dp[I - 1][J - 1]` (the diagonal neighbor the
/// in-place update would otherwise have overwritten). `I`/`J`/`Prev` describe the cell just
/// computed, and are -1/-1/null outside the fill loop.
/// </summary>
public sealed record LongestCommonSubsequenceSpaceOptimizedState(
    string Text1,
    string Text2,
    IReadOnlyList<int> Dp,
    int I,
    int J,
    int? Prev
);
