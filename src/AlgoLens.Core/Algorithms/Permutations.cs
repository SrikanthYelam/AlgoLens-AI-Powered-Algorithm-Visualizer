using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Permutations via classic used[]-array backtracking. Captures one step per
/// choose, one per backtrack (undo), and one whenever a full permutation is
/// recorded.
/// </summary>
public sealed class Permutations : IAlgorithmVisualizer<IReadOnlyList<int>>
{
    public string Id => "permutations";

    public IReadOnlyList<AlgorithmStep> Run(IReadOnlyList<int> nums)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (nums.Count == 0)
        {
            steps.Add(new AlgorithmStep(0, "No elements to permute.", new BacktrackingState([], []), []));
            return steps;
        }

        var path = new List<int>();
        var used = new bool[nums.Count];
        var solutions = new List<IReadOnlyList<int>>();

        void Backtrack()
        {
            if (path.Count == nums.Count)
            {
                solutions.Add(path.ToList());
                steps.Add(new AlgorithmStep(
                    stepNumber++,
                    $"Complete permutation found: [{string.Join(", ", path)}].",
                    new BacktrackingState(path.ToList(), solutions.ToList()),
                    path.Select(v => v.ToString()).ToList()));
                return;
            }

            for (var i = 0; i < nums.Count; i++)
            {
                if (used[i])
                {
                    continue;
                }

                used[i] = true;
                path.Add(nums[i]);
                steps.Add(new AlgorithmStep(
                    stepNumber++,
                    $"Choose {nums[i]}; path is now [{string.Join(", ", path)}].",
                    new BacktrackingState(path.ToList(), solutions.ToList()),
                    [nums[i].ToString()]));

                Backtrack();

                var removed = path[^1];
                path.RemoveAt(path.Count - 1);
                used[i] = false;
                steps.Add(new AlgorithmStep(
                    stepNumber++,
                    $"Backtrack: remove {removed} from path.",
                    new BacktrackingState(path.ToList(), solutions.ToList()),
                    [removed.ToString()]));
            }
        }

        Backtrack();
        return steps;
    }
}
