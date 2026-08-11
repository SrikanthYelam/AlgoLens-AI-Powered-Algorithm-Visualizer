using System.Text;
using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Generate Parentheses via backtracking: at each step, choose '(' if fewer than n
/// have been opened, or ')' if it wouldn't outnumber the '(' placed so far. Captures
/// one step on each choose, one on each backtrack (undo), and one whenever a complete,
/// well-formed combination is recorded — same granularity as the other backtracking
/// algorithms.
/// </summary>
public sealed class GenerateParentheses : IAlgorithmVisualizer<int>
{
    public string Id => "generate-parentheses";

    public IReadOnlyList<AlgorithmStep> Run(int n)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (n <= 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "n must be positive.",
                new StringBacktrackingState("", []), [], spanLines: 2);
            return steps;
        }

        var path = new StringBuilder();
        var solutions = new List<string>();

        void Backtrack(int open, int close)
        {
            if (path.Length == 2 * n)
            {
                var combination = path.ToString();
                solutions.Add(combination);
                StepRecorder.Add(steps, ref stepNumber,
                    $"Complete combination found: \"{combination}\".",
                    new StringBacktrackingState(path.ToString(), solutions.ToList()),
                    [combination],
                    spanLines: 2);
                return;
            }

            if (open < n)
            {
                path.Append('(');
                StepRecorder.Add(steps, ref stepNumber,
                    $"Choose '('; path is now \"{path}\".",
                    new StringBacktrackingState(path.ToString(), solutions.ToList()),
                    ["("],
                    spanLines: 1);

                Backtrack(open + 1, close);

                path.Remove(path.Length - 1, 1);
                StepRecorder.Add(steps, ref stepNumber,
                    "Backtrack: remove '(' from path.",
                    new StringBacktrackingState(path.ToString(), solutions.ToList()),
                    ["("],
                    spanLines: 1);
            }

            if (close < open)
            {
                path.Append(')');
                StepRecorder.Add(steps, ref stepNumber,
                    $"Choose ')'; path is now \"{path}\".",
                    new StringBacktrackingState(path.ToString(), solutions.ToList()),
                    [")"],
                    spanLines: 1);

                Backtrack(open, close + 1);

                path.Remove(path.Length - 1, 1);
                StepRecorder.Add(steps, ref stepNumber,
                    "Backtrack: remove ')' from path.",
                    new StringBacktrackingState(path.ToString(), solutions.ToList()),
                    [")"],
                    spanLines: 1);
            }
        }

        Backtrack(0, 0);
        return steps;
    }
}
