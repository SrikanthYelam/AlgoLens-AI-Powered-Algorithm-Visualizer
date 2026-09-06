using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Unique Binary Search Trees (Catalan numbers) via 1D bottom-up dynamic programming. dp[i] is the
/// number of structurally unique BSTs over i nodes with distinct keys. For each i from 1 to n,
/// every value j from 1 to i is tried as the root: it splits the other i-1 nodes into a left
/// subtree of j-1 nodes and a right subtree of i-j nodes, and since left/right shapes combine
/// independently, that root contributes dp[j-1] * dp[i-j] distinct trees. Summing over every choice
/// of root gives dp[i]. One step per (i, j) pair, showing the running sum accumulate into dp[i].
/// dp[0] = 1 (the empty tree) is the base case every row ultimately depends on.
/// </summary>
public sealed class UniqueBinarySearchTrees : IAlgorithmVisualizer<int>
{
    public string Id => "unique-binary-search-trees";

    public IReadOnlyList<AlgorithmStep> Run(int n)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (n <= 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "n is 0 or negative; there is exactly one (empty) tree.",
                new UniqueBstCountState(n, [1], 0, 0, 0), [], spanLines: 2);
            return steps;
        }

        var dp = new int[n + 1];
        dp[0] = 1;

        for (var i = 1; i <= n; i++)
        {
            for (var j = 1; j <= i; j++)
            {
                var left = dp[j - 1];
                var right = dp[i - j];
                var contribution = left * right;
                dp[i] += contribution;

                var action =
                    $"Root {j}: left has {j - 1} node(s) -> {left} way(s), right has {i - j} node(s) -> {right} way(s). " +
                    $"dp[{i}] += {left} * {right} = {contribution}, now {dp[i]}.";

                StepRecorder.Add(steps, ref stepNumber, action,
                    new UniqueBstCountState(n, dp.ToList(), i, j, contribution),
                    [i.ToString()],
                    spanLines: 9);
            }
        }

        return steps;
    }
}
