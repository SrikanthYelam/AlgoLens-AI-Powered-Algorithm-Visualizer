namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot for Reconstruct Itinerary (LeetCode 332) at one step of Hierholzer's algorithm.
/// <see cref="RemainingGraph"/> is the sorted adjacency list with already-used destinations
/// removed; <see cref="Stack"/> is the current DFS stack, bottom to top; <see cref="PostOrder"/>
/// is the backtracked result built so far, in reverse of the final answer; <see cref="Itinerary"/>
/// is null until the closing step, when it becomes <see cref="PostOrder"/> reversed.
/// </summary>
public sealed record ReconstructItineraryState(
    IReadOnlyDictionary<string, IReadOnlyList<string>> RemainingGraph,
    IReadOnlyList<string> Stack,
    IReadOnlyList<string> PostOrder,
    IReadOnlyList<string>? Itinerary
);
