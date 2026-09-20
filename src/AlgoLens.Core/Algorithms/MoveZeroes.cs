using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Move Zeroes via read/write two pointers, in a single pass: `read` scans the array, and whenever
/// it lands on a non-zero, that value is swapped into the slot `write` points at, then `write`
/// advances. Everything left of `write` is therefore the non-zeros gathered so far (in their
/// original order), and everything from `write` up to `read` is zeros — so each swap sends a zero
/// backwards toward the end while keeping the non-zeros in order. When `read == write` (no zeros
/// seen yet) the swap is with itself, a no-op. Unlike String Compression the array never shrinks,
/// so there is no length to return — the rearranged array itself is the answer. Mutates its
/// input array, exactly like the real problem.
/// </summary>
public sealed class MoveZeroes : IAlgorithmVisualizer<int[]>
{
    public string Id => "move-zeroes";

    public IReadOnlyList<AlgorithmStep> Run(int[] nums)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (nums.Length == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "Array is empty; there is nothing to move.",
                new MoveZeroesState([], -1, 0), [], spanLines: 2);
            return steps;
        }

        var write = 0;

        for (var read = 0; read < nums.Length; read++)
        {
            var writeSlot = write;
            string action;
            if (nums[read] != 0)
            {
                var value = nums[read];
                (nums[write], nums[read]) = (nums[read], nums[write]);
                write++;
                action = writeSlot == read
                    ? $"nums[{read}] = {value} is non-zero and already sits in write slot {writeSlot} — swap with itself."
                    : $"nums[{read}] = {value} is non-zero — swap it into write slot {writeSlot} (the zero there moves to index {read}).";
            }
            else
            {
                action = $"nums[{read}] is zero — skip it; the write pointer stays at {write}.";
            }

            StepRecorder.Add(steps, ref stepNumber, action,
                new MoveZeroesState(nums.ToList(), read, write),
                [read.ToString(), writeSlot.ToString()],
                spanLines: 16);
        }

        StepRecorder.Add(steps, ref stepNumber,
            "Done: every non-zero is in front in its original order, and the zeros are at the end.",
            new MoveZeroesState(nums.ToList(), -1, write),
            [],
            spanLines: 2);

        return steps;
    }
}
