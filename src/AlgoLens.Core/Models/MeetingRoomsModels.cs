namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot for Meeting Rooms II at a given step. `SortedIntervals` is the input sorted
/// by start time ([start, end] pairs). `CurrentIndex` is the meeting currently being processed
/// (-1 outside the main loop). `Heap` holds the end times of rooms currently occupied, sorted
/// for display so the earliest-ending room always appears first — the underlying algorithm
/// uses a real min-heap; this snapshot is just a display-only copy, the same way every other
/// DP algorithm here snapshots its table each step. `RoomsInUse` is `Heap.Count`; `MaxRooms` is
/// the largest it has been so far, which is the answer once the sweep finishes.
/// </summary>
public sealed record MeetingRoomsState(
    IReadOnlyList<IReadOnlyList<int>> SortedIntervals,
    int CurrentIndex,
    IReadOnlyList<int> Heap,
    int RoomsInUse,
    int MaxRooms
);
