using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Number of Provinces via Union-Find (disjoint set union): every city starts as its own
/// province (`parent[i] = i`); for each pair of directly-connected cities, union their
/// provinces. Path compression (`Find` rewrites each visited node straight to its root) keeps
/// later lookups cheap. The answer is simply how many provinces remain once every connection has
/// been processed, tracked incrementally rather than counted at the end — each successful union
/// merges two previously-separate provinces into one, so it decrements the running count exactly
/// once per merge.
/// </summary>
public sealed class NumberOfProvinces : IAlgorithmVisualizer<int[][]>
{
    public string Id => "number-of-provinces";

    public IReadOnlyList<AlgorithmStep> Run(int[][] isConnected)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;
        var n = isConnected.Length;

        if (n == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "No cities to group.",
                new NumberOfProvincesState(0, [], -1, -1, 0), [], spanLines: 2);
            return steps;
        }

        var parent = new int[n];
        for (var i = 0; i < n; i++)
        {
            parent[i] = i;
        }
        var components = n;

        int Find(int x)
        {
            if (parent[x] != x)
            {
                parent[x] = Find(parent[x]);
            }
            return parent[x];
        }

        for (var i = 0; i < n; i++)
        {
            for (var j = i + 1; j < n; j++)
            {
                if (isConnected[i][j] != 1)
                {
                    continue;
                }

                var rootI = Find(i);
                var rootJ = Find(j);

                string action;
                if (rootI != rootJ)
                {
                    parent[rootJ] = rootI;
                    components--;
                    action = $"City {i} and {j} are connected — union their provinces (now {components}).";
                }
                else
                {
                    action = $"City {i} and {j} are connected, but already in the same province.";
                }

                StepRecorder.Add(steps, ref stepNumber, action,
                    new NumberOfProvincesState(n, parent.ToList(), i, j, components),
                    [i.ToString(), j.ToString()],
                    spanLines: 15);
            }
        }

        StepRecorder.Add(steps, ref stepNumber,
            $"Done: {components} province(s).",
            new NumberOfProvincesState(n, parent.ToList(), -1, -1, components),
            [],
            spanLines: 1);

        return steps;
    }
}
