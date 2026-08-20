namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot for Longest Palindromic Subsequence at a given step. The table is only
/// meaningfully filled on and above the diagonal (row &lt;= col); cells below it stay at
/// their default zero.
/// </summary>
public sealed record LongestPalindromicSubsequenceState(
    string S,
    IReadOnlyList<IReadOnlyList<int>> Table,
    int I,
    int J
);
