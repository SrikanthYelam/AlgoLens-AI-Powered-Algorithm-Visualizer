using System.Runtime.CompilerServices;
using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Shared helper for recording an <see cref="AlgorithmStep"/>. Every algorithm calls this
/// immediately after the source lines it wants to describe, instead of constructing
/// <see cref="AlgorithmStep"/> directly. <see cref="CallerLineNumberAttribute"/> resolves the
/// call site's own line at compile time, so the highlighted range (the <paramref name="spanLines"/>
/// lines immediately above the call) stays correct even as unrelated code shifts elsewhere in the
/// file — there's no hand-maintained line-number table to go stale.
/// </summary>
internal static class StepRecorder
{
    public static void Add(
        List<AlgorithmStep> steps,
        ref int stepNumber,
        string action,
        object state,
        IReadOnlyList<string> highlights,
        int spanLines = 1,
        [CallerLineNumber] int callerLine = 0)
    {
        steps.Add(new AlgorithmStep(
            stepNumber++,
            action,
            state,
            highlights,
            callerLine - spanLines,
            callerLine - 1));
    }
}
