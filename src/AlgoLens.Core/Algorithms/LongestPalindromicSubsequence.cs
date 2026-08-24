using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Longest Palindromic Subsequence via interval dynamic programming: dp[i][j] holds the
/// length of the longest palindromic subsequence within s[i..j] (inclusive). Every single
/// character is a base-case palindrome of length 1. The table is then filled bottom-up by
/// row — i from n-2 down to 0, j from i+1 up to n-1 — since dp[i][j] depends on dp[i+1][j-1],
/// dp[i+1][j], and dp[i][j-1], all of which sit in an already-filled row or an earlier column
/// of the current row.
/// </summary>
public sealed class LongestPalindromicSubsequence : IAlgorithmVisualizer<string>
{
    public string Id => "longest-palindromic-subsequence";

    public IReadOnlyList<AlgorithmStep> Run(string s)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (s.Length == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "Empty input; the longest palindromic subsequence is empty.",
                new LongestPalindromicSubsequenceState("", [], -1, -1), [], spanLines: 2);
            return steps;
        }

        var n = s.Length;
        var table = new int[n][];
        for (var i = 0; i < n; i++)
        {
            table[i] = new int[n];
        }

        IReadOnlyList<IReadOnlyList<int>> Snapshot() =>
            table.Select(row => (IReadOnlyList<int>)row.ToList()).ToList();

        for (var i = 0; i < n; i++)
        {
            table[i][i] = 1;
            StepRecorder.Add(steps, ref stepNumber,
                $"Base case: a single character \"{s[i]}\" is a palindrome of length 1, so dp[{i}][{i}] = 1.",
                new LongestPalindromicSubsequenceState(s, Snapshot(), i, i),
                [$"{i},{i}"],
                spanLines: 1);
        }

        for (var i = n - 2; i >= 0; i--)
        {
            for (var j = i + 1; j < n; j++)
            {
                string action;
                if (s[i] == s[j])
                {
                    table[i][j] = table[i + 1][j - 1] + 2;
                    action = $"'{s[i]}' matches '{s[j]}': dp[{i}][{j}] = dp[{i + 1}][{j - 1}] + 2 = {table[i][j]}.";
                }
                else
                {
                    table[i][j] = Math.Max(table[i + 1][j], table[i][j - 1]);
                    action = $"'{s[i]}' ≠ '{s[j]}': dp[{i}][{j}] = max(dp[{i + 1}][{j}], dp[{i}][{j - 1}]) = {table[i][j]}.";
                }

                StepRecorder.Add(steps, ref stepNumber, action,
                    new LongestPalindromicSubsequenceState(s, Snapshot(), i, j),
                    [$"{i},{j}"],
                    spanLines: 12);
            }
        }

        StepRecorder.Add(steps, ref stepNumber,
            $"Done: the longest palindromic subsequence has length {table[0][n - 1]}.",
            new LongestPalindromicSubsequenceState(s, Snapshot(), -1, -1),
            [],
            spanLines: 1);

        return steps;
    }
}
