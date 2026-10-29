using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Longest Increasing Subsequence in O(n log n) via a "tails" array and binary search: tails[k] is
/// the smallest possible last element of any strictly increasing subsequence of length k + 1 found
/// so far. tails is always sorted, so for each number a binary search finds the first tail that is
/// >= it (strict increase means an equal tail must be replaced, not extended). If every tail is
/// smaller, the number extends the longest subsequence and is appended; otherwise it replaces that
/// tail with a smaller value, which can only make later extensions easier. tails is not itself a
/// valid subsequence — only its length is meaningful, and that length is the answer.
/// </summary>
public sealed class LongestIncreasingSubsequenceBinarySearch : IAlgorithmVisualizer<IReadOnlyList<int>>
{
    public string Id => "longest-increasing-subsequence-binary-search";

    public IReadOnlyList<AlgorithmStep> Run(IReadOnlyList<int> nums)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (nums.Count == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "Empty input; the longest increasing subsequence has length 0.",
                new LongestIncreasingSubsequenceBinarySearchState([], [], -1, [], -1), [], spanLines: 2);
            return steps;
        }

        var tails = new List<int>();

        for (var i = 0; i < nums.Count; i++)
        {
            var lo = 0;
            var hi = tails.Count;
            var probes = new List<int>();
            while (lo < hi)
            {
                var mid = (lo + hi) / 2;
                probes.Add(mid);
                if (tails[mid] < nums[i]) lo = mid + 1; else hi = mid;
            }

            var replaced = lo < tails.Count;
            var old = replaced ? tails[lo] : 0;
            if (replaced) tails[lo] = nums[i]; else tails.Add(nums[i]);

            var action = replaced
                ? $"Binary search puts {nums[i]} at tails[{lo}] (first tail >= {nums[i]}): replace {old} with {nums[i]}, a smaller tail for length {lo + 1}."
                : $"Every tail is < {nums[i]}, so it extends the longest subsequence: append at tails[{lo}]; length is now {tails.Count}.";

            StepRecorder.Add(steps, ref stepNumber, action,
                new LongestIncreasingSubsequenceBinarySearchState(nums.ToList(), tails.ToList(), i, probes, lo),
                [$"{lo}"],
                spanLines: 18);
        }

        StepRecorder.Add(steps, ref stepNumber,
            $"Done: the longest increasing subsequence has length {tails.Count}.",
            new LongestIncreasingSubsequenceBinarySearchState(nums.ToList(), tails.ToList(), -1, [], -1), [], spanLines: 1);

        return steps;
    }
}
