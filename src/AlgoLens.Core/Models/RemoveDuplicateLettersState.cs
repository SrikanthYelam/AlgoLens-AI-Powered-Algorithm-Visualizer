namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot for Remove Duplicate Letters (LeetCode 316) at one step of the greedy
/// monotonic-stack scan. <c>RemainingCount</c> is how many more times each character in
/// <c>S</c> still occurs strictly after <c>Index</c> — the pop condition's "will this character
/// come back?" check. <c>Stack</c> is the result built so far, bottom to top. <c>Skipped</c> is
/// true when the character at <c>Index</c> was already in the stack (its first, already-optimal
/// placement stands, so this occurrence is dropped with no push or pop). <c>Result</c> stays
/// <c>null</c> until the closing step.
/// </summary>
public sealed record RemoveDuplicateLettersState(
    string S,
    int Index,
    char? Char,
    IReadOnlyDictionary<char, int> RemainingCount,
    IReadOnlyList<char> Stack,
    bool Skipped,
    string? Result
);
