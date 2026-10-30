namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot for the space-optimized Longest Palindromic Subsequence at a given step. `Dp`
/// is the single rolling row: while row `I` is being filled, `Dp[j]` for `j &gt;= I` holds
/// `dp[I][j]` once computed and `dp[I + 1][j]` before that, and `Dp[k]` for `k &lt; I` still holds
/// its untouched base-case 1. `Prev` is the carried-over old `dp[I + 1][J - 1]` (the diagonal
/// neighbor the in-place update would otherwise have overwritten). `I`/`J`/`Prev` describe the
/// cell just computed, and are -1/-1/null outside the fill loops.
/// </summary>
public sealed record LongestPalindromicSubsequenceSpaceOptimizedState(
    string S,
    IReadOnlyList<int> Dp,
    int I,
    int J,
    int? Prev
);
