namespace AlgoLens.Core.Models;

/// <summary>
/// Input for Cheapest Flights Within K Stops. <c>Flights[i] = [from, to, price]</c>, matching
/// LeetCode's own triple ordering.
/// </summary>
public sealed record CheapestFlightsInput(int N, int[][] Flights, int Src, int Dst, int K);

/// <summary>
/// State snapshot at one step of the limited-round Bellman-Ford relaxation. <c>Dist</c> is the best
/// known price per city *before* this round started — what this step's relaxation reads from;
/// <c>NextDist</c> is the array being built this round — what the *next* round will read from. Both
/// use <c>null</c> for "unreached" rather than a sentinel int. <c>Round</c> is 0-indexed (round
/// <c>r</c> allows paths of up to <c>r + 1</c> edges). <c>Answer</c> stays <c>null</c> until the
/// closing step.
/// </summary>
public sealed record CheapestFlightsState(
    int Round,
    IReadOnlyList<int?> Dist,
    IReadOnlyList<int?> NextDist,
    int From,
    int To,
    int Price,
    bool Updated,
    int? Answer
);
