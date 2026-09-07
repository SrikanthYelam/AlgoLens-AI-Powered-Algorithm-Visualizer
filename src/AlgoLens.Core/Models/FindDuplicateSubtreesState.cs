namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot for Find Duplicate Subtrees at a given step. `Duplicates` holds each found
/// duplicate subtree's own level-order array (for rendering via `TreeDiagram`); `DuplicateRoots`
/// carries the same duplicates as raw `TreeNode` references, used only by the "Try Your Own
/// Solution" judge so it serializes to the same nested {val,left,right} shape a correct user
/// solution's own returned list of `TreeNode`s would produce — it isn't rendered.
/// </summary>
public sealed record FindDuplicateSubtreesState(
    IReadOnlyList<int?> Tree,
    int? CurrentValue,
    string Serialization,
    IReadOnlyList<IReadOnlyList<int?>> Duplicates,
    IReadOnlyList<TreeNode> DuplicateRoots
);
