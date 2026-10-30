using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Longest Common Subsequence with the 2D table rolled into a single 1D array, using the same
/// bottom-up row-by-row order as the 2D version — i over text1, j over text2, both from 1. Row i
/// only reads row i-1 and its own earlier columns, so one row suffices: dp[j] holds dp[i-1][j]
/// until row i overwrites it with dp[i][j]. The all-zero start is the table's row 0, and dp[0]
/// stays 0 as column 0. Filling left to right, a mismatch reads dp[j] (still dp[i-1][j]) and
/// dp[j-1] (already dp[i][j-1]); a match needs dp[i-1][j-1], which the previous column's write
/// just destroyed, so it is carried in a scalar `prev` (set to the old dp[j] before each
/// overwrite, and to 0 at the start of a row since dp[i-1][0] is 0). The answer is dp[m]. Unlike
/// the 2D version there is no traceback: with the table gone, only the length survives.
/// </summary>
public sealed class LongestCommonSubsequenceSpaceOptimized : IAlgorithmVisualizer<LongestCommonSubsequenceInput>
{
    public string Id => "longest-common-subsequence-space-optimized";

    public IReadOnlyList<AlgorithmStep> Run(LongestCommonSubsequenceInput input)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;
        var text1 = input.Text1;
        var text2 = input.Text2;

        if (text1.Length == 0 || text2.Length == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "One of the strings is empty; the longest common subsequence is empty.",
                new LongestCommonSubsequenceSpaceOptimizedState(text1, text2, [], -1, -1, null), [], spanLines: 2);
            return steps;
        }

        var dp = new int[text2.Length + 1];

        StepRecorder.Add(steps, ref stepNumber,
            "Base case: with no characters of text1 used yet, every prefix of text2 has an LCS of length 0, so dp[j] = 0 for every j. This one row will be reused for every i.",
            new LongestCommonSubsequenceSpaceOptimizedState(text1, text2, dp.ToList(), -1, -1, null),
            [],
            spanLines: 2);

        for (var i = 1; i <= text1.Length; i++)
        {
            var prev = 0;
            for (var j = 1; j <= text2.Length; j++)
            {
                var temp = dp[j];
                string action;
                if (text1[i - 1] == text2[j - 1])
                {
                    dp[j] = prev + 1;
                    action = $"'{text1[i - 1]}' matches '{text2[j - 1]}': dp[{j}] = prev + 1 = {prev} + 1 = {dp[j]} (prev is the old dp[{j - 1}], i.e. 2D dp[{i - 1}][{j - 1}]).";
                }
                else
                {
                    dp[j] = Math.Max(dp[j], dp[j - 1]);
                    action = $"'{text1[i - 1]}' ≠ '{text2[j - 1]}': dp[{j}] = max(old dp[{j}] = {temp}, dp[{j - 1}] = {dp[j - 1]}) = {dp[j]}.";
                }

                StepRecorder.Add(steps, ref stepNumber, action,
                    new LongestCommonSubsequenceSpaceOptimizedState(text1, text2, dp.ToList(), i, j, prev),
                    [$"{j}"],
                    spanLines: 13);
                prev = temp;
            }
        }

        StepRecorder.Add(steps, ref stepNumber,
            $"Done: the longest common subsequence has length {dp[text2.Length]}.",
            new LongestCommonSubsequenceSpaceOptimizedState(text1, text2, dp.ToList(), -1, -1, null),
            [],
            spanLines: 1);

        return steps;
    }
}
