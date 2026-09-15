namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot for Accounts Merge at a given step. `Groups` is fully recomputed after each
/// account is processed — each entry is `[name, sortedEmail1, sortedEmail2, ...]`, the
/// LeetCode-expected shape (name first, followed by that person's emails in sorted order).
/// </summary>
public sealed record AccountsMergeState(
    string? CurrentName,
    IReadOnlyList<string> CurrentAccountEmails,
    IReadOnlyList<IReadOnlyList<string>> Groups
);
