using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Runs an algorithm against the given input, capturing its execution as an
/// ordered sequence of steps for visualization and explanation.
/// </summary>
public interface IAlgorithmVisualizer<in TInput>
{
    string Id { get; }

    IReadOnlyList<AlgorithmStep> Run(TInput input);
}
