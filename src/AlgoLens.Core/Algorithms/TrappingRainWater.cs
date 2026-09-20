using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Trapping Rain Water via converging two pointers with running maxima. Water above a bar is
/// `min(tallest bar to its left, tallest bar to its right) - height`, and computing both maxima
/// per bar would be O(n²) or need extra arrays. The trick: at each step process whichever side has
/// the *shorter* current bar. If `height[left] < height[right]`, then a bar at least as tall as
/// `height[right]` already exists somewhere to the right, so the water above `left` is decided
/// entirely by `leftMax` — the unknown true right maximum can only be higher and can't change the
/// answer. A bar that is itself a new maximum holds nothing and just raises that side's max;
/// otherwise it holds `max - height`. Symmetric for the right side. The last bar left when the
/// pointers meet is the global maximum and traps nothing, so it is never processed. Ties process
/// the right side.
/// </summary>
public sealed class TrappingRainWater : IAlgorithmVisualizer<IReadOnlyList<int>>
{
    public string Id => "trapping-rain-water";

    public IReadOnlyList<AlgorithmStep> Run(IReadOnlyList<int> heights)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (heights.Count == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "No bars given; there is nothing to trap water.",
                new TrappingRainWaterState([], -1, -1, 0, 0, -1, [], 0), [], spanLines: 2);
            return steps;
        }

        var left = 0;
        var right = heights.Count - 1;
        var leftMax = 0;
        var rightMax = 0;
        var total = 0;
        var water = new int[heights.Count];

        while (left < right)
        {
            int current;
            string action;

            if (heights[left] < heights[right])
            {
                current = left;
                if (heights[left] >= leftMax)
                {
                    leftMax = heights[left];
                    action = $"Bar {left} (height {heights[left]}) is shorter than the right bar, and it's a new left max ({leftMax}) — it holds no water.";
                }
                else
                {
                    water[left] = leftMax - heights[left];
                    total += water[left];
                    action = $"Bar {left} (height {heights[left]}) is shorter than the right bar, so the left max {leftMax} sets its level — it holds {water[left]} water.";
                }
                left++;
            }
            else
            {
                current = right;
                if (heights[right] >= rightMax)
                {
                    rightMax = heights[right];
                    action = $"Bar {right} (height {heights[right]}) is the shorter (or equal) side, and it's a new right max ({rightMax}) — it holds no water.";
                }
                else
                {
                    water[right] = rightMax - heights[right];
                    total += water[right];
                    action = $"Bar {right} (height {heights[right]}) is the shorter (or equal) side, so the right max {rightMax} sets its level — it holds {water[right]} water.";
                }
                right--;
            }

            StepRecorder.Add(steps, ref stepNumber, action,
                new TrappingRainWaterState(heights.ToList(), left, right, leftMax, rightMax, current, water.ToList(), total),
                [current.ToString()],
                spanLines: 33);
        }

        StepRecorder.Add(steps, ref stepNumber,
            $"Done: {total} unit(s) of water trapped in total.",
            new TrappingRainWaterState(heights.ToList(), left, right, leftMax, rightMax, -1, water.ToList(), total),
            [],
            spanLines: 2);

        return steps;
    }
}
