using System.Text;
using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Letter Combinations of a Phone Number via backtracking over the classic
/// telephone-keypad digit-to-letters mapping. Captures one step on each
/// choose, one on each backtrack (undo), and one whenever a full
/// combination is recorded — same granularity as the other backtracking
/// algorithms.
/// </summary>
public sealed class LetterCombinationsOfPhoneNumber : IAlgorithmVisualizer<string>
{
    private static readonly Dictionary<char, string> DigitToLetters = new()
    {
        ['2'] = "abc",
        ['3'] = "def",
        ['4'] = "ghi",
        ['5'] = "jkl",
        ['6'] = "mno",
        ['7'] = "pqrs",
        ['8'] = "tuv",
        ['9'] = "wxyz",
    };

    public string Id => "letter-combinations-of-a-phone-number";

    public IReadOnlyList<AlgorithmStep> Run(string digits)
    {
        var steps = new List<AlgorithmStep>();

        if (digits.Length == 0)
        {
            steps.Add(new AlgorithmStep(
                0, "No digits provided; there are no combinations.", new LetterCombinationsState("", []), []));
            return steps;
        }

        if (digits.Any(d => !DigitToLetters.ContainsKey(d)))
        {
            steps.Add(new AlgorithmStep(
                0, "Invalid input: digits must be between 2 and 9.", new LetterCombinationsState("", []), []));
            return steps;
        }

        var stepNumber = 0;
        var path = new StringBuilder();
        var solutions = new List<string>();

        void Backtrack(int index)
        {
            if (index == digits.Length)
            {
                var combination = path.ToString();
                solutions.Add(combination);
                steps.Add(new AlgorithmStep(
                    stepNumber++,
                    $"Complete combination found: \"{combination}\".",
                    new LetterCombinationsState(path.ToString(), solutions.ToList()),
                    [combination]));
                return;
            }

            var letters = DigitToLetters[digits[index]];
            foreach (var letter in letters)
            {
                path.Append(letter);
                steps.Add(new AlgorithmStep(
                    stepNumber++,
                    $"Choose '{letter}' for digit '{digits[index]}'; path is now \"{path}\".",
                    new LetterCombinationsState(path.ToString(), solutions.ToList()),
                    [letter.ToString()]));

                Backtrack(index + 1);

                path.Remove(path.Length - 1, 1);
                steps.Add(new AlgorithmStep(
                    stepNumber++,
                    $"Backtrack: remove '{letter}' from path.",
                    new LetterCombinationsState(path.ToString(), solutions.ToList()),
                    [letter.ToString()]));
            }
        }

        Backtrack(0);
        return steps;
    }
}
