using System.Diagnostics;
using AlgoLens.Core.Models;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Scripting;
using Microsoft.CodeAnalysis.Scripting;

namespace AlgoLens.Api.Services;

/// <summary>
/// Globals type exposed to user-submitted scripts. A single generic <c>Args</c> dictionary
/// (rather than one bespoke globals class per algorithm) is enough because the invocation
/// expression generated per algorithm already knows which keys to pull out and how to cast them.
/// </summary>
public sealed class JudgeGlobals
{
    public IReadOnlyDictionary<string, object?> Args { get; init; } = new Dictionary<string, object?>();
}

public sealed record JudgeResult(
    bool CompileSucceeded,
    IReadOnlyList<string> CompileErrors,
    bool RanSuccessfully,
    string? RuntimeError,
    object? ReturnValue,
    long ElapsedMilliseconds);

public interface IUserSolutionJudge
{
    Task<JudgeResult> RunAsync(
        string userCode,
        string invocationExpression,
        IReadOnlyDictionary<string, object?> args,
        TimeSpan timeout,
        CancellationToken cancellationToken);
}

/// <summary>
/// Compiles and runs user-submitted C# in-process via Roslyn scripting.
///
/// This is NOT a sandbox: there is no process isolation and no memory cap. The
/// <paramref name="timeout"/> passed to <see cref="RunAsync"/> is enforced by racing the script
/// against a <see cref="Task.Delay(TimeSpan, CancellationToken)"/> — if the delay wins, the caller
/// gets a prompt "timed out" result instead of hanging indefinitely, but the script keeps running
/// on its own thread-pool thread in the background regardless, because .NET has no supported way
/// to forcibly abort a running managed thread. A tight synchronous loop (e.g. <c>while (true) {}</c>)
/// therefore still permanently consumes one thread-pool thread until the whole API process is
/// restarted — this service only protects the HTTP request from hanging, not the server's
/// resources. That gap is intentional and deferred: this is meant for trusted, local-only use (the
/// developer trying their own solutions) until real sandboxing (a separate killable process, or a
/// container with CPU/memory limits) is added — see the README's Pending Enhancements.
/// </summary>
public sealed class RoslynUserSolutionJudge : IUserSolutionJudge
{
    private static readonly ScriptOptions Options = ScriptOptions.Default
        .WithReferences(
            typeof(object).Assembly,
            typeof(System.Linq.Enumerable).Assembly,
            typeof(List<>).Assembly,
            typeof(TreeNode).Assembly)
        .WithImports(
            "System",
            "System.Collections.Generic",
            "System.Linq",
            "AlgoLens.Core.Models");

    public async Task<JudgeResult> RunAsync(
        string userCode,
        string invocationExpression,
        IReadOnlyDictionary<string, object?> args,
        TimeSpan timeout,
        CancellationToken cancellationToken)
    {
        var fullScript = userCode + "\n" + invocationExpression;
        var script = CSharpScript.Create<object>(fullScript, Options, typeof(JudgeGlobals));

        var diagnostics = script.Compile();
        var errors = diagnostics
            .Where(d => d.Severity == DiagnosticSeverity.Error)
            .Select(d => d.ToString())
            .ToList();

        if (errors.Count > 0)
        {
            return new JudgeResult(false, errors, false, null, null, 0);
        }

        var stopwatch = Stopwatch.StartNew();
        var globals = new JudgeGlobals { Args = args };
        var runTask = Task.Run(() => script.RunAsync(globals, cancellationToken), cancellationToken);

        // Swallow exceptions from a run that keeps going after we've already given up on it,
        // so a late-faulting orphaned task doesn't surface as an unobserved task exception.
        _ = runTask.ContinueWith(t => _ = t.Exception, TaskContinuationOptions.OnlyOnFaulted | TaskContinuationOptions.ExecuteSynchronously);

        var winner = await Task.WhenAny(runTask, Task.Delay(timeout, cancellationToken));
        stopwatch.Stop();

        if (winner != runTask)
        {
            return new JudgeResult(true, [], false, $"Timed out after {timeout.TotalSeconds:0.#}s.", null, stopwatch.ElapsedMilliseconds);
        }

        try
        {
            var state = await runTask;
            return new JudgeResult(true, [], true, null, state.ReturnValue, stopwatch.ElapsedMilliseconds);
        }
        catch (Exception ex)
        {
            return new JudgeResult(true, [], false, $"{ex.GetType().Name}: {ex.Message}", null, stopwatch.ElapsedMilliseconds);
        }
    }
}
