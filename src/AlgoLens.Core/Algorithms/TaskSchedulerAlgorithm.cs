using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Task Scheduler via greedy tick-by-tick simulation: at each CPU time unit, run the
/// ready task (not on cooldown) with the highest remaining count, breaking ties
/// alphabetically; idle if nothing is ready. Captures one step per tick.
/// </summary>
public sealed class TaskSchedulerAlgorithm : IAlgorithmVisualizer<TaskSchedulerInput>
{
    public string Id => "task-scheduler";

    public IReadOnlyList<AlgorithmStep> Run(TaskSchedulerInput input)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (input.Tasks.Count == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "No tasks to schedule.",
                new TaskSchedulerState([], new Dictionary<char, int>(), new Dictionary<char, int>(), 0), [], spanLines: 2);
            return steps;
        }

        var remaining = input.Tasks.GroupBy(t => t).ToDictionary(g => g.Key, g => g.Count());
        var cooldownUntil = new Dictionary<char, int>();
        var timeline = new List<char?>();
        var tasksLeft = input.Tasks.Count;
        var tick = 0;

        while (tasksLeft > 0)
        {
            var next = remaining
                .Where(kv => kv.Value > 0 && (!cooldownUntil.TryGetValue(kv.Key, out var availableAt) || availableAt <= tick))
                .OrderByDescending(kv => kv.Value)
                .ThenBy(kv => kv.Key)
                .Select(kv => (char?)kv.Key)
                .FirstOrDefault();

            string action;
            if (next is char task)
            {
                remaining[task]--;
                tasksLeft--;
                cooldownUntil[task] = tick + input.Cooldown + 1;
                timeline.Add(task);
                action = $"Tick {tick}: run '{task}' ({remaining[task]} left); back on cooldown until tick {cooldownUntil[task]}.";
            }
            else
            {
                timeline.Add(null);
                action = $"Tick {tick}: nothing ready — idle.";
            }

            StepRecorder.Add(steps, ref stepNumber,
                action,
                new TaskSchedulerState(
                    timeline.Select(c => c?.ToString() ?? "idle").ToList(),
                    new Dictionary<char, int>(remaining),
                    new Dictionary<char, int>(cooldownUntil),
                    tick),
                next is char t ? [t.ToString()] : [],
                spanLines: 22);

            tick++;
        }

        StepRecorder.Add(steps, ref stepNumber,
            $"Done: {timeline.Count} total CPU time units.",
            new TaskSchedulerState(
                timeline.Select(c => c?.ToString() ?? "idle").ToList(),
                new Dictionary<char, int>(remaining),
                new Dictionary<char, int>(cooldownUntil),
                tick),
            [],
            spanLines: 1);

        return steps;
    }
}
