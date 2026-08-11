namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot shared by every backtracking algorithm whose solutions are
/// strings rather than integers (Letter Combinations of a Phone Number,
/// Generate Parentheses) — same choose/undo shape as BacktrackingState.
/// </summary>
public sealed record StringBacktrackingState(
    string Path,
    IReadOnlyList<string> Solutions
);
