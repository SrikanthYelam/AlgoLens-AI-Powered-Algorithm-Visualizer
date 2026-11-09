using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// LeetCode 316. Greedy + monotonic stack: build the result as a stack that stays as
/// lexicographically small as possible by popping a larger top character whenever it will still
/// reappear later in the string (tracked via a running "remaining occurrences after this index"
/// count per character) and a smaller character is ready to take its place. A character already
/// in the stack is skipped outright — its first, already-optimally-placed occurrence stands, and
/// a later repeat of it can only ever duplicate that placement, never improve it.
/// </summary>
public sealed class RemoveDuplicateLetters : IAlgorithmVisualizer<string>
{
    public string Id => "remove-duplicate-letters";

    public IReadOnlyList<AlgorithmStep> Run(string s)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (s.Length == 0)
        {
            StepRecorder.Add(steps, ref stepNumber,
                "Empty string; the result is empty too.",
                new RemoveDuplicateLettersState("", -1, null, new Dictionary<char, int>(), [], false, ""),
                [],
                spanLines: 2);
            return steps;
        }

        var remaining = new Dictionary<char, int>();
        foreach (var c in s)
        {
            remaining[c] = remaining.GetValueOrDefault(c) + 1;
        }

        var stack = new List<char>();
        var inStack = new HashSet<char>();

        for (var i = 0; i < s.Length; i++)
        {
            var c = s[i];
            remaining[c]--;

            if (inStack.Contains(c))
            {
                StepRecorder.Add(steps, ref stepNumber,
                    $"'{c}' is already in the result; skip this occurrence.",
                    new RemoveDuplicateLettersState(s, i, c, new Dictionary<char, int>(remaining), stack.ToList(), true, null),
                    [c.ToString()],
                    spanLines: 4);
                continue;
            }

            while (stack.Count > 0 && stack[^1] > c && remaining[stack[^1]] > 0)
            {
                inStack.Remove(stack[^1]);
                stack.RemoveAt(stack.Count - 1);
            }

            stack.Add(c);
            inStack.Add(c);

            StepRecorder.Add(steps, ref stepNumber,
                $"Push '{c}'.",
                new RemoveDuplicateLettersState(s, i, c, new Dictionary<char, int>(remaining), stack.ToList(), false, null),
                [c.ToString()],
                spanLines: 9);
        }

        var result = new string(stack.ToArray());
        StepRecorder.Add(steps, ref stepNumber,
            $"Done: result is \"{result}\".",
            new RemoveDuplicateLettersState(s, s.Length, null, new Dictionary<char, int>(remaining), stack.ToList(), false, result),
            [],
            spanLines: 2);

        return steps;
    }
}
