using System.Text;
using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Longest Common Subsequence via bottom-up 2D dynamic programming: dp[i][j] holds the
/// LCS length between the first i characters of text1 and the first j characters of
/// text2. Matching characters extend the diagonal predecessor; otherwise the cell takes
/// the better of the cell above or to the left. After the table is filled, a traceback
/// from the bottom-right corner recovers the actual subsequence, not just its length.
/// </summary>
public sealed class LongestCommonSubsequence : IAlgorithmVisualizer<LongestCommonSubsequenceInput>
{
    public string Id => "longest-common-subsequence";

    public IReadOnlyList<AlgorithmStep> Run(LongestCommonSubsequenceInput input)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;
        var text1 = input.Text1;
        var text2 = input.Text2;

        if (text1.Length == 0 || text2.Length == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "One of the strings is empty; the longest common subsequence is empty.",
                new LongestCommonSubsequenceState(text1, text2, [], -1, -1, ""), [], spanLines: 2);
            return steps;
        }

        var rows = text1.Length + 1;
        var cols = text2.Length + 1;
        var table = new int[rows][];
        for (var r = 0; r < rows; r++)
        {
            table[r] = new int[cols];
        }

        IReadOnlyList<IReadOnlyList<int>> Snapshot() =>
            table.Select(row => (IReadOnlyList<int>)row.ToList()).ToList();

        for (var i = 1; i < rows; i++)
        {
            for (var j = 1; j < cols; j++)
            {
                string action;
                if (text1[i - 1] == text2[j - 1])
                {
                    table[i][j] = table[i - 1][j - 1] + 1;
                    action = $"'{text1[i - 1]}' matches '{text2[j - 1]}': dp[{i}][{j}] = dp[{i - 1}][{j - 1}] + 1 = {table[i][j]}.";
                }
                else
                {
                    table[i][j] = Math.Max(table[i - 1][j], table[i][j - 1]);
                    action = $"'{text1[i - 1]}' ≠ '{text2[j - 1]}': dp[{i}][{j}] = max(dp[{i - 1}][{j}], dp[{i}][{j - 1}]) = {table[i][j]}.";
                }

                StepRecorder.Add(steps, ref stepNumber, action,
                    new LongestCommonSubsequenceState(text1, text2, Snapshot(), i, j, ""),
                    [$"{i},{j}"],
                    spanLines: 12);
            }
        }

        var path = new StringBuilder();
        var row = rows - 1;
        var col = cols - 1;
        while (row > 0 && col > 0)
        {
            if (text1[row - 1] == text2[col - 1])
            {
                path.Insert(0, text1[row - 1]);
                StepRecorder.Add(steps, ref stepNumber,
                    $"Trace back: '{text1[row - 1]}' matches — include it, move diagonally to dp[{row - 1}][{col - 1}].",
                    new LongestCommonSubsequenceState(text1, text2, Snapshot(), row, col, path.ToString()),
                    [$"{row},{col}"],
                    spanLines: 3);
                row--;
                col--;
            }
            else if (table[row - 1][col] >= table[row][col - 1])
            {
                StepRecorder.Add(steps, ref stepNumber,
                    $"Trace back: move up to dp[{row - 1}][{col}] (≥ dp[{row}][{col - 1}]).",
                    new LongestCommonSubsequenceState(text1, text2, Snapshot(), row, col, path.ToString()),
                    [$"{row},{col}"],
                    spanLines: 2);
                row--;
            }
            else
            {
                StepRecorder.Add(steps, ref stepNumber,
                    $"Trace back: move left to dp[{row}][{col - 1}].",
                    new LongestCommonSubsequenceState(text1, text2, Snapshot(), row, col, path.ToString()),
                    [$"{row},{col}"],
                    spanLines: 2);
                col--;
            }
        }

        StepRecorder.Add(steps, ref stepNumber,
            $"Done: the longest common subsequence is \"{path}\" (length {path.Length}).",
            new LongestCommonSubsequenceState(text1, text2, Snapshot(), -1, -1, path.ToString()),
            [],
            spanLines: 1);

        return steps;
    }
}
