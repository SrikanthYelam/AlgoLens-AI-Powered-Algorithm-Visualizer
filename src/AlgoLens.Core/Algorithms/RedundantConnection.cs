using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Redundant Connection via Union-Find: the input describes a tree (n nodes, n-1 edges) plus one
/// extra edge that creates exactly one cycle. Processing edges in order and unioning their
/// endpoints, the very first edge whose two endpoints are *already* in the same set is
/// necessarily the one that closes that cycle — every genuine tree edge always connects two
/// previously-separate components, so the first union that fails is the answer, found without
/// ever needing to detect the cycle by any other means.
/// </summary>
public sealed class RedundantConnection : IAlgorithmVisualizer<int[][]>
{
    public string Id => "redundant-connection";

    public IReadOnlyList<AlgorithmStep> Run(int[][] edges)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;
        var n = edges.Length;

        if (n == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "No edges given.",
                new RedundantConnectionState(0, [], -1, -1, null), [], spanLines: 2);
            return steps;
        }

        var parent = new int[n + 1];
        for (var i = 0; i <= n; i++)
        {
            parent[i] = i;
        }

        int Find(int x)
        {
            if (parent[x] != x)
            {
                parent[x] = Find(parent[x]);
            }
            return parent[x];
        }

        foreach (var edge in edges)
        {
            var u = edge[0];
            var v = edge[1];
            var rootU = Find(u);
            var rootV = Find(v);

            if (rootU == rootV)
            {
                StepRecorder.Add(steps, ref stepNumber,
                    $"Edge ({u}, {v}): {u} and {v} are already connected — this edge closes a cycle, it's redundant.",
                    new RedundantConnectionState(n, parent.ToList(), u, v, [u, v]),
                    [u.ToString(), v.ToString()],
                    spanLines: 7);
                return steps;
            }

            parent[rootV] = rootU;

            StepRecorder.Add(steps, ref stepNumber,
                $"Edge ({u}, {v}): union {u} and {v}.",
                new RedundantConnectionState(n, parent.ToList(), u, v, null),
                [u.ToString(), v.ToString()],
                spanLines: 17);
        }

        return steps;
    }
}
