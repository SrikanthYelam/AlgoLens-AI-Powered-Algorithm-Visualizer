using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Largest Rectangle in Histogram via a monotonic increasing stack of bar
/// indices. Runs one index past the end with a sentinel height of 0 to flush
/// the stack (which also naturally handles an empty input with a single step).
/// </summary>
public sealed class LargestRectangleInHistogram : IAlgorithmVisualizer<IReadOnlyList<int>>
{
    public string Id => "largest-rectangle-in-histogram";

    public IReadOnlyList<AlgorithmStep> Run(IReadOnlyList<int> heights)
    {
        var steps = new List<AlgorithmStep>();
        var stack = new List<int>();
        var maxArea = 0;
        var stepNumber = 0;
        var n = heights.Count;

        for (var i = 0; i <= n; i++)
        {
            var currentHeight = i < n ? heights[i] : 0;
            var popped = new List<(int Index, int Height, int Width, int Area)>();

            while (stack.Count > 0 && heights[stack[^1]] >= currentHeight)
            {
                var topIndex = stack[^1];
                stack.RemoveAt(stack.Count - 1);
                var height = heights[topIndex];
                var width = stack.Count == 0 ? i : i - stack[^1] - 1;
                var area = height * width;
                popped.Add((topIndex, height, width, area));
                maxArea = Math.Max(maxArea, area);
            }

            var actionParts = new List<string>();
            foreach (var (index, height, width, area) in popped)
            {
                actionParts.Add($"Pop bar {index} (height {height}); width {width} → area {area}.");
            }

            var highlights = popped.Select(p => p.Index.ToString()).ToList();

            if (i < n)
            {
                stack.Add(i);
                actionParts.Add($"Push bar {i} (height {currentHeight}) onto the stack.");
                highlights.Add(i.ToString());
            }
            else
            {
                actionParts.Add("End of histogram reached; all remaining bars flushed from the stack.");
            }

            if (popped.Count > 0)
            {
                actionParts.Add($"Max area so far: {maxArea}.");
            }

            steps.Add(new AlgorithmStep(
                stepNumber++,
                string.Join(' ', actionParts),
                new HistogramState(heights.ToList(), i, stack.ToList(), maxArea),
                highlights));
        }

        return steps;
    }
}
