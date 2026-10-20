using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// LeetCode 1976. Dijkstra's algorithm extended to also count shortest paths: alongside the usual
/// `Dist` array (shortest known travel time per intersection), a parallel `Ways` array counts how
/// many distinct shortest paths reach each intersection, modulo 1,000,000,007. Popping a node off
/// a min-priority-queue ordered by tentative distance (the same lazy-deletion `PriorityQueue`
/// style `MeetingRoomsII` uses) finalizes its distance; relaxing each of its roads then either
/// finds a strictly shorter path to the neighbor — distance improves, so `Ways` *resets* to the
/// current node's count, since every older path to that neighbor is now provably suboptimal — or
/// ties the neighbor's current best distance exactly, so `Ways` *accumulates* one more way to tie
/// for shortest, or does neither, leaving the neighbor untouched. A stale queue entry (a node
/// pushed earlier with a distance later superseded by a shorter one) is skipped outright rather
/// than reprocessed, since its roads were already relaxed against a worse distance and relaxing
/// them again would double-count ways.
/// </summary>
public sealed class NumberOfWays : IAlgorithmVisualizer<NumberOfWaysInput>
{
    private const long Mod = 1_000_000_007;

    public string Id => "number-of-ways-to-arrive-at-destination";

    public IReadOnlyList<AlgorithmStep> Run(NumberOfWaysInput input)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;
        var n = input.N;

        if (n == 1)
        {
            StepRecorder.Add(steps, ref stepNumber,
                "Only one intersection; there's exactly one (trivial) way to already be there.",
                new NumberOfWaysState(-1, -1, -1, [0], [1], null, 1),
                ["0"],
                spanLines: 2);
            return steps;
        }

        var adjacency = new List<(int To, long Time)>[n];
        for (var i = 0; i < n; i++)
        {
            adjacency[i] = [];
        }
        foreach (var road in input.Roads)
        {
            var (u, v, time) = (road[0], road[1], (long)road[2]);
            adjacency[u].Add((v, time));
            adjacency[v].Add((u, time));
        }

        var dist = new long?[n];
        var ways = new long[n];
        dist[0] = 0;
        ways[0] = 1;

        var queue = new PriorityQueue<int, long>();
        queue.Enqueue(0, 0);

        while (queue.TryDequeue(out var node, out var nodeDist))
        {
            if (nodeDist > dist[node])
            {
                continue; // stale entry — this node's distance has already been finalized smaller
            }

            foreach (var (neighbor, time) in adjacency[node])
            {
                var candidate = nodeDist + time;
                string outcome;

                if (dist[neighbor] is null || candidate < dist[neighbor])
                {
                    dist[neighbor] = candidate;
                    ways[neighbor] = ways[node];
                    queue.Enqueue(neighbor, candidate);
                    outcome = "shorter";
                }
                else if (candidate == dist[neighbor])
                {
                    ways[neighbor] = (ways[neighbor] + ways[node]) % Mod;
                    outcome = "tie";
                }
                else
                {
                    outcome = "longer";
                }

                StepRecorder.Add(steps, ref stepNumber,
                    outcome switch
                    {
                        "shorter" => $"Road {node}->{neighbor} ({time}) finds a new shortest time {candidate}; ways resets to {ways[neighbor]}.",
                        "tie" => $"Road {node}->{neighbor} ({time}) ties the shortest time {candidate}; ways is now {ways[neighbor]}.",
                        _ => $"Road {node}->{neighbor} ({time}) doesn't improve on {dist[neighbor]}.",
                    },
                    new NumberOfWaysState(node, neighbor, time, dist.ToList(), ways.ToList(), outcome, null),
                    [node.ToString(), neighbor.ToString()],
                    spanLines: 18);
            }
        }

        var answer = ways[n - 1];
        StepRecorder.Add(steps, ref stepNumber,
            $"Done: {answer} way(s) to arrive at intersection {n - 1} in the shortest time.",
            new NumberOfWaysState(-1, -1, -1, dist.ToList(), ways.ToList(), null, answer),
            [],
            spanLines: 2);

        return steps;
    }
}
