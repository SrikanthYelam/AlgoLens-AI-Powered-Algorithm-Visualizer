using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Longest Increasing Subsequence via 2D bottom-up dynamic programming: dp[i][j] holds the
/// length of the longest increasing subsequence achievable from nums[i..] given that the
/// previously included element sits at index j-1 (j == 0 means nothing has been included
/// yet). At each index i, either skip nums[i] (dp[i+1][j]) or, if it's greater than the
/// previous pick, take it and extend with dp[i+1][i+1] — the new "previous index" becomes i,
/// so the lookup shifts to column i+1. The table is filled bottom-up over i from n down to 0,
/// since row i always depends on the already-known row i+1; row n (nothing left to consider)
/// is the implicit all-zero boundary. The answer is dp[0][0]: the best subsequence over the
/// whole array with no previous-element constraint yet.
/// </summary>
public sealed class LongestIncreasingSubsequence : IAlgorithmVisualizer<IReadOnlyList<int>>
{
    public string Id => "longest-increasing-subsequence";

    public IReadOnlyList<AlgorithmStep> Run(IReadOnlyList<int> nums)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (nums.Count == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "Empty input; the longest increasing subsequence has length 0.",
                new LongestIncreasingSubsequenceState([], [], -1, -1), [], spanLines: 2);
            return steps;
        }

        var n = nums.Count;
        var table = new int[n + 1][];
        for (var i = 0; i <= n; i++)
        {
            table[i] = new int[n + 1];
        }

        IReadOnlyList<IReadOnlyList<int>> Snapshot() =>
            table.Select(row => (IReadOnlyList<int>)row.ToList()).ToList();

        for (var i = n - 1; i >= 0; i--)
        {
            for (var j = 0; j <= i; j++)
            {
                var skip = table[i + 1][j];
                var canTake = j == 0 || nums[i] > nums[j - 1];
                var take = canTake ? 1 + table[i + 1][i + 1] : 0;
                table[i][j] = Math.Max(skip, take);

                var action = canTake
                    ? $"dp[{i}][{j}] = max(skip = dp[{i + 1}][{j}] = {skip}, take {nums[i]} = 1 + dp[{i + 1}][{i + 1}] = {take}) = {table[i][j]}."
                    : $"nums[{i}]={nums[i]} can't follow the previous pick: dp[{i}][{j}] = dp[{i + 1}][{j}] (skip only) = {table[i][j]}.";

                StepRecorder.Add(steps, ref stepNumber, action,
                    new LongestIncreasingSubsequenceState(nums.ToList(), Snapshot(), i, j),
                    [$"{i},{j}"],
                    spanLines: 9);
            }
        }

        StepRecorder.Add(steps, ref stepNumber,
            $"Done: the longest increasing subsequence has length {table[0][0]}.",
            new LongestIncreasingSubsequenceState(nums.ToList(), Snapshot(), -1, -1), [], spanLines: 1);

        return steps;
    }
}
