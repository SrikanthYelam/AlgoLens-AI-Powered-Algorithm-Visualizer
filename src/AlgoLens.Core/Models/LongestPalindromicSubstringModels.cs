namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot for Longest Palindromic Substring at a given step. `Table[i][j]` is true
/// when `s[i..j]` (inclusive) is a palindrome. `I`/`J` name the cell currently being computed
/// (both -1 outside the fill loop). `LongestSoFar` is the longest palindromic substring found
/// by this point in the fill.
/// </summary>
public sealed record LongestPalindromicSubstringState(
    string S,
    IReadOnlyList<IReadOnlyList<bool>> Table,
    int I,
    int J,
    string LongestSoFar
);
