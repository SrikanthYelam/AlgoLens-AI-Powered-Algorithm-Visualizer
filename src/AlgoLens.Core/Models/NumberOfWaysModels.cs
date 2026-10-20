namespace AlgoLens.Core.Models;

/// <summary>
/// Input for Number of Ways to Arrive at Destination. <c>Roads[i] = [u, v, time]</c>, matching
/// LeetCode's own triple ordering; roads are bidirectional.
/// </summary>
public sealed record NumberOfWaysInput(int N, int[][] Roads);

/// <summary>
/// State snapshot at one step of Dijkstra's algorithm with a parallel shortest-path count.
/// <c>Dist</c> is the best known travel time per intersection (<c>null</c> = not yet reached);
/// <c>Ways</c> is how many distinct shortest paths reach each intersection so far, modulo
/// 1,000,000,007. <c>Node</c> is whichever intersection's edges are being relaxed this step and
/// <c>Neighbor</c>/<c>EdgeTime</c> the specific road just considered (all <c>-1</c> outside a
/// relax step). <c>Outcome</c> is <c>"shorter"</c>, <c>"tie"</c>, or <c>"longer"</c> for a relax
/// step, else <c>null</c>. <c>Answer</c> stays <c>null</c> until the closing step.
/// </summary>
public sealed record NumberOfWaysState(
    int Node,
    int Neighbor,
    long EdgeTime,
    IReadOnlyList<long?> Dist,
    IReadOnlyList<long> Ways,
    string? Outcome,
    long? Answer
);
