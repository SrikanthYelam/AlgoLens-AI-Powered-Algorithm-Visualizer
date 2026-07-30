namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot for Letter Combinations of a Phone Number — same
/// choose/undo backtracking shape as BacktrackingState, but over a string
/// path/solutions rather than integers.
/// </summary>
public sealed record LetterCombinationsState(
    string Path,
    IReadOnlyList<string> Solutions
);
