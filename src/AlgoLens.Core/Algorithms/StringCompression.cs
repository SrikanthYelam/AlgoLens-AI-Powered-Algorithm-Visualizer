using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// String Compression via read/write two pointers, compressing the array in place: `read` scans
/// forward over each run of equal characters, and `write` overwrites the front of the same array
/// with the run's character followed by its length's digits (only when the run is longer than 1).
/// `write` can never overtake `read` — a run of length `c` writes at most `c` cells (1 for `c == 1`,
/// 2 for `c` in 2..9, 3 for 10..99, ...) — so nothing is overwritten before it has been read, which
/// is what makes constant extra space possible. The answer is the final `write` position, i.e. the
/// compressed length. Mutates its input array, exactly like the real problem.
/// </summary>
public sealed class StringCompression : IAlgorithmVisualizer<char[]>
{
    public string Id => "string-compression";

    public IReadOnlyList<AlgorithmStep> Run(char[] chars)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;
        var n = chars.Length;

        if (n == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "No characters to compress.",
                new StringCompressionState([], -1, -1, 0, 0, ""), [], spanLines: 2);
            return steps;
        }

        var read = 0;
        var write = 0;

        while (read < n)
        {
            var groupChar = chars[read];
            var groupStart = read;
            while (read < n && chars[read] == groupChar)
            {
                read++;
            }
            var groupLength = read - groupStart;

            StepRecorder.Add(steps, ref stepNumber,
                $"Found a run of {groupLength} '{groupChar}' at indices {groupStart}..{read - 1}.",
                new StringCompressionState(chars.ToList(), groupStart, read - 1, write, write, new string(chars, 0, write)),
                Enumerable.Range(groupStart, groupLength).Select(i => i.ToString()).ToList(),
                spanLines: 8);

            var writeStart = write;
            chars[write++] = groupChar;
            if (groupLength > 1)
            {
                foreach (var digit in groupLength.ToString())
                {
                    chars[write++] = digit;
                }
            }

            var action = groupLength > 1
                ? $"Write '{groupChar}' then the count {groupLength} at indices {writeStart}..{write - 1}."
                : $"Write '{groupChar}' at index {writeStart} — a run of 1 gets no count.";

            StepRecorder.Add(steps, ref stepNumber, action,
                new StringCompressionState(chars.ToList(), groupStart, read - 1, writeStart, write, new string(chars, 0, write)),
                Enumerable.Range(writeStart, write - writeStart).Select(i => i.ToString()).ToList(),
                spanLines: 14);
        }

        StepRecorder.Add(steps, ref stepNumber,
            $"Done: compressed length is {write} (\"{new string(chars, 0, write)}\").",
            new StringCompressionState(chars.ToList(), -1, -1, write, write, new string(chars, 0, write)),
            [],
            spanLines: 2);

        return steps;
    }
}
