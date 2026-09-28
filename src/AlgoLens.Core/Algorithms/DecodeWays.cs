using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Decode Ways via 1D bottom-up dynamic programming, the same table shape UniqueBinarySearchTrees
/// uses but with at most two contributions per cell instead of a full inner loop: dp[i] is the
/// number of ways to decode s[0..i). A cell's value comes from at most two sources - a single
/// trailing digit s[i-1] (valid whenever it isn't '0') and a trailing pair s[i-2..i] (valid whenever
/// its numeric value falls in 10..26) - each recorded as its own step, mirroring
/// UniqueBinarySearchTrees' one-step-per-contribution shape. A cell where neither branch is valid
/// stays 0 and gets its own explanatory step, since a single '0' or an unreachable pair (e.g. "30")
/// permanently dead-ends every decoding that would pass through it. dp[0] = 1 (the empty prefix) is
/// the only entry never computed inside the loop, the same base-case convention
/// UniqueBinarySearchTrees' dp[0] uses.
/// </summary>
public sealed class DecodeWays : IAlgorithmVisualizer<string>
{
    public string Id => "decode-ways";

    public IReadOnlyList<AlgorithmStep> Run(string s)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (s.Length == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "Empty string; there is exactly one way to decode nothing.",
                new DecodeWaysState(s, [1], 0, "", true, 0), [], spanLines: 2);
            return steps;
        }

        var n = s.Length;
        var dp = new int[n + 1];
        dp[0] = 1;

        for (var i = 1; i <= n; i++)
        {
            var oneDigit = s.Substring(i - 1, 1);
            var oneDigitValid = oneDigit[0] != '0';
            var twoDigitValid = false;

            if (oneDigitValid)
            {
                dp[i] += dp[i - 1];
                var letter = (char)('A' + int.Parse(oneDigit) - 1);
                var action = $"s[{i - 1}] = '{oneDigit}' decodes as {letter}. dp[{i}] += dp[{i - 1}] ({dp[i - 1]}) = {dp[i]}.";
                StepRecorder.Add(steps, ref stepNumber, action,
                    new DecodeWaysState(s, dp.ToList(), i, oneDigit, true, dp[i - 1]),
                    [(i - 1).ToString()], spanLines: 5);
            }

            if (i >= 2)
            {
                var twoDigit = s.Substring(i - 2, 2);
                var value = int.Parse(twoDigit);
                twoDigitValid = value is >= 10 and <= 26;

                if (twoDigitValid)
                {
                    dp[i] += dp[i - 2];
                    var letter = (char)('A' + value - 1);
                    var action = $"s[{i - 2}..{i - 1}] = '{twoDigit}' decodes as {letter}. dp[{i}] += dp[{i - 2}] ({dp[i - 2]}) = {dp[i]}.";
                    StepRecorder.Add(steps, ref stepNumber, action,
                        new DecodeWaysState(s, dp.ToList(), i, twoDigit, true, dp[i - 2]),
                        [(i - 2).ToString(), (i - 1).ToString()], spanLines: 5);
                }
            }

            if (!oneDigitValid && !twoDigitValid)
            {
                var action = $"Neither s[{i - 1}] alone nor a two-digit pair ending at s[{i - 1}] is a valid code; dp[{i}] = 0.";
                StepRecorder.Add(steps, ref stepNumber, action,
                    new DecodeWaysState(s, dp.ToList(), i, oneDigit, false, 0),
                    [(i - 1).ToString()], spanLines: 3);
            }
        }

        return steps;
    }
}
