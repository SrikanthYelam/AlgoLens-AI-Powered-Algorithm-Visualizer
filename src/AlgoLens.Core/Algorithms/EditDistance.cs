using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Edit Distance via bottom-up 2D dynamic programming: dp[i][j] holds the minimum number of
/// insert/delete/replace operations to turn the first i characters of word1 into the first j
/// characters of word2. Converting a prefix of word1 to an empty word2 costs i deletions
/// (dp[i][0] = i); converting an empty word1 into a prefix of word2 costs j insertions
/// (dp[0][j] = j) — both filled explicitly as base cases before the main table fill (unlike
/// Longest Common Subsequence, these boundaries aren't zero, so they can't be left to C#'s
/// default array initialization). When the two boundary characters already match, no
/// operation is needed and the cell simply inherits the diagonal predecessor; otherwise it
/// costs one operation (replace, delete, or insert) plus whichever of the three neighboring
/// subproblems is cheapest. Filling row/column 0 handles empty word1/word2 with no
/// special-case branch, the same trick Largest Rectangle in Histogram uses for empty input.
/// </summary>
public sealed class EditDistance : IAlgorithmVisualizer<EditDistanceInput>
{
    public string Id => "edit-distance";

    public IReadOnlyList<AlgorithmStep> Run(EditDistanceInput input)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;
        var word1 = input.Word1;
        var word2 = input.Word2;

        var rows = word1.Length + 1;
        var cols = word2.Length + 1;
        var table = new int[rows][];
        for (var r = 0; r < rows; r++)
        {
            table[r] = new int[cols];
        }

        IReadOnlyList<IReadOnlyList<int>> Snapshot() =>
            table.Select(row => (IReadOnlyList<int>)row.ToList()).ToList();

        for (var i = 0; i < rows; i++)
        {
            table[i][0] = i;
            StepRecorder.Add(steps, ref stepNumber,
                $"Base case: turning the first {i} character(s) of word1 into an empty word2 takes {i} deletion(s), so dp[{i}][0] = {i}.",
                new EditDistanceState(word1, word2, Snapshot(), i, 0),
                [$"{i},0"],
                spanLines: 1);
        }

        for (var j = 1; j < cols; j++)
        {
            table[0][j] = j;
            StepRecorder.Add(steps, ref stepNumber,
                $"Base case: turning an empty word1 into the first {j} character(s) of word2 takes {j} insertion(s), so dp[0][{j}] = {j}.",
                new EditDistanceState(word1, word2, Snapshot(), 0, j),
                [$"0,{j}"],
                spanLines: 1);
        }

        for (var i = 1; i < rows; i++)
        {
            for (var j = 1; j < cols; j++)
            {
                string action;
                if (word1[i - 1] == word2[j - 1])
                {
                    table[i][j] = table[i - 1][j - 1];
                    action = $"'{word1[i - 1]}' matches '{word2[j - 1]}': no operation needed, dp[{i}][{j}] = dp[{i - 1}][{j - 1}] = {table[i][j]}.";
                }
                else
                {
                    var replace = table[i - 1][j - 1];
                    var delete = table[i - 1][j];
                    var insert = table[i][j - 1];
                    table[i][j] = 1 + Math.Min(replace, Math.Min(delete, insert));
                    action = $"'{word1[i - 1]}' ≠ '{word2[j - 1]}': dp[{i}][{j}] = 1 + min(replace={replace}, delete={delete}, insert={insert}) = {table[i][j]}.";
                }

                StepRecorder.Add(steps, ref stepNumber, action,
                    new EditDistanceState(word1, word2, Snapshot(), i, j),
                    [$"{i},{j}"],
                    spanLines: 15);
            }
        }

        StepRecorder.Add(steps, ref stepNumber,
            $"Done: converting \"{word1}\" into \"{word2}\" takes a minimum of {table[rows - 1][cols - 1]} operation(s).",
            new EditDistanceState(word1, word2, Snapshot(), -1, -1),
            [],
            spanLines: 1);

        return steps;
    }
}
