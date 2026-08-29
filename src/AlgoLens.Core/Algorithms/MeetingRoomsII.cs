using AlgoLens.Core.Models;

namespace AlgoLens.Core.Algorithms;

/// <summary>
/// Meeting Rooms II via a greedy min-heap of end times: sort meetings by start time, then
/// process them in order. Before assigning a room to a meeting, check whether the
/// earliest-ending room already in use has freed up (its end time is &lt;= this meeting's
/// start) — if so, reuse that room by popping it from the heap; otherwise a new room is
/// needed. Either way, push this meeting's end time onto the heap — it now occupies a room.
/// The heap size after each push is the number of rooms simultaneously in use at that point,
/// so the largest heap size seen across the whole sweep is the minimum number of rooms
/// required overall.
/// </summary>
public sealed class MeetingRoomsII : IAlgorithmVisualizer<int[][]>
{
    public string Id => "meeting-rooms-ii";

    public IReadOnlyList<AlgorithmStep> Run(int[][] intervals)
    {
        var steps = new List<AlgorithmStep>();
        var stepNumber = 0;

        if (intervals.Length == 0)
        {
            StepRecorder.Add(steps, ref stepNumber, "No meetings to schedule; zero rooms are needed.",
                new MeetingRoomsState([], -1, [], 0, 0), [], spanLines: 2);
            return steps;
        }

        var sorted = intervals.OrderBy(meeting => meeting[0]).ToArray();
        var heap = new PriorityQueue<int, int>();
        var maxRooms = 0;

        IReadOnlyList<IReadOnlyList<int>> SortedSnapshot() =>
            sorted.Select(meeting => (IReadOnlyList<int>)meeting.ToList()).ToList();

        IReadOnlyList<int> HeapSnapshot() =>
            heap.UnorderedItems.Select(item => item.Element).OrderBy(endTime => endTime).ToList();

        for (var i = 0; i < sorted.Length; i++)
        {
            var meeting = sorted[i];
            string action;

            if (heap.Count > 0 && heap.Peek() <= meeting[0])
            {
                var freed = heap.Dequeue();
                action = $"Meeting [{meeting[0]},{meeting[1]}] starts at {meeting[0]}, on or after the earliest room's end time {freed} — reuse that room.";
            }
            else
            {
                action = heap.Count == 0
                    ? $"Meeting [{meeting[0]},{meeting[1]}] is the first meeting — assign it a new room."
                    : $"Meeting [{meeting[0]},{meeting[1]}] starts at {meeting[0]}, before the earliest room frees up at {heap.Peek()} — a new room is needed.";
            }

            heap.Enqueue(meeting[1], meeting[1]);
            maxRooms = Math.Max(maxRooms, heap.Count);
            action += $" {heap.Count} room(s) now in use.";

            StepRecorder.Add(steps, ref stepNumber, action,
                new MeetingRoomsState(SortedSnapshot(), i, HeapSnapshot(), heap.Count, maxRooms),
                [i.ToString()],
                spanLines: 19);
        }

        StepRecorder.Add(steps, ref stepNumber,
            $"Done: the minimum number of rooms required is {maxRooms}.",
            new MeetingRoomsState(SortedSnapshot(), -1, HeapSnapshot(), heap.Count, maxRooms),
            [],
            spanLines: 1);

        return steps;
    }
}
