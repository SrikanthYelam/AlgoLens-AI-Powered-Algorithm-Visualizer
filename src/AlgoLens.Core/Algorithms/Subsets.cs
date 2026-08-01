using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// All subsets (power set) of nums via backtracking. Unlike Combinations,
/// every node visited — not just leaves — is a recorded solution.
/// </summary>
public sealed class Subsets : IAlgorithmVisualizer<IReadOnlyList<int>>
{
    public string Id => "subsets";

    public IReadOnlyList<AlgorithmStep> Run(IReadOnlyList<int> nums)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;
        var path = new List<int>();
        var solutions = new List<IReadOnlyList<int>>();

        void Backtrack(int start)
        {
            solutions.Add(path.ToList());
            StepRecorder.Add(steps, ref stepNumber,
                $"Record subset [{string.Join(", ", path)}].",
                new BacktrackingState(path.ToList(), solutions.ToList()),
                path.Select(v => v.ToString()).ToList(),
                spanLines: 1);

            for (var i = start; i < nums.Count; i++)
            {
                path.Add(nums[i]);
                StepRecorder.Add(steps, ref stepNumber,
                    $"Choose {nums[i]}; path is now [{string.Join(", ", path)}].",
                    new BacktrackingState(path.ToList(), solutions.ToList()),
                    [nums[i].ToString()],
                    spanLines: 1);

                Backtrack(i + 1);

                var removed = path[^1];
                path.RemoveAt(path.Count - 1);
                StepRecorder.Add(steps, ref stepNumber,
                    $"Backtrack: remove {removed} from path.",
                    new BacktrackingState(path.ToList(), solutions.ToList()),
                    [removed.ToString()],
                    spanLines: 2);
            }
        }

        Backtrack(0);
        return steps;
    }
}
