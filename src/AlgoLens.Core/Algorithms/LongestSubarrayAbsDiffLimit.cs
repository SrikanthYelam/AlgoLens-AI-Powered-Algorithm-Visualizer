using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Longest Continuous Subarray With Absolute Diff Less Than Or Equal To Limit, via a sliding
/// window guarded by two monotonic deques of indices: <c>maxDeque</c> decreasing (front holds the
/// window's max) and <c>minDeque</c> increasing (front holds the window's min). One step per right
/// index — expand by pushing onto both deques, then shrink from the left, bundled with the
/// eviction, while <c>max - min</c> exceeds <c>limit</c>.
/// </summary>
public sealed class LongestSubarrayAbsDiffLimit : IAlgorithmVisualizer<LongestSubarrayAbsDiffLimitInput>
{
    public string Id => "longest-continuous-subarray-abs-diff-limit";

    public IReadOnlyList<AlgorithmStep> Run(LongestSubarrayAbsDiffLimitInput input)
    {
        var nums = input.Nums;
        var limit = input.Limit;
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (nums.Count == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "Array is empty; the longest valid subarray has length 0.",
                new LongestSubarrayAbsDiffLimitState([], limit, 0, -1, [], [], 0, 0), [], spanLines: 2);
            return steps;
        }

        var maxDeque = new LinkedList<int>();
        var minDeque = new LinkedList<int>();
        var left = 0;
        var bestStart = 0;
        var bestLength = 0;

        for (var right = 0; right < nums.Count; right++)
        {
            var removedMax = new List<int>();
            while (maxDeque.Count > 0 && nums[maxDeque.Last!.Value] < nums[right])
            {
                removedMax.Add(nums[maxDeque.Last.Value]);
                maxDeque.RemoveLast();
            }
            maxDeque.AddLast(right);

            var removedMin = new List<int>();
            while (minDeque.Count > 0 && nums[minDeque.Last!.Value] > nums[right])
            {
                removedMin.Add(nums[minDeque.Last.Value]);
                minDeque.RemoveLast();
            }
            minDeque.AddLast(right);

            var actionParts = new List<string>();
            if (removedMax.Count > 0)
            {
                actionParts.Add($"Pop {string.Join(", ", removedMax)} from the max deque's back ({nums[right]} outlasts them).");
            }
            if (removedMin.Count > 0)
            {
                actionParts.Add($"Pop {string.Join(", ", removedMin)} from the min deque's back ({nums[right]} outlasts them).");
            }
            actionParts.Add($"Push index {right} (value {nums[right]}) onto both deques.");

            var shrunk = new List<int>();
            while (nums[maxDeque.First!.Value] - nums[minDeque.First!.Value] > limit)
            {
                shrunk.Add(nums[left]);
                if (maxDeque.First.Value == left)
                {
                    maxDeque.RemoveFirst();
                }
                if (minDeque.First.Value == left)
                {
                    minDeque.RemoveFirst();
                }
                left++;
            }
            if (shrunk.Count > 0)
            {
                actionParts.Add(
                    $"Window diff ({nums[maxDeque.First!.Value]} - {nums[minDeque.First!.Value]}) would exceed {limit}: shrink left past {string.Join(", ", shrunk)}.");
            }

            var windowLength = right - left + 1;
            if (windowLength > bestLength)
            {
                bestLength = windowLength;
                bestStart = left;
                actionParts.Add($"Window [{left}..{right}] is valid and the longest so far, length {bestLength}.");
            }

            var highlights = new List<string> { nums[right].ToString() };
            highlights.AddRange(removedMax.Select(v => v.ToString()));
            highlights.AddRange(removedMin.Select(v => v.ToString()));
            highlights.AddRange(shrunk.Select(v => v.ToString()));

            StepRecorder.Add(steps, ref stepNumber,
                string.Join(' ', actionParts),
                new LongestSubarrayAbsDiffLimitState(
                    nums.ToList(),
                    limit,
                    left,
                    right,
                    maxDeque.Select(idx => nums[idx]).ToList(),
                    minDeque.Select(idx => nums[idx]).ToList(),
                    bestStart,
                    bestLength),
                highlights,
                spanLines: 60);
        }

        return steps;
    }
}
