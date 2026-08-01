using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Sliding Window Maximum via a monotonic decreasing deque of indices.
/// Captures one step per array index, bundling any front/back evictions
/// with the push and (once the window fills) the recorded max.
/// </summary>
public sealed class SlidingWindowMaximum : IAlgorithmVisualizer<SlidingWindowInput>
{
    public string Id => "sliding-window-maximum";

    public IReadOnlyList<AlgorithmStep> Run(SlidingWindowInput input)
    {
        var nums = input.Nums;
        var windowSize = input.WindowSize;
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (nums.Count == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "Array is empty; there are no windows to evaluate.",
                new SlidingWindowState([], windowSize, -1, [], []), [], spanLines: 2);
            return steps;
        }

        var deque = new LinkedList<int>();
        var result = new List<int>();

        for (var i = 0; i < nums.Count; i++)
        {
            var removedFront = new List<int>();
            while (deque.Count > 0 && deque.First!.Value <= i - windowSize)
            {
                removedFront.Add(nums[deque.First.Value]);
                deque.RemoveFirst();
            }

            var removedBack = new List<int>();
            while (deque.Count > 0 && nums[deque.Last!.Value] < nums[i])
            {
                removedBack.Add(nums[deque.Last.Value]);
                deque.RemoveLast();
            }

            deque.AddLast(i);

            var actionParts = new List<string>();
            if (removedFront.Count > 0)
            {
                actionParts.Add($"Remove {string.Join(", ", removedFront)} from the front (out of window).");
            }
            if (removedBack.Count > 0)
            {
                actionParts.Add(
                    $"Remove {string.Join(", ", removedBack)} from the back ({nums[i]} is larger and will outlast them).");
            }
            actionParts.Add($"Add {nums[i]} to the deque.");

            var highlights = new List<string> { nums[i].ToString() };
            highlights.AddRange(removedFront.Select(v => v.ToString()));
            highlights.AddRange(removedBack.Select(v => v.ToString()));

            if (i >= windowSize - 1)
            {
                var max = nums[deque.First!.Value];
                result.Add(max);
                actionParts.Add($"Window [{i - windowSize + 1}..{i}] complete: max is {max}.");
            }

            StepRecorder.Add(steps, ref stepNumber,
                string.Join(' ', actionParts),
                new SlidingWindowState(
                    nums.ToList(),
                    windowSize,
                    i,
                    deque.Select(idx => nums[idx]).ToList(),
                    result.ToList()),
                highlights,
                spanLines: 39);
        }

        return steps;
    }
}
