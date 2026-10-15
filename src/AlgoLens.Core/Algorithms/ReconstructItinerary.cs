using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// LeetCode 332. Builds a sorted adjacency list (ties broken lexicographically, so the smallest
/// destination from any airport is always tried first), then runs Hierholzer's algorithm for an
/// Eulerian path: an iterative DFS that greedily consumes the smallest remaining edge from the
/// node on top of the stack, only popping a node — and appending it to the postorder result —
/// once it has no edges left. Every ticket must be used exactly once in a valid itinerary, so a
/// node only runs out of edges after every path through it has already been explored, meaning the
/// postorder-then-reverse result is guaranteed correct with no explicit backtracking over which
/// ticket to pick, unlike a naive greedy-with-retry DFS (see the "dead end" example in
/// `examples.ts`, where picking the lexicographically smallest edge first would otherwise strand
/// an unused ticket).
/// </summary>
public sealed class ReconstructItinerary : IAlgorithmVisualizer<IReadOnlyList<IReadOnlyList<string>>>
{
    private const string StartAirport = "JFK";

    public string Id => "reconstruct-itinerary";

    public IReadOnlyList<AlgorithmStep> Run(IReadOnlyList<IReadOnlyList<string>> tickets)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (tickets.Count == 0)
        {
            StepRecorder.Add(steps, ref stepNumber,
                "No tickets given; the itinerary is just the starting airport.",
                Snapshot(new Dictionary<string, List<string>>(), [StartAirport], [], [StartAirport]),
                [StartAirport],
                spanLines: 2);
            return steps;
        }

        var graph = new Dictionary<string, List<string>>();
        foreach (var ticket in tickets)
        {
            if (!graph.TryGetValue(ticket[0], out var destinations))
            {
                destinations = [];
                graph[ticket[0]] = destinations;
            }
            destinations.Add(ticket[1]);
        }
        foreach (var destinations in graph.Values)
        {
            destinations.Sort(StringComparer.Ordinal);
        }

        var stack = new List<string> { StartAirport };
        var postOrder = new List<string>();

        while (stack.Count > 0)
        {
            var node = stack[^1];

            if (graph.TryGetValue(node, out var destinations) && destinations.Count > 0)
            {
                var next = destinations[0];
                destinations.RemoveAt(0);
                stack.Add(next);

                StepRecorder.Add(steps, ref stepNumber,
                    $"Fly from {node} to {next} (smallest remaining destination).",
                    Snapshot(graph, stack, postOrder, null),
                    [node, next],
                    spanLines: 4);
            }
            else
            {
                stack.RemoveAt(stack.Count - 1);
                postOrder.Add(node);

                StepRecorder.Add(steps, ref stepNumber,
                    $"{node} has no flights left — add it to the itinerary and backtrack.",
                    Snapshot(graph, stack, postOrder, null),
                    [node],
                    spanLines: 3);
            }
        }

        postOrder.Reverse();
        StepRecorder.Add(steps, ref stepNumber,
            $"Done: itinerary is {string.Join(" -> ", postOrder)}.",
            Snapshot(graph, stack, postOrder, postOrder),
            [],
            spanLines: 2);

        return steps;
    }

    private static ReconstructItineraryState Snapshot(
        Dictionary<string, List<string>> graph,
        List<string> stack,
        List<string> postOrder,
        IReadOnlyList<string>? itinerary) =>
        new(
            graph.ToDictionary(kv => kv.Key, kv => (IReadOnlyList<string>)kv.Value.ToList()),
            stack.ToList(),
            postOrder.ToList(),
            itinerary);
}
