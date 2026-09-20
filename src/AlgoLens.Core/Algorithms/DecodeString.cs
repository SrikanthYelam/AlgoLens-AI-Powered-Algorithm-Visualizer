using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Decode String via a single left-to-right pass and a stack of frames. Letters are appended to the
/// string being built at the current nesting level, and digits accumulate into a repeat count
/// (`number = number * 10 + digit`, so `12[a]` works). A `[` starts a nested level: the string built
/// so far and the pending count are pushed as a frame, and both are reset. A `]` finishes that
/// level: pop the frame, and the new current string is the saved prefix followed by the level's
/// contents repeated `Repeat` times — which is exactly why nesting like `3[a2[c]]` works, since the
/// inner `2[c]` collapses into `cc` before the outer level is closed. One step per input character.
/// Assumes a well-formed encoded string, as the problem guarantees.
/// </summary>
public sealed class DecodeString : IAlgorithmVisualizer<string>
{
    public string Id => "decode-string";

    public IReadOnlyList<AlgorithmStep> Run(string encoded)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (encoded.Length == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "The encoded string is empty; there is nothing to decode.",
                new DecodeStringState("", -1, "", 0, [], ""), [], spanLines: 2);
            return steps;
        }

        var stack = new Stack<DecodeStringFrame>();
        var current = "";
        var number = 0;

        for (var i = 0; i < encoded.Length; i++)
        {
            var c = encoded[i];
            string action;

            if (char.IsDigit(c))
            {
                number = number * 10 + (c - '0');
                action = $"Digit '{c}' — the repeat count is now {number}.";
            }
            else if (c == '[')
            {
                stack.Push(new DecodeStringFrame(current, number));
                action = $"'[' — save (\"{current}\", ×{number}) on the stack and start a fresh level.";
                current = "";
                number = 0;
            }
            else if (c == ']')
            {
                var frame = stack.Pop();
                var inner = current;
                current = frame.Prefix + string.Concat(Enumerable.Repeat(inner, frame.Repeat));
                action = $"']' — pop (\"{frame.Prefix}\", ×{frame.Repeat}): \"{frame.Prefix}\" + \"{inner}\" repeated {frame.Repeat} times = \"{current}\".";
            }
            else
            {
                current += c;
                action = $"Letter '{c}' — append it to the current string (\"{current}\").";
            }

            StepRecorder.Add(steps, ref stepNumber, action,
                new DecodeStringState(encoded, i, current, number, stack.Reverse().ToList(), ""),
                [i.ToString()],
                spanLines: 28);
        }

        StepRecorder.Add(steps, ref stepNumber,
            $"Done: the decoded string is \"{current}\".",
            new DecodeStringState(encoded, -1, current, 0, [], current),
            [],
            spanLines: 2);

        return steps;
    }
}
