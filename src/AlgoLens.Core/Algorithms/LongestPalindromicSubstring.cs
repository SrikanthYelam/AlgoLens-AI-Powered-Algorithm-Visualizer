using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Longest Palindromic Substring via interval dynamic programming: dp[i][j] is true when
/// s[i..j] (inclusive) is a palindrome. Every single character is a base-case palindrome. A
/// two-character span is a palindrome exactly when its two characters match — there is no
/// shorter inner interval to check, so that case is handled explicitly rather than left to a
/// default value (unlike Longest Palindromic Subsequence's length table, a boolean table
/// can't safely default an unset inner cell to "true"). Longer spans extend a known-palindrome
/// inner interval only when their own two endpoints also match. The table is filled bottom-up
/// by row — i from n-2 down to 0, j from i+1 up to n-1 — since dp[i][j] depends on dp[i+1][j-1],
/// which sits in the row directly below. The longest palindrome found so far is tracked
/// directly as each cell is computed, so the final answer is already known once the fill
/// finishes.
/// </summary>
public sealed class LongestPalindromicSubstring : IAlgorithmVisualizer<string>
{
    public string Id => "longest-palindromic-substring";

    public IReadOnlyList<AlgorithmStep> Run(string s)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (s.Length == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "Empty input; the longest palindromic substring is empty.",
                new LongestPalindromicSubstringState("", [], -1, -1, ""), [], spanLines: 2);
            return steps;
        }

        var n = s.Length;
        var table = new bool[n][];
        for (var i = 0; i < n; i++)
        {
            table[i] = new bool[n];
        }

        var bestStart = 0;
        var bestLength = 1;

        IReadOnlyList<IReadOnlyList<bool>> Snapshot() =>
            table.Select(row => (IReadOnlyList<bool>)row.ToList()).ToList();

        for (var i = 0; i < n; i++)
        {
            table[i][i] = true;
            StepRecorder.Add(steps, ref stepNumber,
                $"Base case: a single character \"{s[i]}\" is always a palindrome, so dp[{i}][{i}] = true.",
                new LongestPalindromicSubstringState(s, Snapshot(), i, i, s.Substring(bestStart, bestLength)),
                [$"{i},{i}"],
                spanLines: 1);
        }

        for (var i = n - 2; i >= 0; i--)
        {
            for (var j = i + 1; j < n; j++)
            {
                var len = j - i + 1;
                string action;
                if (s[i] == s[j] && (len == 2 || table[i + 1][j - 1]))
                {
                    table[i][j] = true;
                    action = len == 2
                        ? $"'{s[i]}' matches '{s[j]}': dp[{i}][{j}] = true."
                        : $"'{s[i]}' matches '{s[j]}' and the inside \"{s.Substring(i + 1, len - 2)}\" is a palindrome: dp[{i}][{j}] = true.";

                    if (len > bestLength)
                    {
                        bestStart = i;
                        bestLength = len;
                        action += $" New longest: \"{s.Substring(bestStart, bestLength)}\".";
                    }
                }
                else
                {
                    table[i][j] = false;
                    action = s[i] != s[j]
                        ? $"'{s[i]}' ≠ '{s[j]}': dp[{i}][{j}] = false."
                        : $"'{s[i]}' matches '{s[j]}' but the inside \"{s.Substring(i + 1, len - 2)}\" isn't a palindrome: dp[{i}][{j}] = false.";
                }

                StepRecorder.Add(steps, ref stepNumber, action,
                    new LongestPalindromicSubstringState(s, Snapshot(), i, j, s.Substring(bestStart, bestLength)),
                    [$"{i},{j}"],
                    spanLines: 24);
            }
        }

        StepRecorder.Add(steps, ref stepNumber,
            $"Done: the longest palindromic substring is \"{s.Substring(bestStart, bestLength)}\" (length {bestLength}).",
            new LongestPalindromicSubstringState(s, Snapshot(), -1, -1, s.Substring(bestStart, bestLength)),
            [],
            spanLines: 1);

        return steps;
    }
}
