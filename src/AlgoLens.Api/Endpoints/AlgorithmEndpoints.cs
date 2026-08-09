using AlgoLens.Api.Contracts;
using AlgoLens.Api.Services;
using AlgoLens.Core;
using AlgoLens.Core.Algorithms;
using AlgoLens.Core.Models;

namespace AlgoLens.Api.Endpoints;

public static class AlgorithmEndpoints
{
    public static void MapAlgorithmEndpoints(this IEndpointRouteBuilder app)
    {
        MapAlgorithm<BinaryTreeLevelOrderTraversal, TraversalRequest, TreeNode?>(
            app,
            "/api/algorithms/binary-tree-level-order-traversal",
            request => TreeNode.FromLevelOrderArray(request.Values));

        MapAlgorithm<SlidingWindowMaximum, SlidingWindowRequest, SlidingWindowInput>(
            app,
            "/api/algorithms/sliding-window-maximum",
            request => new SlidingWindowInput(request.Nums, request.WindowSize));

        MapAlgorithm<LargestRectangleInHistogram, HistogramRequest, IReadOnlyList<int>>(
            app,
            "/api/algorithms/largest-rectangle-in-histogram",
            request => request.Heights);

        MapAlgorithm<NumberOfIslands, IslandsRequest, int[][]>(
            app,
            "/api/algorithms/number-of-islands",
            request => request.Grid);

        MapAlgorithm<Permutations, PermutationsRequest, IReadOnlyList<int>>(
            app,
            "/api/algorithms/permutations",
            request => request.Nums);

        MapAlgorithm<Combinations, CombinationsRequest, CombinationsInput>(
            app,
            "/api/algorithms/combinations",
            request => new CombinationsInput(request.N, request.K));

        MapAlgorithm<Subsets, SubsetsRequest, IReadOnlyList<int>>(
            app,
            "/api/algorithms/subsets",
            request => request.Nums);

        MapAlgorithm<NQueens, NQueensRequest, int>(
            app,
            "/api/algorithms/n-queens",
            request => request.BoardSize);

        MapAlgorithm<LetterCombinationsOfPhoneNumber, LetterCombinationsRequest, string>(
            app,
            "/api/algorithms/letter-combinations-of-a-phone-number",
            request => request.Digits);

        MapAlgorithm<TaskSchedulerAlgorithm, TaskSchedulerRequest, TaskSchedulerInput>(
            app,
            "/api/algorithms/task-scheduler",
            request => new TaskSchedulerInput(request.Tasks.ToCharArray(), request.N));
    }

    private static void MapAlgorithm<TAlgorithm, TRequest, TInput>(
        IEndpointRouteBuilder app,
        string route,
        Func<TRequest, TInput> toAlgorithmInput)
        where TAlgorithm : IAlgorithmVisualizer<TInput>
    {
        app.MapPost(route, async (
            TRequest request,
            TAlgorithm algorithm,
            IStepExplanationService explanations,
            CancellationToken cancellationToken) =>
        {
            var steps = algorithm.Run(toAlgorithmInput(request));
            var explanationTexts = await explanations.ExplainStepsAsync(algorithm.Id, steps, cancellationToken);

            var stepDtos = steps
                .Select((step, i) => new StepDto(
                    step.StepNumber,
                    step.Action,
                    step.State,
                    step.Highlights,
                    step.SourceLineStart,
                    step.SourceLineEnd,
                    explanationTexts.ElementAtOrDefault(i)))
                .ToList();

            return Results.Ok(new TraversalResponse(algorithm.Id, stepDtos));
        })
        .WithName(typeof(TAlgorithm).Name)
        .WithOpenApi();

        app.MapGet($"{route}/source", () =>
            Results.Ok(new AlgorithmSourceResponse("csharp", AlgorithmSource.Get(typeof(TAlgorithm)))))
        .WithName($"{typeof(TAlgorithm).Name}Source")
        .WithOpenApi();
    }
}
