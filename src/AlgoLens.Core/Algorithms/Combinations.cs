using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Combinations of K values chosen from 1..N via backtracking, using a
/// `start` index to prevent reuse and reordering.
/// </summary>
public sealed class Combinations : IAlgorithmVisualizer<CombinationsInput>
{
    public string Id => "combinations";

    public IReadOnlyList<AlgorithmStep> Run(CombinationsInput input)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (input.K <= 0 || input.K > input.N)
        {
            steps.Add(new AlgorithmStep(
                0, "No valid combinations for the given n and k.", new BacktrackingState([], []), []));
            return steps;
        }

        var path = new List<int>();
        var solutions = new List<IReadOnlyList<int>>();

        void Backtrack(int start)
        {
            if (path.Count == input.K)
            {
                solutions.Add(path.ToList());
                steps.Add(new AlgorithmStep(
                    stepNumber++,
                    $"Complete combination found: [{string.Join(", ", path)}].",
                    new BacktrackingState(path.ToList(), solutions.ToList()),
                    path.Select(v => v.ToString()).ToList()));
                return;
            }

            for (var i = start; i <= input.N; i++)
            {
                path.Add(i);
                steps.Add(new AlgorithmStep(
                    stepNumber++,
                    $"Choose {i}; path is now [{string.Join(", ", path)}].",
                    new BacktrackingState(path.ToList(), solutions.ToList()),
                    [i.ToString()]));

                Backtrack(i + 1);

                var removed = path[^1];
                path.RemoveAt(path.Count - 1);
                steps.Add(new AlgorithmStep(
                    stepNumber++,
                    $"Backtrack: remove {removed} from path.",
                    new BacktrackingState(path.ToList(), solutions.ToList()),
                    [removed.ToString()]));
            }
        }

        Backtrack(1);
        return steps;
    }
}
