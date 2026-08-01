namespace AlgoLens.Core.Models;

/// <summary>
/// A single captured step in an algorithm's execution, used to drive both
/// the frontend visualization and the AI-generated explanation for that step.
/// </summary>
public sealed record AlgorithmStep(
    int StepNumber,
    string Action,
    object State,
    IReadOnlyList<string> Highlights,
    int SourceLineStart,
    int SourceLineEnd
);

/// <summary>
/// State snapshot for Binary Tree Level Order Traversal at a given step.
/// </summary>
public sealed record TreeTraversalState(
    IReadOnlyList<int?> Queue,
    IReadOnlyList<IReadOnlyList<int>> CompletedLevels,
    IReadOnlyList<int> CurrentLevelInProgress
);
