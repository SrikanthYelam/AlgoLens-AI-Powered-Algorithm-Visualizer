namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot for the BFS solution to Remove Invalid Parentheses at a given step.
/// </summary>
public sealed record RemoveInvalidParenthesesBfsState(
    string Current,
    int Level,
    IReadOnlyList<string> Frontier,
    IReadOnlyList<string> Results
);

/// <summary>
/// State snapshot for the DFS/backtracking solution to Remove Invalid Parentheses at a given step.
/// </summary>
public sealed record RemoveInvalidParenthesesDfsState(
    string Path,
    int Index,
    int RemoveLeftBudget,
    int RemoveRightBudget,
    IReadOnlyList<string> Results
);
