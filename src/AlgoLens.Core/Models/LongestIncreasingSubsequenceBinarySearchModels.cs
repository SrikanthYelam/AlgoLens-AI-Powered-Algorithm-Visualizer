namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot for the binary-search Longest Increasing Subsequence at a given step. `Tails[k]`
/// is the smallest possible last element of any increasing subsequence of length `k + 1` seen so
/// far, so `Tails.Count` is the LIS length. `Index` is the element of `Nums` being placed,
/// `Probes` the `Tails` indices the binary search inspected for it (in order), and `Position` the
/// `Tails` index it landed on (`Index` and `Position` are both -1 outside the loop).
/// </summary>
public sealed record LongestIncreasingSubsequenceBinarySearchState(
    IReadOnlyList<int> Nums,
    IReadOnlyList<int> Tails,
    int Index,
    IReadOnlyList<int> Probes,
    int Position
);
