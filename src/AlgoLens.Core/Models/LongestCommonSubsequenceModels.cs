namespace AlgoLens.Core.Models;

public sealed record LongestCommonSubsequenceInput(string Text1, string Text2);

/// <summary>
/// State snapshot for Longest Common Subsequence at a given step, covering both the
/// table-fill phase and the traceback phase that recovers the actual subsequence.
/// </summary>
public sealed record LongestCommonSubsequenceState(
    string Text1,
    string Text2,
    IReadOnlyList<IReadOnlyList<int>> Table,
    int Row,
    int Col,
    string Subsequence
);
