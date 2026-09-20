namespace AlgoLens.Core.Models;

/// <summary>
/// State snapshot for Trapping Rain Water at a given step, taken after the step's pointer move.
/// `Left`/`Right` are the pointers, `LeftMax`/`RightMax` the tallest bar seen so far from each
/// side. `Current` is the bar processed this step (`-1` on the closing step). `Water[i]` is the
/// water settled on bar `i` so far (`0` for bars not yet processed), and `Total` their sum.
/// </summary>
public sealed record TrappingRainWaterState(
    IReadOnlyList<int> Heights,
    int Left,
    int Right,
    int LeftMax,
    int RightMax,
    int Current,
    IReadOnlyList<int> Water,
    int Total
);
