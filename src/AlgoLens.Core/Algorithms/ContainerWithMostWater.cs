using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Container With Most Water via converging two pointers: start with the widest possible container
/// (`left` at the first bar, `right` at the last), record its area (`min(height) * width`), then
/// move whichever pointer sits on the *shorter* bar inward. That is safe because the shorter bar
/// caps the container's height: keeping it and shrinking the width can only make the area smaller
/// or equal, so no container using that shorter bar with a narrower width can beat the one just
/// measured — that bar can be discarded for good. Ties move `right`. Each step evaluates one
/// container, so it runs `n - 1` steps before the pointers meet.
/// </summary>
public sealed class ContainerWithMostWater : IAlgorithmVisualizer<IReadOnlyList<int>>
{
    public string Id => "container-with-most-water";

    public IReadOnlyList<AlgorithmStep> Run(IReadOnlyList<int> heights)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (heights.Count == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "No bars given; there is no container to form.",
                new ContainerWithMostWaterState([], -1, -1, 0, 0, -1, -1), [], spanLines: 2);
            return steps;
        }

        var left = 0;
        var right = heights.Count - 1;
        var maxArea = 0;
        var bestLeft = -1;
        var bestRight = -1;

        while (left < right)
        {
            var height = Math.Min(heights[left], heights[right]);
            var area = height * (right - left);
            var action = $"Container between {left} and {right}: width {right - left} × height min({heights[left]}, {heights[right]}) = {height} → area {area}.";

            if (area > maxArea)
            {
                maxArea = area;
                bestLeft = left;
                bestRight = right;
                action += " New best!";
            }

            var moveLeft = heights[left] < heights[right];
            action += moveLeft
                ? $" Bar {left} is the shorter side — move the left pointer in."
                : $" Bar {right} is the shorter (or equal) side — move the right pointer in.";

            StepRecorder.Add(steps, ref stepNumber, action,
                new ContainerWithMostWaterState(heights.ToList(), left, right, area, maxArea, bestLeft, bestRight),
                [left.ToString(), right.ToString()],
                spanLines: 17);

            if (moveLeft)
            {
                left++;
            }
            else
            {
                right--;
            }
        }

        StepRecorder.Add(steps, ref stepNumber,
            bestLeft < 0
                ? "Done: fewer than two bars, so no container can hold water (max area 0)."
                : $"Done: the largest container spans bars {bestLeft} and {bestRight} with area {maxArea}.",
            new ContainerWithMostWaterState(heights.ToList(), bestLeft, bestRight, maxArea, maxArea, bestLeft, bestRight),
            [],
            spanLines: 2);

        return steps;
    }
}
