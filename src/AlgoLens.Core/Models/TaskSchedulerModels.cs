namespace AlgoLens.Core.Models;

public sealed record TaskSchedulerInput(IReadOnlyList<char> Tasks, int Cooldown);

/// <summary>
/// State snapshot for Task Scheduler at a given CPU tick.
/// </summary>
public sealed record TaskSchedulerState(
    IReadOnlyList<string> Timeline,
    IReadOnlyDictionary<char, int> RemainingCounts,
    IReadOnlyDictionary<char, int> CooldownUntil,
    int CurrentTick
);
