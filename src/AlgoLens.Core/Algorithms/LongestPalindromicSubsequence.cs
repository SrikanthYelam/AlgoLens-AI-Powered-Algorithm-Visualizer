using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Longest Palindromic Subsequence via interval dynamic programming: dp[i][j] holds the
/// length of the longest palindromic subsequence within s[i..j] (inclusive). Every single
/// character is a base-case palindrome of length 1. The table is then filled by increasing
/// substring length, since dp[i][j] depends on the strictly shorter interval dp[i+1][j-1].
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

        for (var len = 2; len <= n; len++)
        {
            for (var i = 0; i <= n - len; i++)
            {
                var j = i + len - 1;
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
                    spanLines: 13);
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
