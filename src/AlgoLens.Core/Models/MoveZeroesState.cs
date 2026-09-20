namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot for Move Zeroes at a given step. `Nums` is the array as it currently stands (it
/// is rearranged in place). `Read` is the index just examined (`-1` on the closing step); `Write`
/// is the next slot a non-zero will be swapped into, taken after this step's action — so
/// `Nums[0..Write)` are the non-zeros gathered so far, and `Nums[Write..Read]` are all zeros.
/// </summary>
public sealed record MoveZeroesState(
    IReadOnlyList<int> Nums,
    int Read,
    int Write
);
