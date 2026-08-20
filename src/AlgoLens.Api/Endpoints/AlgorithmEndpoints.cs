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
            request => TreeNode.FromLevelOrderArray(request.Values),
            judge: new JudgeConfig<TreeNode?>(
                root => new Dictionary<string, object?> { ["root"] = root },
                "Solve((TreeNode?)Args[\"root\"])",
                steps => ((TreeTraversalState)steps[^1].State).CompletedLevels));

        MapAlgorithm<SlidingWindowMaximum, SlidingWindowRequest, SlidingWindowInput>(
            app,
            "/api/algorithms/sliding-window-maximum",
            request => new SlidingWindowInput(request.Nums, request.WindowSize),
            judge: new JudgeConfig<SlidingWindowInput>(
                input => new Dictionary<string, object?> { ["nums"] = input.Nums.ToArray(), ["k"] = input.WindowSize },
                "Solve((int[])Args[\"nums\"], (int)Args[\"k\"])",
                steps => ((SlidingWindowState)steps[^1].State).Result));

        MapAlgorithm<LargestRectangleInHistogram, HistogramRequest, IReadOnlyList<int>>(
            app,
            "/api/algorithms/largest-rectangle-in-histogram",
            request => request.Heights,
            judge: new JudgeConfig<IReadOnlyList<int>>(
                heights => new Dictionary<string, object?> { ["heights"] = heights.ToArray() },
                "Solve((int[])Args[\"heights\"])",
                steps => ((HistogramState)steps[^1].State).MaxArea));

        MapAlgorithm<NumberOfIslands, IslandsRequest, int[][]>(
            app,
            "/api/algorithms/number-of-islands",
            request => request.Grid,
            judge: new JudgeConfig<int[][]>(
                grid => new Dictionary<string, object?> { ["grid"] = grid },
                "Solve((int[][])Args[\"grid\"])",
                steps => ((IslandsState)steps[^1].State).IslandCount));

        MapAlgorithm<Permutations, PermutationsRequest, IReadOnlyList<int>>(
            app,
            "/api/algorithms/permutations",
            request => request.Nums,
            judge: new JudgeConfig<IReadOnlyList<int>>(
                nums => new Dictionary<string, object?> { ["nums"] = nums.ToArray() },
                "Solve((int[])Args[\"nums\"])",
                steps => ((BacktrackingState)steps[^1].State).Solutions));

        MapAlgorithm<Combinations, CombinationsRequest, CombinationsInput>(
            app,
            "/api/algorithms/combinations",
            request => new CombinationsInput(request.N, request.K),
            judge: new JudgeConfig<CombinationsInput>(
                input => new Dictionary<string, object?> { ["n"] = input.N, ["k"] = input.K },
                "Solve((int)Args[\"n\"], (int)Args[\"k\"])",
                steps => ((BacktrackingState)steps[^1].State).Solutions));

        MapAlgorithm<Subsets, SubsetsRequest, IReadOnlyList<int>>(
            app,
            "/api/algorithms/subsets",
            request => request.Nums,
            judge: new JudgeConfig<IReadOnlyList<int>>(
                nums => new Dictionary<string, object?> { ["nums"] = nums.ToArray() },
                "Solve((int[])Args[\"nums\"])",
                steps => ((BacktrackingState)steps[^1].State).Solutions));

        MapAlgorithm<NQueens, NQueensRequest, int>(
            app,
            "/api/algorithms/n-queens",
            request => request.BoardSize,
            judge: new JudgeConfig<int>(
                n => new Dictionary<string, object?> { ["n"] = n },
                "Solve((int)Args[\"n\"])",
                steps => ((NQueensState)steps[^1].State).Solutions.Count));

        MapAlgorithm<LetterCombinationsOfPhoneNumber, LetterCombinationsRequest, string>(
            app,
            "/api/algorithms/letter-combinations-of-a-phone-number",
            request => request.Digits,
            judge: new JudgeConfig<string>(
                digits => new Dictionary<string, object?> { ["digits"] = digits },
                "Solve((string)Args[\"digits\"])",
                steps => ((StringBacktrackingState)steps[^1].State).Solutions));

        MapAlgorithm<TaskSchedulerAlgorithm, TaskSchedulerRequest, TaskSchedulerInput>(
            app,
            "/api/algorithms/task-scheduler",
            request => new TaskSchedulerInput(request.Tasks.ToCharArray(), request.N),
            judge: new JudgeConfig<TaskSchedulerInput>(
                input => new Dictionary<string, object?> { ["tasks"] = input.Tasks.ToArray(), ["n"] = input.Cooldown },
                "Solve((char[])Args[\"tasks\"], (int)Args[\"n\"])",
                steps => ((TaskSchedulerState)steps[^1].State).CurrentTick));

        MapAlgorithm<GenerateParentheses, GenerateParenthesesRequest, int>(
            app,
            "/api/algorithms/generate-parentheses",
            request => request.N,
            judge: new JudgeConfig<int>(
                n => new Dictionary<string, object?> { ["n"] = n },
                "Solve((int)Args[\"n\"])",
                steps => ((StringBacktrackingState)steps[^1].State).Solutions));

        MapAlgorithm<RemoveInvalidParenthesesBfs, RemoveInvalidParenthesesRequest, string>(
            app,
            "/api/algorithms/remove-invalid-parentheses-bfs",
            request => request.S,
            judge: new JudgeConfig<string>(
                s => new Dictionary<string, object?> { ["s"] = s },
                "Solve((string)Args[\"s\"])",
                steps => ((RemoveInvalidParenthesesBfsState)steps[^1].State).Results));

        MapAlgorithm<RemoveInvalidParenthesesDfs, RemoveInvalidParenthesesRequest, string>(
            app,
            "/api/algorithms/remove-invalid-parentheses-dfs",
            request => request.S,
            judge: new JudgeConfig<string>(
                s => new Dictionary<string, object?> { ["s"] = s },
                "Solve((string)Args[\"s\"])",
                steps => ((RemoveInvalidParenthesesDfsState)steps[^1].State).Results));

        MapAlgorithm<LongestCommonSubsequence, LongestCommonSubsequenceRequest, LongestCommonSubsequenceInput>(
            app,
            "/api/algorithms/longest-common-subsequence",
            request => new LongestCommonSubsequenceInput(request.Text1, request.Text2),
            judge: new JudgeConfig<LongestCommonSubsequenceInput>(
                input => new Dictionary<string, object?> { ["text1"] = input.Text1, ["text2"] = input.Text2 },
                "Solve((string)Args[\"text1\"], (string)Args[\"text2\"])",
                steps =>
                {
                    var table = ((LongestCommonSubsequenceState)steps[^1].State).Table;
                    return table.Count == 0 ? 0 : table[^1][^1];
                }));

        MapAlgorithm<LongestPalindromicSubsequence, LongestPalindromicSubsequenceRequest, string>(
            app,
            "/api/algorithms/longest-palindromic-subsequence",
            request => request.S,
            judge: new JudgeConfig<string>(
                s => new Dictionary<string, object?> { ["s"] = s },
                "Solve((string)Args[\"s\"])",
                steps =>
                {
                    var table = ((LongestPalindromicSubsequenceState)steps[^1].State).Table;
                    return table.Count == 0 ? 0 : table[0][^1];
                }));

        MapAlgorithm<LongestIncreasingSubsequence, LongestIncreasingSubsequenceRequest, IReadOnlyList<int>>(
            app,
            "/api/algorithms/longest-increasing-subsequence",
            request => request.Nums,
            judge: new JudgeConfig<IReadOnlyList<int>>(
                nums => new Dictionary<string, object?> { ["nums"] = nums.ToArray() },
                "Solve((int[])Args[\"nums\"])",
                steps =>
                {
                    var table = ((LongestIncreasingSubsequenceState)steps[^1].State).Table;
                    return table.Count == 0 ? 0 : table[0][0];
                }));
    }

    // Explain individual steps after a run. Accepts { steps: StepDto[] } and returns { explanations: string[] }.
    public static void MapExplainEndpoint(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/algorithms/{algorithmId}/explain", async (
            string algorithmId,
            ExplainRequest request,
            IStepExplanationService explanations,
            CancellationToken cancellationToken) =>
        {
            var algoSteps = request.Steps
                .Select(s => new AlgorithmStep(
                    s.StepNumber,
                    s.Action,
                    s.State,
                    s.Highlights,
                    s.SourceLineStart,
                    s.SourceLineEnd))
                .ToList();

            var texts = await explanations.ExplainStepsAsync(algorithmId, algoSteps, cancellationToken);
            return Results.Ok(new { explanations = texts });
        })
        .WithName("ExplainSteps")
        .WithOpenApi();
    }

    private sealed record ExplainRequest(IReadOnlyList<StepDto> Steps);

    /// <summary>
    /// Wires the "Try Your Own Solution" judge for one algorithm: <see cref="BuildArgs"/> turns the
    /// already-parsed <typeparamref name="TInput"/> into the named arguments a generated script call
    /// can reference, <see cref="InvocationExpression"/> is that call (its cast types must match the
    /// algorithm's documented `Solve` signature, shown to the user via the registry's
    /// `judgeSignature`), and <see cref="ExtractExpectedAnswer"/> reads the canonical answer back out
    /// of the last captured step's concrete state.
    /// </summary>
    private sealed record JudgeConfig<TInput>(
        Func<TInput, IReadOnlyDictionary<string, object?>> BuildArgs,
        string InvocationExpression,
        Func<IReadOnlyList<AlgorithmStep>, object?> ExtractExpectedAnswer);

    private static void MapAlgorithm<TAlgorithm, TRequest, TInput>(
        IEndpointRouteBuilder app,
        string route,
        Func<TRequest, TInput> toAlgorithmInput,
        JudgeConfig<TInput>? judge = null)
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

        if (judge is not null)
        {
            app.MapPost($"{route}/submit", async (
                SubmitSolutionRequest<TRequest> request,
                TAlgorithm algorithm,
                IUserSolutionJudge judgeService,
                CancellationToken cancellationToken) =>
            {
                var input = toAlgorithmInput(request.Input);
                var canonicalSteps = algorithm.Run(input);
                var expected = judge.ExtractExpectedAnswer(canonicalSteps);
                var args = judge.BuildArgs(input);

                var result = await judgeService.RunAsync(
                    request.Code, judge.InvocationExpression, args, TimeSpan.FromSeconds(5), cancellationToken);

                return Results.Ok(new SubmitSolutionResponse(
                    result.CompileSucceeded,
                    result.CompileErrors,
                    result.RanSuccessfully,
                    result.RuntimeError,
                    result.ReturnValue,
                    expected,
                    result.ElapsedMilliseconds));
            })
            .WithName($"{typeof(TAlgorithm).Name}Submit")
            .WithOpenApi();
        }
    }
}
