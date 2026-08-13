using System.Text;
using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Remove Invalid Parentheses via backtracking: a single pass first computes the exact
/// minimum number of '(' and ')' that must be removed, then the search walks the string
/// index by index, at each parenthesis trying both "remove it" (spending one unit of that
/// budget) and "keep it" (only when doing so can't yet make the prefix invalid), pruning
/// branches whose budgets are already fully spent. Every leaf that spends both budgets
/// exactly and is well-formed is a minimal-removal answer.
/// </summary>
public sealed class RemoveInvalidParenthesesDfs : IAlgorithmVisualizer<string>
{
    public string Id => "remove-invalid-parentheses-dfs";

    public IReadOnlyList<AlgorithmStep> Run(string s)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (s.Length == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "Empty input; the empty string is already valid.",
                new RemoveInvalidParenthesesDfsState("", 0, 0, 0, [""]), [], spanLines: 2);
            return steps;
        }

        var (removeLeft, removeRight) = CountRemovals(s);
        var results = new List<string>();
        var seen = new HashSet<string>();
        var path = new StringBuilder();

        void Backtrack(int index, int left, int right, int open, int close)
        {
            if (index == s.Length)
            {
                if (left == 0 && right == 0 && seen.Add(path.ToString()))
                {
                    results.Add(path.ToString());
                    StepRecorder.Add(steps, ref stepNumber,
                        $"Complete valid result found: \"{path}\".",
                        new RemoveInvalidParenthesesDfsState(path.ToString(), index, left, right, results.ToList()),
                        [path.ToString()],
                        spanLines: 1);
                }

                return;
            }

            var c = s[index];

            if (c == '(' && left > 0)
            {
                StepRecorder.Add(steps, ref stepNumber,
                    $"Remove '(' at index {index}.",
                    new RemoveInvalidParenthesesDfsState(path.ToString(), index, left - 1, right, results.ToList()),
                    [index.ToString()],
                    spanLines: 2);

                Backtrack(index + 1, left - 1, right, open, close);
            }

            if (c == ')' && right > 0)
            {
                StepRecorder.Add(steps, ref stepNumber,
                    $"Remove ')' at index {index}.",
                    new RemoveInvalidParenthesesDfsState(path.ToString(), index, left, right - 1, results.ToList()),
                    [index.ToString()],
                    spanLines: 2);

                Backtrack(index + 1, left, right - 1, open, close);
            }

            if (c != ')' || open > close)
            {
                path.Append(c);
                var nextOpen = c == '(' ? open + 1 : open;
                var nextClose = c == ')' ? close + 1 : close;
                StepRecorder.Add(steps, ref stepNumber,
                    $"Keep '{c}' at index {index}; path is now \"{path}\".",
                    new RemoveInvalidParenthesesDfsState(path.ToString(), index, left, right, results.ToList()),
                    [index.ToString()],
                    spanLines: 3);

                Backtrack(index + 1, left, right, nextOpen, nextClose);

                path.Remove(path.Length - 1, 1);
                StepRecorder.Add(steps, ref stepNumber,
                    $"Backtrack: un-keep '{c}' from index {index}.",
                    new RemoveInvalidParenthesesDfsState(path.ToString(), index, left, right, results.ToList()),
                    [index.ToString()],
                    spanLines: 1);
            }
        }

        Backtrack(0, removeLeft, removeRight, 0, 0);
        return steps;
    }

    /// <summary>
    /// One linear pass computing the minimum number of '(' left unmatched (must be
    /// removed) and ')' that appeared with no '(' open to match (must be removed).
    /// </summary>
    private static (int RemoveLeft, int RemoveRight) CountRemovals(string s)
    {
        var extraOpen = 0;
        var extraClose = 0;
        foreach (var c in s)
        {
            if (c == '(')
            {
                extraOpen++;
            }
            else if (c == ')')
            {
                if (extraOpen > 0)
                {
                    extraOpen--;
                }
                else
                {
                    extraClose++;
                }
            }
        }

        return (extraOpen, extraClose);
    }
}
