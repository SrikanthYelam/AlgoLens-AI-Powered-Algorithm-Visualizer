using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Encode and Decode Strings via length-prefixing: each string is written as `{length}#{string}`.
/// The decoder can then parse the result without ever inspecting a string's contents — a start
/// pointer `i` marks where a token begins, a scan pointer `j` runs forward to the first `#` (which
/// can only be the delimiter, since `i` always sits on a length prefix and prefixes are digits), the
/// digits in between give the length, and the next `length` characters are the string verbatim —
/// then `i` jumps past them. That jump is what makes strings that themselves contain `#` or digits
/// (like `"3#x"`) harmless, which a plain delimiter-join can't guarantee. Runs as two phases,
/// encode then decode, so the round trip is visible end to end.
/// </summary>
public sealed class EncodeAndDecodeStrings : IAlgorithmVisualizer<IReadOnlyList<string>>
{
    public string Id => "encode-and-decode-strings";

    public IReadOnlyList<AlgorithmStep> Run(IReadOnlyList<string> strings)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (strings.Count == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "The list is empty; there is nothing to encode.",
                new EncodeAndDecodeStringsState("encode", [], "", -1, -1, -1, []), [], spanLines: 2);
            return steps;
        }

        var encoded = "";
        for (var index = 0; index < strings.Count; index++)
        {
            var token = $"{strings[index].Length}#{strings[index]}";
            encoded += token;

            StepRecorder.Add(steps, ref stepNumber,
                $"Encode \"{strings[index]}\": write its length ({strings[index].Length}), a '#', then the string itself → \"{token}\".",
                new EncodeAndDecodeStringsState("encode", strings.ToList(), encoded, -1, -1, -1, []),
                [index.ToString()],
                spanLines: 3);
        }

        var decoded = new List<string>();
        var i = 0;
        while (i < encoded.Length)
        {
            var j = i;
            while (encoded[j] != '#')
            {
                j++;
            }
            var length = int.Parse(encoded[i..j]);

            StepRecorder.Add(steps, ref stepNumber,
                $"Scan from index {i} to the '#' at index {j}: the digits \"{encoded[i..j]}\" say the next string has {length} character(s).",
                new EncodeAndDecodeStringsState("decode", strings.ToList(), encoded, i, j, -1, decoded.ToList()),
                Enumerable.Range(i, j - i + 1).Select(k => k.ToString()).ToList(),
                spanLines: 7);

            var contentEnd = j + 1 + length;
            var value = encoded[(j + 1)..contentEnd];
            decoded.Add(value);

            StepRecorder.Add(steps, ref stepNumber,
                $"Read the {length} character(s) after the '#' → \"{value}\", then jump the start pointer to index {contentEnd}.",
                new EncodeAndDecodeStringsState("decode", strings.ToList(), encoded, i, j, contentEnd, decoded.ToList()),
                Enumerable.Range(j + 1, length).Select(k => k.ToString()).ToList(),
                spanLines: 4);

            i = contentEnd;
        }

        StepRecorder.Add(steps, ref stepNumber,
            $"Done: decoded {decoded.Count} string(s) from the encoded text.",
            new EncodeAndDecodeStringsState("decode", strings.ToList(), encoded, -1, -1, -1, decoded.ToList()),
            [],
            spanLines: 2);

        return steps;
    }
}
