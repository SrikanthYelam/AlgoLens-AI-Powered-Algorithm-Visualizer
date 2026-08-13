using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Remove Invalid Parentheses via level-by-level BFS over strings: starting from the
/// input, each level removes one more parenthesis than the last. The first level where
/// any candidate is valid contains every minimal-removal answer, so the search stops
/// there — BFS naturally finds the minimum number of removals first.
/// </summary>
public sealed class RemoveInvalidParenthesesBfs : IAlgorithmVisualizer<string>
{
    public string Id => "remove-invalid-parentheses-bfs";

    public IReadOnlyList<AlgorithmStep> Run(string s)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (s.Length == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "Empty input; the empty string is already valid.",
                new RemoveInvalidParenthesesBfsState("", 0, [], [""]), [], spanLines: 2);
            return steps;
        }

        var results = new List<string>();
        var visited = new HashSet<string> { s };
        var currentLevel = new List<string> { s };
        var level = 0;

        while (currentLevel.Count > 0)
        {
            var validAtThisLevel = new List<string>();
            foreach (var candidate in currentLevel)
            {
                var isValid = IsValid(candidate);
                if (isValid)
                {
                    validAtThisLevel.Add(candidate);
                }

                StepRecorder.Add(steps, ref stepNumber,
                    isValid
                        ? $"Level {level}: \"{candidate}\" is valid."
                        : $"Level {level}: \"{candidate}\" is not valid.",
                    new RemoveInvalidParenthesesBfsState(candidate, level, currentLevel, results.ToList()),
                    [candidate],
                    spanLines: 6);
            }

            if (validAtThisLevel.Count > 0)
            {
                results.AddRange(validAtThisLevel);
                break;
            }

            var nextLevel = new List<string>();
            foreach (var candidate in currentLevel)
            {
                for (var i = 0; i < candidate.Length; i++)
                {
                    if (candidate[i] != '(' && candidate[i] != ')')
                    {
                        continue;
                    }

                    var next = candidate.Remove(i, 1);
                    if (!visited.Add(next))
                    {
                        continue;
                    }

                    nextLevel.Add(next);
                    StepRecorder.Add(steps, ref stepNumber,
                        $"Remove '{candidate[i]}' at index {i} from \"{candidate}\" → \"{next}\".",
                        new RemoveInvalidParenthesesBfsState(next, level, nextLevel, results.ToList()),
                        [next],
                        spanLines: 7);
                }
            }

            currentLevel = nextLevel;
            level++;
        }

        StepRecorder.Add(steps, ref stepNumber,
            results.Count > 0
                ? $"Done: {results.Count} minimal solution(s) found after removing {level} character(s)."
                : "Done: no valid string is reachable.",
            new RemoveInvalidParenthesesBfsState("", level, [], results.ToList()),
            [],
            spanLines: 1);

        return steps;
    }

    private static bool IsValid(string s)
    {
        var balance = 0;
        foreach (var c in s)
        {
            if (c == '(')
            {
                balance++;
            }
            else if (c == ')')
            {
                balance--;
                if (balance < 0)
                {
                    return false;
                }
            }
        }

        return balance == 0;
    }
}
