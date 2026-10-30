using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Longest Palindromic Subsequence with the interval DP table rolled into a single 1D array,
/// using the same bottom-up order as the 2D version — i from n-2 down to 0, j from i+1 up to n-1.
/// Row i only ever reads row i+1 and its own earlier columns, so one row suffices: dp[j] holds
/// dp[i+1][j] until row i overwrites it with dp[i][j]. Starting from dp[k] = 1 for every k (the
/// base-case diagonal), dp[i] is never written before row i, so it is already dp[i][i] = 1 when
/// row i starts. Filling left to right, a mismatch reads dp[j] (still dp[i+1][j]) and dp[j-1]
/// (already dp[i][j-1]); a match needs dp[i+1][j-1], which the previous column's write just
/// destroyed, so it is carried in a scalar `prev` (set to the old dp[j] before each overwrite, and
/// to 0 at the start of a row since the lower-triangle cell dp[i+1][i] is 0). The answer is
/// dp[n-1], which at the end holds what the 2D table calls dp[0][n-1].
/// </summary>
public sealed class LongestPalindromicSubsequenceSpaceOptimized : IAlgorithmVisualizer<string>
{
    public string Id => "longest-palindromic-subsequence-space-optimized";

    public IReadOnlyList<AlgorithmStep> Run(string s)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (s.Length == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "Empty input; the longest palindromic subsequence is empty.",
                new LongestPalindromicSubsequenceSpaceOptimizedState("", [], -1, -1, null), [], spanLines: 2);
            return steps;
        }

        var n = s.Length;
        var dp = new int[n];
        Array.Fill(dp, 1);

        StepRecorder.Add(steps, ref stepNumber,
            "Base case: every single character is a palindrome of length 1, so dp[k] = 1 for every k. This one row will be reused for every i.",
            new LongestPalindromicSubsequenceSpaceOptimizedState(s, dp.ToList(), -1, -1, null),
            Enumerable.Range(0, n).Select(k => $"{k}").ToList(),
            spanLines: 3);

        for (var i = n - 2; i >= 0; i--)
        {
            var prev = 0;
            for (var j = i + 1; j < n; j++)
            {
                var temp = dp[j];
                string action;
                if (s[i] == s[j])
                {
                    dp[j] = prev + 2;
                    action = $"'{s[i]}' matches '{s[j]}': dp[{j}] = prev + 2 = {prev} + 2 = {dp[j]} (prev is the old dp[{j - 1}], i.e. 2D dp[{i + 1}][{j - 1}]).";
                }
                else
                {
                    dp[j] = Math.Max(dp[j], dp[j - 1]);
                    action = $"'{s[i]}' ≠ '{s[j]}': dp[{j}] = max(old dp[{j}] = {temp}, dp[{j - 1}] = {dp[j - 1]}) = {dp[j]}.";
                }

                StepRecorder.Add(steps, ref stepNumber, action,
                    new LongestPalindromicSubsequenceSpaceOptimizedState(s, dp.ToList(), i, j, prev),
                    [$"{j}"],
                    spanLines: 13);
                prev = temp;
            }
        }

        StepRecorder.Add(steps, ref stepNumber,
            $"Done: the longest palindromic subsequence has length {dp[n - 1]}.",
            new LongestPalindromicSubsequenceSpaceOptimizedState(s, dp.ToList(), -1, -1, null),
            [],
            spanLines: 1);

        return steps;
    }
}
